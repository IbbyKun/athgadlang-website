"use server";

import { listEvents, listInsights, listWebinars } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search-index";
import type { SearchItem } from "@/lib/search";
import type { Insight } from "@/lib/insights";
import type { Webinar } from "@/lib/webinars";
import { tenantCodes, type TenantCode } from "@/lib/tenants";

/**
 * What the public pages ask for after they have loaded.
 *
 * Everything here exists to keep the first response small. A page that ships a
 * whole archive so the reader can maybe press "View More", or a whole search
 * index so they can maybe type in the box, has spent the visitor's bandwidth on
 * a guess. These actions let the page send what it is showing, and fetch the
 * rest when something actually asks for it.
 *
 * The region arrives from the client, so it is checked against the known codes
 * rather than trusted. Nothing sensitive rests on it — every region's content is
 * public — but an unchecked value would reach the database as a filter.
 */

function regionOf(value: string): TenantCode {
  return tenantCodes.includes(value as TenantCode)
    ? (value as TenantCode)
    : tenantCodes[0];
}

/** One page of articles, for the grid's "View More". */
export async function moreInsights(
  region: string,
  offset: number,
  limit: number,
): Promise<Insight[]> {
  const insights = await listInsights(regionOf(region));

  return insights.slice(Math.max(0, offset), Math.max(0, offset) + limit);
}

/** One page of recorded sessions. */
export async function moreWebinars(
  region: string,
  offset: number,
  limit: number,
): Promise<Webinar[]> {
  const webinars = await listWebinars(regionOf(region));

  return webinars.slice(Math.max(0, offset), Math.max(0, offset) + limit);
}

/**
 * Everything searchable in a region.
 *
 * Fetched when the reader first opens the search box, not embedded in every
 * page. With the article archive published this index runs to a few hundred
 * entries — around 33 KB inside every single page's payload — and most visits
 * never use it. One request on first focus, held for the rest of the session, is
 * the better trade: the box is still instant to type in, and every other page on
 * the site got smaller.
 */
export async function loadSearchIndex(region: string): Promise<SearchItem[]> {
  const tenant = regionOf(region);

  const [insights, webinars, events] = await Promise.all([
    listInsights(tenant),
    listWebinars(tenant),
    listEvents(tenant),
  ]);

  return buildSearchIndex({ insights, webinars, events });
}
