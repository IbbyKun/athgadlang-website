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
