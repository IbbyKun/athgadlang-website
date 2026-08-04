import "server-only";

import { unstable_cache } from "next/cache";

import { events as builtInEvents, type EventItem } from "@/lib/events";
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

/** How long a list may go unrevalidated if nothing is published. */
const cacheSeconds = 300;

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

function toInsight(row: InsightRow): Insight {
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
    richBody: (row.body ?? undefined) as RichDoc | undefined,
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

function toEvent(row: EventRow): EventItem {
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
    // Not captured by the admin form yet, so a managed event has no presenter
    // list or running order and those sections of its page do not render.
    speakers: [],
    richBody: (row.body ?? undefined) as EventItem["richBody"],
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
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      // A database that is down must not take the site down with it: the
      // built-in articles are still worth serving.
      console.error("[content] could not load insights", error.message);
      return [];
    }

    return (data as InsightRow[]).map(toInsight);
  },
  ["published-insights"],
  { tags: [contentTags.insights], revalidate: cacheSeconds },
);

const publishedWebinars = unstable_cache(
  async (): Promise<Webinar[]> => {
    const supabase = readClient();
    if (!supabase) return [];

    const { data, error } = await supabase
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
      .select("*")
      .eq("published", true)
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[content] could not load events", error.message);
      return [];
    }

    return (data as EventRow[]).map(toEvent);
  },
  ["published-events"],
  { tags: [contentTags.events], revalidate: cacheSeconds },
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

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
