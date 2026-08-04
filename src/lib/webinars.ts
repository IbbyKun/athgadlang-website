import type { TenantCode } from "@/lib/tenants";
import { youtubeWatchUrl } from "@/lib/youtube";

export type Webinar = {
  /** Identifier for the session. Not part of any address: cards open YouTube. */
  slug: string;
  title: string;
  /** ISO date the session aired. */
  date: string;
  /** Runtime, e.g. "42 min". Empty means the card shows no duration badge. */
  duration: string;
  /**
   * Card artwork. For a managed session with no uploaded image this is the
   * video's own still — see `webinarImage` in src/lib/content.ts.
   */
  image: { src: string; alt: string };
  /** YouTube video id. What the card opens, and where its still comes from. */
  youtubeId?: string;
  /** Regions the session appears on. Absent means every region. */
  regions?: TenantCode[];
  /** True for sessions loaded from the database, for the admin's benefit. */
  managed?: boolean;
};

/**
 * Built-in sessions: none.
 *
 * There were ten placeholders here, with invented titles and stock photography,
 * standing in until the real catalogue existed. It does now: the channel's
 * playlists were bulk loaded into the database, so every session on the site is
 * a real recording with its own YouTube still, managed from /admin/webinars.
 *
 * The array stays, rather than the merge in src/lib/content.ts losing its
 * built-in half: a session can still be written here if one ever needs to ship
 * with the code rather than through the panel.
 */
export const webinars: Webinar[] = [];

/**
 * Where a session opens.
 *
 * A webinar is a recording, so it opens on YouTube — in a new tab, since that
 * leaves the site. Until a session has its `youtubeId`, there is nothing to
 * open and the link falls back to the listing rather than to a page that does
 * not exist. Filling in the ids is all that is needed to make them play.
 */
export function webinarLink(webinar: Webinar) {
  return webinar.youtubeId
    ? { href: youtubeWatchUrl(webinar.youtubeId), external: true as const }
    : { href: "/webinars", external: false as const };
}

export function webinarHref(webinar: Webinar) {
  return webinarLink(webinar).href;
}
