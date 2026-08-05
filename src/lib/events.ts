import type { InsightBlock } from "@/lib/insights";
import type { RichDoc } from "@/lib/rich-text";
import type { TenantCode } from "@/lib/tenants";

/**
 * Events — the sessions that have not happened yet.
 *
 * Distinct from webinars, which are recordings of sessions that already did:
 * an event has a date in the future, a place, people presenting, and something
 * to register for. Once it has been and gone it moves into the "previous"
 * shelf here rather than disappearing, because the write-up and the speaker
 * list are still worth reading.
 */

/** What the session is called — the label on its pill. */
export type EventKind = "webinar" | "seminar";

/** Whether you attend from your desk or travel to it. */
export type EventMode = "online" | "venue";

export type EventSpeaker = {
  name: string;
  role: string;
  /**
   * Leadership-team slug, where the speaker is on it. Gives the speaker their
   * photograph and a link to their profile; without it they get initials.
   */
  leader?: string;
};

/** One line of the running order. */
export type EventAgendaItem = {
  /** Clock time in the event's own timezone, e.g. "12:10". */
  time: string;
  title: string;
};

export type EventItem = {
  slug: string;
  title: string;
  kind: EventKind;
  /**
   * The day it runs, as an ISO date. Deliberately a date and not a timestamp:
   * the site never needs to convert an event into the reader's timezone, and a
   * date compares cleanly against today to decide whether it has passed.
   */
  date: string;
  /**
   * The clock time as it should be shown, e.g. "12:00 – 13:00". A string
   * rather than a pair of timestamps, because that is exactly what an
   * invitation states and it cannot drift when rendered.
   */
  time: string;
  /** The timezone that time is stated in, e.g. "GST (UTC+4)". */
  timezone: string;
  /**
   * How you attend. Kept separate from `kind` so the two can disagree — an
   * online seminar or a webinar recorded in front of a room are both things
   * that happen, and collapsing them would make one of them unrepresentable.
   */
  mode: EventMode;
  /** Where it is held. Expected whenever `mode` is "venue", ignored otherwise. */
  venue?: string;
  /**
   * What it costs. Absent means free — there is no separate "is it paid" flag,
   * because a paid event with no price and a free event would then be the same
   * row with different booleans.
   */
  price?: string;
  /**
   * Who may attend, e.g. "Open to all — registration required". Optional: the
   * cost and the registration link already answer most of it, so an event that
   * has nothing to add simply omits the line.
   */
  access?: string;
  excerpt: string;
  image: { src: string; alt: string };
  /**
   * Where registration happens. Absent means registration is not open yet,
   * and the page says so rather than offering a dead button.
   */
  registerUrl?: string;
  /**
   * Where a past session's recording lives, once there is one. A past event
   * without it simply has nothing to watch.
   */
  recordingUrl?: string;
  speakers: EventSpeaker[];
  agenda?: EventAgendaItem[];
  /**
   * The write-up, as a block structure. Uses the same model as the articles —
   * see `InsightBlock` — so <InsightBody> renders it and the prose matches the
   * rest of the site without a second renderer to keep in step.
   */
  body?: InsightBlock[];
  /**
   * The write-up as rich text, which is what the admin editor produces. Takes
   * precedence over `body` when both are present.
   */
  richBody?: RichDoc;
  /** Regions this appears on. Absent means every region. */
  regions?: TenantCode[];
  /** True for events loaded from the database, for the admin's benefit. */
  managed?: boolean;
};

// ---------------------------------------------------------------------------
// Reading the stored lists
// ---------------------------------------------------------------------------

/**
 * Presenters and running order come back from `jsonb` columns, which are
 * `unknown` as far as the type system is concerned. These narrow them.
 *
 * Written to discard rather than throw. A malformed entry means one presenter
 * missing from a page; a throw during render means the whole event 500s on
 * every region at once, and there is no version of that trade worth taking.
 * The column constraints already guarantee the outer value is an array, so
 * anything caught here got in before those existed or through a direct write.
 */
function str(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function parseSpeakers(value: unknown): EventSpeaker[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];

    const row = entry as Record<string, unknown>;
    const name = str(row.name);
    // A presenter with no name has nothing to render — not even initials.
    if (!name) return [];

    const leader = str(row.leader);
    return [{ name, role: str(row.role), ...(leader ? { leader } : {}) }];
  });
}

export function parseAgenda(value: unknown): EventAgendaItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];

    const row = entry as Record<string, unknown>;
    const title = str(row.title);
    // The time is the smaller half of the line; a row with only a time says
    // nothing, so the title is what makes it worth showing.
    if (!title) return [];

    return [{ time: str(row.time), title }];
  });
}

/**
 * Built-in events — none.
 *
 * There were nine, written to exercise the layouts. They are gone: events are
 * published from the admin panel, and placeholder sessions with invented dates
 * are worse than an empty calendar on a live site. Every surface that lists
 * events now hides itself when there are none, so this staying empty is a
 * supported state and not a broken one.
 *
 * The array itself remains because the precedence rule in lib/content.ts is
 * "a published row wins over a built-in of the same slug", which is what lets
 * a session be moved into the database without deleting TypeScript. Keeping
 * the seam costs nothing and removing it would mean changing three call sites
 * to no benefit.
 */
export const events: EventItem[] = [];

/** Human label for a kind. */
export const eventKindLabel: Record<EventKind, string> = {
  webinar: "Live webinar",
  seminar: "In-person seminar",
};

/** Short label, for a card pill where there is no room for the long one. */
export const eventKindShortLabel: Record<EventKind, string> = {
  webinar: "Webinar",
  seminar: "Seminar",
};

/** Human label for a mode, for the admin form. */
export const eventModeLabel: Record<EventMode, string> = {
  online: "Online",
  venue: "At a venue",
};

export function eventHref(event: EventItem) {
  return `/events/${event.slug}`;
}

/** Every built-in event slug. */
export const eventSlugs = events.map((event) => event.slug);

/**
 * Where it happens, as one line.
 *
 * Derived rather than stored, so an event cannot end up saying "Online" while
 * carrying a venue. A venue event that has not named its room yet says so
 * instead of showing an empty row.
 */
export function eventLocation(event: EventItem) {
  if (event.mode === "online") return "Online";
  return event.venue || "Venue to be confirmed";
}

/** What it costs, as one line. */
export function eventPrice(event: EventItem) {
  return event.price?.trim() || "Free to attend";
}

/**
 * The helpers below take the list to work against, because the list a page
 * renders is the built-in events merged with the region's published rows from
 * the database. Callers on the public site pass the merged list from
 * `src/lib/content.ts`; the default keeps the built-in events usable alone.
 */

/** The event for a URL segment, or undefined so the route can 404. */
export function getEvent(slug: string, list: EventItem[] = events) {
  return list.find((event) => event.slug === slug);
}

/**
 * True while the date has not passed.
 *
 * Compared as ISO date strings, which sort correctly and sidestep timezone
 * arithmetic entirely. Inclusive of today: an event running this afternoon is
 * still upcoming this morning, and nothing here knows the time of day.
 *
 * Takes a bare date as well as an event, because the admin list works from
 * database rows rather than mapped events.
 */
export function isUpcomingDate(date: string, today = todayIso()) {
  return date >= today;
}

/** True while the event has not finished. */
export function isUpcoming(event: EventItem, today = todayIso()) {
  return isUpcomingDate(event.date, today);
}

/** Today as `yyyy-mm-dd` in UTC, matching how event dates are written. */
export function todayIso(now: Date = new Date()) {
  return now.toISOString().slice(0, 10);
}

/**
 * A list split into the two shelves the pages show.
 *
 * Upcoming runs soonest-first — the next thing you could attend is the most
 * useful — while past runs most-recent-first, like every other archive on the
 * site. `featured` is the next one up, which the pages give a larger card.
 */
export function splitEvents(list: EventItem[] = events, today = todayIso()) {
  const upcoming = list
    .filter((event) => isUpcoming(event, today))
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = list
    .filter((event) => !isUpcoming(event, today))
    .sort((a, b) => b.date.localeCompare(a.date));

  const [featured, ...rest] = upcoming;

  return { upcoming, past, featured, rest };
}

/**
 * Other events worth showing at the foot of one — the next few upcoming,
 * topped up with recent past ones so the rail is never nearly empty.
 */
export function otherEvents(
  event: EventItem,
  list: EventItem[] = events,
  limit = 3,
) {
  const { upcoming, past } = splitEvents(list);

  return [...upcoming, ...past]
    .filter((item) => item.slug !== event.slug)
    .slice(0, limit);
}
