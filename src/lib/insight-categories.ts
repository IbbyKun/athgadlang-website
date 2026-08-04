/**
 * The categories an article may be filed under.
 *
 * A fixed list rather than free text: the category is a filter on the insights
 * page and a join key for the related-articles rail on service pages, and free
 * text fragments both — "Corporate tax", "Corporate Tax" and "Tax" would be
 * three categories holding one subject.
 *
 * On its own, with no imports, so anything can read it: the admin form offers
 * these as a dropdown, and the spreadsheet importer in scripts/ checks its
 * guesses against them. That importer runs outside Next, where neither the `@/`
 * alias nor `server-only` resolves — which is why this cannot live in
 * src/lib/admin/queries.ts, where it used to.
 */
export const insightCategories = [
  "Accounting",
  "Advisory",
  "Assurance",
  "Company Formation",
  "Compliance",
  "Corporate Services",
  "Free Zones",
  "Resourcing",
  "Tax",
];
