/**
 * Turns a title into a URL segment: lowercase, words joined by hyphens,
 * accents flattened, everything else dropped.
 *
 * Used to prefill the slug field as a title is typed and again on the server for
 * anyone who clears it — the same function in both places, so what an editor
 * previews is what gets saved.
 *
 * On its own, with no imports, so that anything can use it: a script run outside
 * Next cannot resolve the `@/` alias, and this needs to stay loadable by one.
 */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    // Combining marks, left behind by the decomposition above.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
