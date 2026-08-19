import "server-only";

import { readClient } from "@/lib/supabase";
import type { TenantCode } from "@/lib/tenants";
import { parseYoutubeId, youtubeThumbnail, youtubeWatchUrl } from "@/lib/youtube";

/** A stored popup, mirroring supabase/migrations/. */
export type SitePopupRow = {
  id: string;
  title: string;
  body: string;
  youtube_id: string | null;
  event_slug: string | null;
  cta_label: string;
  regions: TenantCode[];
  starts_on: string | null;
  ends_on: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export const popupTable = "site_popups";

/**
 * What the browser is told about a popup.
 *
 * Deliberately narrow: the decision about which popup to show, and whether one
 * applies at all, is made on the server. The browser gets a headline, a link
 * and an id to remember dismissing — not a table row.
 */
export type Popup = {
  /** Remembered in localStorage, so a new popup shows again after a dismissal. */
  id: string;
  title: string;
  body: string;
  /** Where the button goes. Absent for an announcement with nothing to open. */
  href?: string;
  /** True when `href` leaves the site, so the link opens in a new tab. */
  external?: boolean;
  label?: string;
  /** The video's still, when the popup is about a recording. */
  image?: string;
};

/**
 * The popup a region should be showing, or null.
 *
 * Read with the anon key and the published-only policy, so an unpublished
 * draft cannot be reached even by asking for it directly.
 *
 * Dates are compared in SQL against today rather than filtered in JS, because
 * "today" has to be the moment of the request: this is served from a route
 * handler with a short cache, and a window that opens at midnight should open
 * without a deploy.
 */
export async function activePopup(tenant: TenantCode): Promise<Popup | null> {
  const client = readClient();
  if (!client) return null;

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await client
    .from(popupTable)
    .select("*")
    .eq("published", true)
    .contains("regions", [tenant])
    .or(`starts_on.is.null,starts_on.lte.${today}`)
    .or(`ends_on.is.null,ends_on.gte.${today}`)
    // Newest wins. Two live popups is a mistake rather than a feature, and the
    // most recently created is the likelier intent.
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !data?.length) return null;

  return toPopup(data[0] as SitePopupRow);
}

/** Turns a row into the shape the browser is given. */
function toPopup(row: SitePopupRow): Popup {
  const popup: Popup = {
    id: row.id,
    title: row.title,
    body: row.body,
  };

  const videoId = row.youtube_id ? parseYoutubeId(row.youtube_id) : null;

  if (videoId) {
    popup.href = youtubeWatchUrl(videoId);
    popup.external = true;
    popup.label = row.cta_label || "Watch the session";
    // The still, so a popup about a video looks like one. Fetched from
    // YouTube directly, which keeps this out of our own image budget.
    popup.image = youtubeThumbnail(videoId);
  } else if (row.event_slug) {
    // Relative, so it stays on whichever regional host the visitor is on.
    popup.href = `/events/${row.event_slug}`;
    popup.label = row.cta_label || "See the details";
  } else if (row.cta_label) {
    // A label with nothing to open is not a button. Left off rather than
    // rendered as one that does nothing.
    popup.label = undefined;
  }

  return popup;
}
