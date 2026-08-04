import type { RichDoc } from "@/lib/rich-text";
import type { TenantCode } from "@/lib/tenants";

/** One element of an article body, rendered in order by <InsightBody>. */
export type InsightBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type Insight = {
  /**
   * URL segment: /insights/<slug>. Unique, because it addresses the article.
   */
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — formatted at render time via `formatDate`. */
  date: string;
  /** Byline. Falls back to `insightByline` when the author is not named. */
  author?: string;
  image: { src: string; alt: string };
  /**
   * Regions the article appears on. Absent means every region — which is what
   * the built-in articles below are, since they predate regional targeting.
   */
  regions?: TenantCode[];
  /**
   * Structural body used by the built-in articles. The first paragraph is
   * rendered as the lead.
   */
  body?: InsightBlock[];
  /**
   * Rich text body, as written in the admin editor. Takes precedence over
   * `body` when both are present.
   */
  richBody?: RichDoc;
  /** True for articles loaded from the database, for the admin's benefit. */
  managed?: boolean;
};

/** Shown when an article carries no named author. */
export const insightByline = "athGADLANG Insights Team";

/**
 * Built-in articles: none.
 *
 * There were sixteen here, written to fill the site before there was a database.
 * The real archive lives in Supabase now — imported from the newsletter tracker
 * and edited at /admin/insights — so keeping invented articles alongside it would
 * only mean two versions of the same section.
 *
 * The array stays so that the merge in src/lib/content.ts keeps both halves: an
 * article can still ship with the code if one ever needs to.
 */
export const insights: Insight[] = [];

export function insightHref(insight: Insight) {
  return `/insights/${insight.slug}`;
}

/**
 * The helpers below take the list to work against, because the list a page
 * renders is no longer just the array above — it is the built-in articles
 * merged with the region's published rows from the database. Callers on the
 * public site pass the merged list from `src/lib/content.ts`; the default
 * keeps the built-in articles usable on their own.
 */

/** The article for a URL segment, or undefined so the route can 404. */
export function getInsight(slug: string, list: Insight[] = insights) {
  return list.find((insight) => insight.slug === slug);
}

/**
 * The articles either side of this one, in publication order: `previous` is
 * the one published before it, `next` the one after. Undefined at each end.
 *
 * Matched by slug rather than by reference: the caller's list is rebuilt on
 * every request, so the object passed in is not the one inside it.
 */
export function adjacentInsights(insight: Insight, list: Insight[] = insights) {
  const index = list.findIndex((item) => item.slug === insight.slug);
  if (index === -1) return { previous: undefined, next: undefined };

  return {
    previous: list[index + 1],
    next: list[index - 1],
  };
}

/** Same category first, then the most recent — never the article itself. */
export function relatedInsights(
  insight: Insight,
  limit = 4,
  list: Insight[] = insights,
) {
  const others = list.filter((item) => item.slug !== insight.slug);
  const sameCategory = others.filter(
    (item) => item.category === insight.category,
  );
  const rest = others.filter((item) => item.category !== insight.category);

  return [...sameCategory, ...rest].slice(0, limit);
}
