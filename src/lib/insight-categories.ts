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
  // Last, out of alphabetical order, because it is a catch-all rather than a
  // subject alongside the others — an editor scanning the list should read it
  // as "none of the above".
  //
  // It has one consequence worth knowing: no service page lists "Other" among
  // its `insightCategories`, so an article filed here appears on the insights
  // index and nowhere else. That is the right default for something off-topic,
  // but it makes "Other" the wrong home for an article that does belong to a
  // practice area.
  "Other",
];
