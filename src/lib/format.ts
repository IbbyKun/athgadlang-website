/** Stable locale so server and client render the same string. */
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Formats an ISO date as e.g. "14 Jul 2026". */
export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

/**
 * A timestamp with the time of day, for the admin panel — when an enquiry
 * arrived is part of knowing how long somebody has been waiting.
 *
 * Pinned to Gulf time rather than the reader's: the panel is server-rendered,
 * so "the reader's timezone" would mean the server's, which is wherever the
 * function happened to run. GST is where the group is headquartered, and the
 * label is printed alongside so nobody in Karachi or London reads it as local.
 */
const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Dubai",
});

/** Formats a timestamp as e.g. "14 Jul 2026, 16:05 GST". */
export function formatDateTime(timestamp: string) {
  return `${dateTimeFormatter.format(new Date(timestamp))} GST`;
}

/**
 * Same, with the weekday — for events, where "which day of the week" is part
 * of deciding whether you can attend.
 *
 * Pinned to UTC on purpose. An ISO date with no time parses as UTC midnight,
 * so formatting it in a negative-offset timezone would land on the previous
 * day and name the wrong weekday.
 */
const eventDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO date as e.g. "Thursday, 10 September 2026". */
export function formatEventDate(date: string) {
  return eventDateFormatter.format(new Date(date));
}

/** Day and month only, for a compact card, e.g. "10 September". */
const eventDayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Formats an ISO date as e.g. "Thu 10 Sep". */
export function formatEventDay(date: string) {
  return eventDayFormatter.format(new Date(date));
}
