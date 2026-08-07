"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { parseRegions, type FormState } from "@/lib/admin/form";
import {
  endSession,
  hasSession,
  isValidPassword,
  startSession,
} from "@/lib/admin/session";
import { contentTags } from "@/lib/content";
import {
  parseAgenda,
  parseSpeakers,
  type EventAgendaItem,
  type EventSpeaker,
} from "@/lib/events";
import { leaderSlugs } from "@/lib/leaders";
import { isRichDocEmpty, sanitizeRichDoc, type RichDoc } from "@/lib/rich-text";
import { slugify } from "@/lib/slug";
import { contentBucket, writeClient } from "@/lib/supabase";
import { parseYoutubeId } from "@/lib/youtube";

/**
 * Every write the admin panel can make.
 *
 * Server Actions are reachable by direct POST, not only through the forms that
 * call them, so each one re-checks the session itself rather than trusting the
 * layout that rendered the form. `guard()` is that check; it is the first line
 * of every exported function below.
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

const notConfigured =
  "Supabase is not configured. Add the project URL and service role key to .env.local.";

async function guard() {
  if (!(await hasSession())) {
    throw new Error("Not signed in.");
  }
}

/** Reads a trimmed string field. */
function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Reads a checkbox. Unchecked boxes are absent from the payload entirely. */
function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

/**
 * Marks the public pages as out of date.
 *
 * `expire: 0` rather than the recommended `"max"` profile: the person who just
 * pressed Publish is about to go and look at the site, and stale-while-
 * revalidate would show them the previous version. Traffic here is one editor,
 * so the blocking re-render costs nothing worth saving.
 *
 * The paths carry their dynamic segments as patterns, which revalidates the
 * route across every region at once.
 */
function refresh(kind: "insights" | "webinars" | "events") {
  revalidateTag(contentTags[kind], { expire: 0 });

  revalidatePath("/[tenant]", "page");
  revalidatePath(`/[tenant]/${kind}`, "page");

  // The two that have a page per item.
  if (kind === "insights") revalidatePath("/[tenant]/insights/[slug]", "page");
  if (kind === "events") revalidatePath("/[tenant]/events/[slug]", "page");
}

/** True for a link a browser can actually follow. */
function isHttpUrl(value: string) {
  const url = URL.parse(value);
  return url?.protocol === "https:" || url?.protocol === "http:";
}

/** Turns a Supabase error into something an editor can act on. */
function describe(message: string) {
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "That URL slug is already taken. Choose a different one.";
  }
  if (message.includes("does not exist")) {
    return "The database tables are missing. Run `npm run db:push` to apply the migrations.";
  }
  return message;
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function signIn(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = text(formData, "password");

  if (!password) {
    return { errors: { password: "Enter the admin password." } };
  }

  if (!(await isValidPassword(password))) {
    // Deliberately vague, and identical whether or not a password is
    // configured at all: the form must not report on the server's setup.
    return { message: "That password was not recognised." };
  }

  await startSession();

  // Outside the checks above because redirect() works by throwing.
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Image upload
// ---------------------------------------------------------------------------

/** Storage prefixes the upload field may write to. */
const uploadFolders = ["insights", "webinars", "events"];

/**
 * 4 MB. Cover images are resized on delivery, so nothing larger is useful.
 *
 * Must stay in step with `file_size_limit` on the content bucket — see
 * supabase/migrations/20260807114500_content_bucket_limits.sql. This constant
 * produces the readable error; the bucket is what actually refuses the file.
 */
const maxImageBytes = 4 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/**
 * Authorises one upload and says where to put it.
 *
 * The browser then PUTs the file straight to Storage, so it never passes through
 * a Vercel function. That is not a micro-optimisation: the previous version
 * streamed the file through this action, where Next.js caps action request
 * bodies at 1 MB, so every cover image larger than that was rejected by the
 * framework before this code ran. The panel advertised 5 MB, the action checked
 * 5 MB, and the upload died at 1 MB with an error the client could only report
 * as "your session may have expired". Nothing had ever been uploaded
 * successfully.
 *
 * What this returns is a bearer credential, so treat the checks below as
 * advisory: they decide whether to hand out a URL, not what Storage will accept
 * once it exists. The bucket carries its own size and MIME limits for that.
 */
export async function createUploadUrl(input: {
  folder: string;
  fileName: string;
  contentType: string;
  size: number;
}): Promise<{ signedUrl?: string; publicUrl?: string; error?: string }> {
  await guard();

  const folder = uploadFolders.includes(input.folder)
    ? input.folder
    : "insights";

  if (!allowedImageTypes.includes(input.contentType)) {
    return { error: "Use a JPEG, PNG, WebP or AVIF image." };
  }
  if (!Number.isFinite(input.size) || input.size <= 0) {
    return { error: "Choose an image to upload." };
  }
  if (input.size > maxImageBytes) {
    return { error: "That image is over 4 MB. Compress it and try again." };
  }

  const supabase = writeClient();
  if (!supabase) return { error: notConfigured };

  // Random name, original extension. The editor's filename is not used: it can
  // collide, and it can contain characters the storage API would reject.
  const extension = input.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExtension = /^[a-z0-9]{1,5}$/.test(extension) ? extension : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${safeExtension}`;

  const { data, error } = await supabase.storage
    .from(contentBucket)
    .createSignedUploadUrl(path);

  if (error) {
    if (error.message.toLowerCase().includes("bucket not found")) {
      return {
        error:
          "The 'content' storage bucket is missing. Run `npm run db:push` to apply the migrations.",
      };
    }
    return { error: error.message };
  }

  // Both handed back now: the browser uploads to the signed URL, and the form
  // carries the public one. Deriving the public URL here keeps the storage
  // layout in this file rather than spreading it into the client.
  const { data: pub } = supabase.storage
    .from(contentBucket)
    .getPublicUrl(data.path);

  return { signedUrl: data.signedUrl, publicUrl: pub.publicUrl };
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export async function saveInsight(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const excerpt = text(formData, "excerpt");
  const category = text(formData, "category");
  const author = text(formData, "author");
  const publishedAt = text(formData, "published_at");
  const imageUrl = text(formData, "image_url");
  const imageAlt = text(formData, "image_alt");
  const regions = parseRegions(formData.getAll("regions"));
  const published = checked(formData, "published");

  let body: RichDoc;
  try {
    body = JSON.parse(text(formData, "body") || "null");
  } catch {
    return { message: "The article body could not be read. Try saving again." };
  }

  const errors: Record<string, string> = {};

  if (!title) errors.title = "Give the article a title.";
  if (!slug) errors.slug = "The URL slug cannot be empty.";
  if (!excerpt) errors.excerpt = "Write a short excerpt for the card.";
  if (!category) errors.category = "Choose a category.";
  if (!publishedAt) errors.published_at = "Set a publication date.";
  if (!regions.length) errors.regions = "Choose at least one region.";

  // Only enforced on publish: a draft is somewhere to leave unfinished work.
  if (published) {
    if (!imageUrl) errors.image_url = "A published article needs a cover image.";
    if (!body || isRichDocEmpty(body)) errors.body = "The article is empty.";
  }

  if (Object.keys(errors).length) {
    return { errors, message: "Check the highlighted fields." };
  }

  const supabase = writeClient();
  if (!supabase) return { message: notConfigured };

  const row = {
    slug,
    title,
    excerpt,
    category,
    author: author || null,
    published_at: publishedAt,
    image_url: imageUrl,
    image_alt: imageAlt || title,
    body: sanitizeRichDoc(body ?? { type: "doc", content: [] }),
    regions,
    published,
  };

  const { error } = id
    ? await supabase.from("insights").update(row).eq("id", id)
    : await supabase.from("insights").insert(row);

  if (error) return { message: describe(error.message) };

  refresh("insights");
  redirect("/admin/insights");
}

export async function deleteInsight(formData: FormData) {
  await guard();

  const id = text(formData, "id");
  if (!id) return;

  const supabase = writeClient();
  if (!supabase) return;

  // The cover image is left in storage on purpose: an article is often deleted
  // and re-created, and an orphaned file costs far less than a broken image.
  await supabase.from("insights").delete().eq("id", id);

  refresh("insights");
  redirect("/admin/insights");
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function saveEvent(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const kind = text(formData, "kind") === "seminar" ? "seminar" : "webinar";
  const date = text(formData, "event_date");
  const startTime = text(formData, "start_time");
  const timezone = text(formData, "timezone");
  const mode = text(formData, "mode") === "venue" ? "venue" : "online";
  const venue = text(formData, "venue");
  // The radio only decides whether the price field is read at all — an event
  // switched back to free must not keep a stale price on the row.
  const paid = text(formData, "pricing") === "paid";
  const price = paid ? text(formData, "price") : "";
  const access = text(formData, "access");
  const excerpt = text(formData, "excerpt");
  const imageUrl = text(formData, "image_url");
  const imageAlt = text(formData, "image_alt");
  const registerUrl = text(formData, "register_url");
  const recordingUrl = text(formData, "recording_url");
  const regions = parseRegions(formData.getAll("regions"));
  const published = checked(formData, "published");

  let body: RichDoc;
  try {
    body = JSON.parse(text(formData, "body") || "null");
  } catch {
    return { message: "The event details could not be read. Try saving again." };
  }

  /*
    Presenters and running order arrive as JSON from a hidden input, the same way
    the rich text body does. Parsed through the public reader in lib/events, so
    the shape the database gets is exactly the shape the page will accept — the
    alternative is two definitions of a valid row that drift apart.

    That parser drops entries with no name or no title, which is what makes a
    half-typed row harmless. `leader` is checked against the roster here rather
    than in the parser: the roster is a codebase concern and the parser also runs
    on the way out, where a slug that has since been retired should still render
    as initials rather than vanish.
  */
  let speakers: EventSpeaker[];
  let agenda: EventAgendaItem[];
  try {
    speakers = parseSpeakers(JSON.parse(text(formData, "speakers") || "[]"));
    agenda = parseAgenda(JSON.parse(text(formData, "agenda") || "[]"));
  } catch {
    return {
      message: "The presenters and running order could not be read. Try saving again.",
    };
  }

  // Widened to string: leaderSlugs is a union of the eleven literals, and the
  // value being checked is whatever the form posted.
  const knownLeaders = new Set<string>(leaderSlugs);
  speakers = speakers.map((speaker) =>
    speaker.leader && knownLeaders.has(speaker.leader)
      ? speaker
      : // Dropped rather than kept: a slug that matches nobody would render as
        // initials anyway, and storing it invites the belief that it works.
        { name: speaker.name, role: speaker.role },
  );

  const errors: Record<string, string> = {};

  if (!title) errors.title = "Give the event a title.";
  if (!slug) errors.slug = "The URL slug cannot be empty.";
  if (!excerpt) errors.excerpt = "Write a short summary for the card.";
  if (!date) errors.event_date = "Set the date it runs.";
  if (!startTime) errors.start_time = "Set the timings, e.g. 12:00 – 13:00.";
  if (!timezone) errors.timezone = "Say which timezone those times are in.";
  if (mode === "venue" && !venue) {
    errors.venue = "Give the venue — an in-person event needs somewhere to be.";
  }
  if (paid && !price) {
    errors.price = "Give the price, or switch the event back to free.";
  }
  if (registerUrl && !isHttpUrl(registerUrl)) {
    errors.register_url = "That does not look like a link. It should start with https://";
  }
  if (recordingUrl && !isHttpUrl(recordingUrl)) {
    errors.recording_url = "That does not look like a link. It should start with https://";
  }
  if (!regions.length) errors.regions = "Choose at least one region.";

  // Only enforced on publish: a draft is somewhere to leave unfinished work.
  if (published) {
    if (!imageUrl) errors.image_url = "A published event needs a banner image.";
    if (!body || isRichDocEmpty(body)) errors.body = "The event details are empty.";
  }

  if (Object.keys(errors).length) {
    return { errors, message: "Check the highlighted fields." };
  }

  const supabase = writeClient();
  if (!supabase) return { message: notConfigured };

  const row = {
    slug,
    title,
    kind,
    event_date: date,
    start_time: startTime,
    timezone,
    mode,
    // Cleared when the event is online, so switching mode cannot leave a venue
    // behind that the page would then have to decide whether to trust.
    venue: mode === "venue" ? venue : "",
    price,
    access,
    excerpt,
    image_url: imageUrl,
    image_alt: imageAlt || title,
    register_url: registerUrl,
    recording_url: recordingUrl,
    body: sanitizeRichDoc(body ?? { type: "doc", content: [] }),
    speakers,
    agenda,
    regions,
    published,
  };

  const { error } = id
    ? await supabase.from("events").update(row).eq("id", id)
    : await supabase.from("events").insert(row);

  if (error) return { message: describe(error.message) };

  refresh("events");
  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  await guard();

  const id = text(formData, "id");
  if (!id) return;

  const supabase = writeClient();
  if (!supabase) return;

  await supabase.from("events").delete().eq("id", id);

  refresh("events");
  redirect("/admin/events");
}

// ---------------------------------------------------------------------------
// Webinars
// ---------------------------------------------------------------------------

export async function saveWebinar(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await guard();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const publishedAt = text(formData, "published_at");
  const duration = text(formData, "duration");
  const youtubeInput = text(formData, "youtube_id");
  const youtubeId = parseYoutubeId(youtubeInput);
  const imageUrl = text(formData, "image_url");
  const imageAlt = text(formData, "image_alt");
  const regions = parseRegions(formData.getAll("regions"));
  const published = checked(formData, "published");

  const errors: Record<string, string> = {};

  if (!title) errors.title = "Give the session a title.";
  if (!slug) errors.slug = "The identifier cannot be empty.";
  if (!publishedAt) errors.published_at = "Set the date it aired.";
  if (!regions.length) errors.regions = "Choose at least one region.";
  if (youtubeInput && !youtubeId) {
    errors.youtube_id = "That does not look like a YouTube link or video id.";
  }

  // No thumbnail requirement here, unlike articles and events: a session
  // cannot be published without a YouTube link, and a link is all the card
  // needs to show the video's own still.
  if (published && !youtubeId) {
    errors.youtube_id =
      "A published session needs a YouTube link — the card has nothing to open without one.";
  }

  if (Object.keys(errors).length) {
    return { errors, message: "Check the highlighted fields." };
  }

  const supabase = writeClient();
  if (!supabase) return { message: notConfigured };

  const row = {
    slug,
    title,
    published_at: publishedAt,
    duration,
    youtube_id: youtubeId || null,
    image_url: imageUrl,
    image_alt: imageAlt || title,
    regions,
    published,
  };

  const { error } = id
    ? await supabase.from("webinars").update(row).eq("id", id)
    : await supabase.from("webinars").insert(row);

  if (error) return { message: describe(error.message) };

  refresh("webinars");
  redirect("/admin/webinars");
}

export async function deleteWebinar(formData: FormData) {
  await guard();

  const id = text(formData, "id");
  if (!id) return;

  const supabase = writeClient();
  if (!supabase) return;

  await supabase.from("webinars").delete().eq("id", id);

  refresh("webinars");
  redirect("/admin/webinars");
}
