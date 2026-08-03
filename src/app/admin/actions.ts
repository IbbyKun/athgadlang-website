"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { parseRegions, slugify, type FormState } from "@/lib/admin/form";
import {
  endSession,
  hasSession,
  isValidPassword,
  startSession,
} from "@/lib/admin/session";
import { contentTags } from "@/lib/content";
import { isRichDocEmpty, sanitizeRichDoc, type RichDoc } from "@/lib/rich-text";
import { contentBucket, writeClient } from "@/lib/supabase";

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
    return "The database tables are missing. Run supabase/schema.sql in the Supabase SQL editor.";
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

/** 5 MB. Cover images are resized on delivery, so nothing larger is useful. */
const maxImageBytes = 5 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/**
 * Stores a cover image and returns its public URL.
 *
 * Called straight from the upload field rather than on form submit, so the
 * editor sees the picture before saving and the form only ever carries a URL.
 */
export async function uploadImage(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await guard();

  const file = formData.get("file");
  const requested = text(formData, "folder");
  const folder = uploadFolders.includes(requested) ? requested : "insights";

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!allowedImageTypes.includes(file.type)) {
    return { error: "Use a JPEG, PNG, WebP or AVIF image." };
  }
  if (file.size > maxImageBytes) {
    return { error: "That image is over 5 MB. Compress it and try again." };
  }

  const supabase = writeClient();
  if (!supabase) return { error: notConfigured };

  // Random name, original extension. The editor's filename is not used: it can
  // collide, and it can contain characters the storage API would reject.
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(contentBucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    if (error.message.toLowerCase().includes("bucket not found")) {
      return {
        error:
          "The 'content' storage bucket is missing. Run supabase/schema.sql in the Supabase SQL editor.",
      };
    }
    return { error: error.message };
  }

  const { data } = supabase.storage.from(contentBucket).getPublicUrl(path);
  return { url: data.publicUrl };
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

/**
 * Accepts anything YouTube shows in an address bar and reduces it to the id.
 * Editors paste the URL from the browser far more often than the bare id.
 */
function parseYoutubeId(value: string) {
  if (!value) return "";
  if (/^[\w-]{11}$/.test(value)) return value;

  const url = URL.parse(value);
  if (!url) return "";

  if (url.hostname.endsWith("youtu.be")) {
    return url.pathname.slice(1).split("/")[0];
  }

  const fromQuery = url.searchParams.get("v");
  if (fromQuery) return fromQuery;

  // /embed/<id>, /live/<id>, /shorts/<id>
  const segments = url.pathname.split("/").filter(Boolean);
  return segments.length > 1 ? segments[segments.length - 1] : "";
}

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

  if (published) {
    if (!imageUrl) errors.image_url = "A published session needs a thumbnail.";
    if (!youtubeId) {
      errors.youtube_id =
        "A published session needs a YouTube link — the card has nothing to open without one.";
    }
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
