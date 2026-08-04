/**
 * Matching for the navbar search.
 *
 * Deliberately holds no content: the index is built on the server by
 * `buildSearchIndex` in src/lib/search-index.ts and handed to the search box as
 * a prop. Keeping the two apart is what lets the index include articles and
 * sessions published from the admin panel — those live in the database, and a
 * module the browser imports cannot read it — while this file, which the browser
 * does import, stays a few hundred bytes of scoring.
 */

export type SearchKind = "Service" | "Person" | "Event" | "Insight" | "Webinar";

export type SearchItem = {
  kind: SearchKind;
  title: string;
  /** Where it sits — the practice above it, an author's role, a category. */
  subtitle?: string;
  href: string;
  /** Opens in a new tab: a recording lives on YouTube, not on this site. */
  external?: boolean;
  /** Words that should match without being shown. */
  keywords?: string[];
};

/** True where `text` has a word starting at `index`. */
function atWordStart(text: string, index: number) {
  return index === 0 || /[^a-z0-9]/i.test(text[index - 1]);
}

/**
 * How well `text` matches `query`, or -1 for no match at all.
 *
 * Three tiers, in the order a reader would expect: the whole query as a run of
 * characters scores highest — most so at the start of the text, then at the
 * start of any word inside it — and failing that, the query's characters in
 * order but spread out ("crptx" finding "Corporate Tax"). Shorter matches win
 * ties, because in a short title the query accounts for more of it.
 */
function score(query: string, text: string) {
  const haystack = text.toLowerCase();
  const run = haystack.indexOf(query);

  if (run === 0) return 1000 - haystack.length;
  if (run > 0) return (atWordStart(haystack, run) ? 800 : 500) - haystack.length;

  let from = 0;
  let gaps = 0;
  let starts = 0;
  for (const character of query) {
    const at = haystack.indexOf(character, from);
    if (at === -1) return -1;
    if (at > from) gaps += 1;
    if (atWordStart(haystack, at)) starts += 1;
    from = at + 1;
  }

  return 300 + starts * 10 - gaps * 5 - haystack.length / 10;
}

/** The best score across an item's fields, weighted by where the hit landed. */
function rank(query: string, item: SearchItem) {
  const fields: [string, number][] = [
    [item.title, 1],
    [item.subtitle ?? "", 0.6],
    [item.kind, 0.4],
    [(item.keywords ?? []).join(" "), 0.35],
  ];

  return Math.max(
    ...fields.map(([text, weight]) => {
      if (!text) return -1;
      const value = score(query, text);
      return value === -1 ? -1 : value * weight;
    }),
  );
}

/** Matches from `index`, best first. An empty query matches nothing. */
export function searchSite(query: string, index: SearchItem[], limit = 8) {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];

  return index
    .map((item) => ({ item, value: rank(trimmed, item) }))
    .filter((result) => result.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((result) => result.item);
}
