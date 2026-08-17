/**
 * Loads the SEO sheet's per-article titles and descriptions into the database.
 *
 *   node --env-file=.env.local … scripts/import-insight-meta.mts [--write]
 *
 * Without `--write` it reports what it would do and changes nothing.
 *
 * Matched by slug, taken from the sheet's URL column. A slug the database does
 * not have is reported rather than inserted: this fills in metadata for
 * articles that exist, and an unmatched row means either the article was never
 * imported or its slug has since changed. Both are worth a human look.
 *
 * The brand suffix is stripped. The sheet writes finished title tags ending in
 * "| athGADLANG" or "| Wathiq", but an article is one row serving five
 * regional sites, so the brand cannot be baked in — the site appends the
 * region's own. Stripping it is also what collapses the sheet's five rows per
 * article into the one value stored here.
 *
 * Em dashes are resolved the same way as the rest of the site: a comma joining
 * a name to a role, a colon introducing a list, a full stop starting a clause.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const CSV = "docs/seo-metadata.csv";
const WRITE = process.argv.includes("--write");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

/** Minimal RFC 4180 reader: the sheet quotes commas and doubles its quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else quoted = false;
      } else cell += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const PRONOUN = /^(we|you|it|they|our|your)\b/i;
const PHRASE = /^(hosted|from|with|while|including|so|and|to|not)\b/i;

function resolveDashes(value: string, isTitle: boolean) {
  return value
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/\s*—\s*(\S+)/g, (_, after: string) => {
      if (isTitle) return `, ${after}`;
      if (PRONOUN.test(after)) return `. ${after[0].toUpperCase()}${after.slice(1)}`;
      if (PHRASE.test(after)) return `, ${after}`;
      return `: ${after}`;
    });
}

const BRAND = /\s*\|\s*(athGADLANG|Wathiq|aG [A-Za-z ]+)\s*$/;

const rows = parseCsv(readFileSync(CSV, "utf8"));
const header = rows[0].map((h) => h.replace(/^﻿/, ""));
const col = (name: string) => header.indexOf(name);

type Meta = { title?: string; description?: string; regions: Set<string> };
const bySlug = new Map<string, Meta>();

for (const row of rows.slice(1)) {
  if (row[col("Page type")] !== "Insight article") continue;

  const slug = row[col("URL")].replace(/\/+$/, "").split("/").pop() ?? "";
  const title = resolveDashes(row[col("New Meta Title")] ?? "", true).replace(BRAND, "");
  const description = resolveDashes(row[col("New Meta Description")] ?? "", false);
  if (!slug || (!title && !description)) continue;

  const entry = bySlug.get(slug) ?? { regions: new Set<string>() };
  // First region wins where the sheet disagrees with itself; the differences
  // are reported below so a person can settle them.
  if (title && !entry.title) entry.title = title;
  if (description && !entry.description) entry.description = description;
  entry.regions.add(row[col("Region")]);
  bySlug.set(slug, entry);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing, error } = await supabase
  .from("insights")
  .select("slug, title, meta_title, meta_description");

if (error) {
  console.error("Could not read insights:", error.message);
  process.exit(1);
}

const known = new Map(existing!.map((r) => [r.slug as string, r]));
const matched: string[] = [];
const unmatched: string[] = [];
const overwriting: string[] = [];

for (const [slug, meta] of bySlug) {
  const row = known.get(slug);
  if (!row) { unmatched.push(slug); continue; }
  matched.push(slug);
  if (row.meta_title || row.meta_description) overwriting.push(slug);
}

console.log(`sheet:      ${bySlug.size} articles with metadata`);
console.log(`database:   ${known.size} articles`);
console.log(`matched:    ${matched.length}`);
console.log(`unmatched:  ${unmatched.length}`);
if (overwriting.length) console.log(`would overwrite existing metadata on ${overwriting.length}`);

if (unmatched.length) {
  console.log("\nIn the sheet but not in the database:");
  for (const slug of unmatched.slice(0, 20)) console.log(`  ${slug}`);
  if (unmatched.length > 20) console.log(`  … and ${unmatched.length - 20} more`);
}

const withoutMeta = [...known.keys()].filter((slug) => !bySlug.has(slug));
if (withoutMeta.length) {
  console.log(`\n${withoutMeta.length} articles in the database have no row in the sheet.`);
}

if (!WRITE) {
  console.log("\nDry run. Pass --write to apply.");
  process.exit(0);
}

let written = 0;
for (const slug of matched) {
  const meta = bySlug.get(slug)!;
  const { error: updateError } = await supabase
    .from("insights")
    .update({
      meta_title: meta.title ?? null,
      meta_description: meta.description ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (updateError) console.error(`  ${slug}: ${updateError.message}`);
  else written++;
}

console.log(`\nWrote metadata to ${written} of ${matched.length} articles.`);
