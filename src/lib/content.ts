import "server-only";

import { unstable_cache } from "next/cache";

import {
  events as builtInEvents,
  parseAgenda,
  parseSpeakers,
  type EventItem,
} from "@/lib/events";
import { images } from "@/lib/images";
import { insights as builtInInsights, type Insight } from "@/lib/insights";
import type { RichDoc } from "@/lib/rich-text";
import {
  readClient,
  type EventRow,
  type InsightRow,
  type WebinarRow,
} from "@/lib/supabase";
import type { TenantCode } from "@/lib/tenants";
import { webinars as builtInWebinars, type Webinar } from "@/lib/webinars";
import { youtubeThumbnail } from "@/lib/youtube";

/**
 * What the public site reads.
 *
 * Two sources sit behind these functions: the articles and sessions written
 * into `src/lib`, and the rows the admin panel publishes to Supabase. Pages
 * see one merged, region-filtered, newest-first list and do not care which
 * source an item came from.
 *
 * The built-in content stays where it is on purpose — it predates the database
 * and is what the site falls back to when no Supabase project is attached, so
 * the site still builds and renders on a clean checkout.
 */

/** Cache tags, so publishing from the admin panel refreshes the public pages. */
export const contentTags = {
  insights: "insights",
  webinars: "webinars",
  events: "events",
} as const;

/**
 * How long a list may go unrevalidated if nothing is published.
 *
 * A day, matching the page-level `revalidate` — see the insights index for why
 * five minutes was expensive. Publishing invalidates these tags directly, so
 * this only bounds how long a change made outside the admin panel can go
 * unnoticed.
 */
const cacheSeconds = 86400;

/**
 * Columns a listing needs — everything except `body`.
 *
 * Named explicitly rather than `select("*")` because the body is the whole
 * article, and on a catalogue of any size it dwarfs everything else: with 154
 * articles published, `*` moved 1.5 MB to render eight summary cards, and 95% of
 * that was bodies nothing on the page could display. Worse than slow, it was
 * fragile — the read below returns an empty list when it fails rather than
 * taking the site down, so a response that large timing out under load silently
 * produced a blank listing.
 *
 * The card summary is `excerpt`, a column of its own, so cards are unaffected.
 * A body is fetched when someone opens the article, by `publishedInsight`.
 */
const insightListColumns =
  "slug, title, excerpt, category, author, published_at, image_url, image_alt, regions";

const eventListColumns =
  "slug, title, kind, event_date, start_time, timezone, mode, venue, price," +
  " access, excerpt, image_url, image_alt, register_url, recording_url, regions";

/**
 * What a narrowed read returns: the row without the columns it did not ask for.
 * Spelled out so that dropping a column from the lists above is a type error
 * here rather than an undefined field on the page.
 */
type InsightListRow = Omit<
  InsightRow,
  "id" | "body" | "published" | "created_at" | "updated_at"
>;
type EventListRow = Omit<
  EventRow,
  | "id"
  | "body"
  | "speakers"
  | "agenda"
  | "published"
  | "created_at"
  | "updated_at"
>;

/** Shown when a row has no uploaded cover image. */
const fallbackInsightImage = images.hero.insights;
const fallbackWebinarImage = images.hero.webinars;
const fallbackEventImage = images.hero.events;

/** An item with no explicit regions is global; otherwise it must name this one. */
function visibleIn(tenant: TenantCode) {
  return (item: { regions?: TenantCode[] }) =>
    !item.regions?.length || item.regions.includes(tenant);
}

/** Newest first. Ties broken by title so the order is stable across renders. */
function byDateDesc(a: { date: string; title: string }, b: typeof a) {
  return b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
}

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

function toInsight(row: InsightListRow, body?: unknown): Insight {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at,
    author: row.author ?? undefined,
    image: row.image_url
      ? { src: row.image_url, alt: row.image_alt || row.title }
      : fallbackInsightImage,
    regions: row.regions,
    richBody: (body ?? undefined) as RichDoc | undefined,
    managed: true,
  };
}

/**
 * The largest still YouTube actually holds for a video.
 *
 * The 1280x720 one exists only for videos uploaded at that resolution or
 * better, and a 404 upstream is a broken image on the page — the optimiser
 * cannot resize what it cannot fetch. So ask before pointing a card at it, and
 * fall back to the 480x360 still, which every video has.
 *
 * One request per session, and only for sessions with no uploaded artwork. It
 * happens inside the cached read below, so it is paid when a list is built
 * rather than when a page is served, and a network failure just means the
 * smaller still.
 */
async function youtubeStill(id: string) {
  const largest = youtubeThumbnail(id, "max");
  const response = await fetch(largest, { method: "HEAD" }).catch(() => null);

  return response?.ok ? largest : youtubeThumbnail(id, "hq");
}

/**
 * A session's artwork: what the editor uploaded, or failing that the still from
 * the video itself.
 *
 * For a recording the video's own still is usually the picture you wanted
 * anyway, so pasting the YouTube link is enough to get a card that looks right.
 * Uploading one still wins — it is how you override a still you do not like.
 */
async function webinarImage(row: WebinarRow) {
  const alt = row.image_alt || row.title;

  if (row.image_url) return { src: row.image_url, alt };
  if (row.youtube_id) return { src: await youtubeStill(row.youtube_id), alt };

  return fallbackWebinarImage;
}

async function toWebinar(row: WebinarRow): Promise<Webinar> {
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_at,
    duration: row.duration,
    image: await webinarImage(row),
    youtubeId: row.youtube_id ?? undefined,
    regions: row.regions,
    managed: true,
  };
}

function toEvent(row: EventListRow, body?: unknown): EventItem {
  return {
    slug: row.slug,
    title: row.title,
    kind: row.kind,
    date: row.event_date,
    time: row.start_time,
    timezone: row.timezone,
    mode: row.mode,
    venue: row.venue || undefined,
    price: row.price || undefined,
    access: row.access || undefined,
    excerpt: row.excerpt,
    image: row.image_url
      ? { src: row.image_url, alt: row.image_alt || row.title }
      : fallbackEventImage,
    registerUrl: row.register_url || undefined,
    recordingUrl: row.recording_url || undefined,
    // Empty here by design: presenters and running order are not in the list
    // columns because no card shows them. `withEventBody` fills them in for the
    // one page that does.
    speakers: [],
    richBody: (body ?? undefined) as EventItem["richBody"],
    regions: row.regions,
    managed: true,
  };
}

// ---------------------------------------------------------------------------
// Cached reads
// ---------------------------------------------------------------------------

/**
 * Every published row, cached under one tag and filtered per region in memory.
 *
 * One query for all regions rather than one per region: the catalogue is small,
 * and a single cache entry means publishing invalidates one thing instead of
 * five. Row level security limits the anon key to published rows, so an
 * unpublished draft cannot come back from here even if the filter were dropped.
 */
const publishedInsights = unstable_cache(
  async (): Promise<Insight[]> => {
    const supabase = readClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("insights")
      .select(insightListColumns)
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      // A database that is down must not take the site down with it: the
      // built-in articles are still worth serving.
      console.error("[content] could not load insights", error.message);
      return [];
    }

    return (data as unknown as InsightListRow[]).map((row) => toInsight(row));
  },
  ["published-insights"],
  { tags: [contentTags.insights], revalidate: cacheSeconds },
);

const publishedWebinars = unstable_cache(
  async (): Promise<Webinar[]> => {
    const supabase = readClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      // No body column here, so this is already only what a card needs.
      .from("webinars")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[content] could not load webinars", error.message);
      return [];
    }

    // Parallel: each row may need to ask YouTube which still it has.
    return Promise.all((data as WebinarRow[]).map((row) => toWebinar(row)));
  },
  ["published-webinars"],
  { tags: [contentTags.webinars], revalidate: cacheSeconds },
);

const publishedEvents = unstable_cache(
  async (): Promise<EventItem[]> => {
    const supabase = readClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("events")
      .select(eventListColumns)
      .eq("published", true)
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[content] could not load events", error.message);
      return [];
    }

    return (data as unknown as EventListRow[]).map((row) => toEvent(row));
  },
  ["published-events"],
  { tags: [contentTags.events], revalidate: cacheSeconds },
);

/**
 * One article, with its body.
 *
 * The counterpart to the narrowed lists above: they carry everything a card
 * needs and no bodies at all, so the page that actually shows an article fetches
 * that one body here. Cached per slug and under the same tag, so publishing
 * refreshes it and a reader who opens the same article twice pays for one read.
 */
const publishedInsightBody = unstable_cache(
  async (slug: string): Promise<unknown> => {
    const supabase = readClient();
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from("insights")
      .select("body")
      .eq("published", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[content] could not load article body", error.message);
      return undefined;
    }

    return (data as { body?: unknown } | null)?.body;
  },
  ["published-insight-body"],
  { tags: [contentTags.insights], revalidate: cacheSeconds },
);

/**
 * The three columns only an event's own page needs.
 *
 * Presenters and running order ride along with the body rather than joining the
 * list columns, because nothing on a card shows either of them — putting them in
 * the listing would move every speaker on every event to render a grid that
 * cannot display them, which is the mistake `eventListColumns` exists to avoid.
 */
const publishedEventDetail = unstable_cache(
  async (slug: string) => {
    const supabase = readClient();
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from("events")
      .select("body, speakers, agenda")
      .eq("published", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("[content] could not load event detail", error.message);
      return undefined;
    }

    return (data ?? undefined) as
      | { body?: unknown; speakers?: unknown; agenda?: unknown }
      | undefined;
  },
  ["published-event-detail"],
  { tags: [contentTags.events], revalidate: cacheSeconds },
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * The same article with its body attached.
 *
 * Listings deliberately carry no bodies, so the page that renders one asks for
 * it here. Built-in articles already hold theirs in the source, so for those this
 * is a no-op and costs no read.
 */
export async function withInsightBody(insight: Insight): Promise<Insight> {
  if (!insight.managed) return insight;

  return {
    ...insight,
    richBody: (await publishedInsightBody(insight.slug)) as RichDoc | undefined,
  };
}

/**
 * As `withInsightBody`, plus the two lists a card never shows: the presenters
 * and the running order.
 *
 * Both come back from `jsonb` and are narrowed rather than cast, because a
 * malformed entry should cost one line of a page and not the whole render.
 */
export async function withEventBody(event: EventItem): Promise<EventItem> {
  if (!event.managed) return event;

  const detail = await publishedEventDetail(event.slug);

  return {
    ...event,
    richBody: detail?.body as EventItem["richBody"],
    speakers: parseSpeakers(detail?.speakers),
    agenda: parseAgenda(detail?.agenda),
  };
}

/**
 * Articles for a region, newest first.
 *
 * A published row wins over a built-in article of the same slug, which is the
 * migration path: when a built-in article is re-entered in the admin panel, it
 * replaces the hardcoded one without anyone having to delete the TypeScript.
 */
export async function listInsights(tenant: TenantCode): Promise<Insight[]> {
  const managed = await publishedInsights();
  const managedSlugs = new Set(managed.map((insight) => insight.slug));

  return [
    ...managed,
    ...builtInInsights.filter((insight) => !managedSlugs.has(insight.slug)),
  ]
    .filter(visibleIn(tenant))
    .sort(byDateDesc);
}

/** Sessions for a region, newest first. Same precedence rule as articles. */
export async function listWebinars(tenant: TenantCode): Promise<Webinar[]> {
  const managed = await publishedWebinars();
  const managedSlugs = new Set(managed.map((webinar) => webinar.slug));

  return [
    ...managed,
    ...builtInWebinars.filter((webinar) => !managedSlugs.has(webinar.slug)),
  ]
    .filter(visibleIn(tenant))
    .sort(byDateDesc);
}

/**
 * Events for a region. Not split into upcoming and past here — that depends on
 * today's date, and `splitEvents` in src/lib/events.ts owns it. Same precedence
 * rule as articles: a published row replaces a built-in event of the same slug.
 */
export async function listEvents(tenant: TenantCode): Promise<EventItem[]> {
  const managed = await publishedEvents();
  const managedSlugs = new Set(managed.map((event) => event.slug));

  return [
    ...managed,
    ...builtInEvents.filter((event) => !managedSlugs.has(event.slug)),
  ].filter(visibleIn(tenant));
}

/** Every event slug that has a page, across every region. */
export async function allEventSlugs(): Promise<string[]> {
  const managed = await publishedEvents();

  return [
    ...new Set([
      ...managed.map((event) => event.slug),
      ...builtInEvents.map((event) => event.slug),
    ]),
  ];
}

/**
 * Every article slug that has a page, across every region — what
 * `generateStaticParams` needs. Regional filtering happens when the page
 * renders, so a slug listed here for the wrong region still 404s.
 */
export async function allInsightSlugs(): Promise<string[]> {
  const managed = await publishedInsights();

  return [
    ...new Set([
      ...managed.map((insight) => insight.slug),
      ...builtInInsights.map((insight) => insight.slug),
    ]),
  ];
}
