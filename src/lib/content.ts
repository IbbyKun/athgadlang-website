import "server-only";

import { unstable_cache } from "next/cache";

import { images } from "@/lib/images";
import { insights as builtInInsights, type Insight } from "@/lib/insights";
import type { RichDoc } from "@/lib/rich-text";
import {
  readClient,
  type InsightRow,
  type WebinarRow,
} from "@/lib/supabase";
import type { TenantCode } from "@/lib/tenants";
import { webinars as builtInWebinars, type Webinar } from "@/lib/webinars";

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
} as const;

/** How long a list may go unrevalidated if nothing is published. */
const cacheSeconds = 300;

/** Shown when a row has no uploaded cover image. */
const fallbackInsightImage = images.hero.insights;
const fallbackWebinarImage = images.hero.webinars;

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

function toWebinar(row: WebinarRow): Webinar {
  return {
    slug: row.slug,
    title: row.title,
    date: row.published_at,
    duration: row.duration,
    image: row.image_url
      ? { src: row.image_url, alt: row.image_alt || row.title }
      : fallbackWebinarImage,
    youtubeId: row.youtube_id ?? undefined,
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

    return (data as WebinarRow[]).map(toWebinar);
  },
  ["published-webinars"],
  { tags: [contentTags.webinars], revalidate: cacheSeconds },
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
