/**
 * Fills the events table from the events tracker spreadsheet.
 *
 *   npm run import:events -- <path to csv> [options]
 *
 *     --publish        Publish immediately. Default: import as drafts.
 *     --update         Overwrite events already imported.
 *     --dry-run        Print what would happen and write nothing.
 *
 * Unlike the insights importer this reads a file rather than a URL: the tracker
 * lives on SharePoint, which needs a Microsoft login, so the sheet is exported to
 * CSV by hand and passed in. Excel writes those as Windows-1252, not UTF-8, which
 * is why the encoding is declared below rather than assumed — an em dash in
 * "Partner Company" is enough to make a UTF-8 read throw.
 *
 * The sheet is three stacked tables, not one: a section heading, a header row and
 * some events, repeated for UPCOMING, CO-HOSTED and aG LED. So rows are matched
 * against whichever header row was seen most recently rather than a fixed set of
 * column positions.
 *
 * Writes over SUPABASE_DB_URL, the connection string `npm run db:push` uses, so
 * it needs no service role key.
 */

import { readFileSync } from "node:fs";

import { Client } from "pg";

import { slugify } from "../src/lib/slug.ts";
import { tenantCodes, type TenantCode } from "../src/lib/tenants.ts";

function fail(message: string): never {
  console.error(`\n${message}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/**
 * Enough CSV for this file: quoted fields, doubled quotes inside them, and
 * newlines inside quotes — which matter, because the Participants column holds
 * one presenter per line inside a single cell.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Field mapping
// ---------------------------------------------------------------------------

/** "22 Aug 2026" -> "2026-08-22". The only date format the tracker uses. */
function parseDate(value: string): string | undefined {
  const match = /^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/.exec(value.trim());
  if (!match) return undefined;

  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  const month = months.indexOf(match[2].slice(0, 3).toLowerCase());
  if (month < 0) return undefined;

  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

/**
 * "12:00 PM UAE" -> { time: "12:00 PM", timezone: "UAE" }.
 *
 * The trailing token is a region, not a timezone name, which is what the
 * invitations say — and the page prints both verbatim rather than converting, so
 * "UAE" is the right thing to store.
 */
function parseTime(value: string): { time: string; timezone: string } {
  const match = /^(.*?)\s*\b(UAE|KSA|GST|AST|PKT|BST|GMT|UTC[^\s]*)\s*$/i.exec(
    value.trim(),
  );

  if (!match) return { time: value.trim(), timezone: "" };
  return { time: match[1].trim(), timezone: match[2].toUpperCase() };
}

/**
 * "KSA (Online)" -> online, no venue. "KSA (Riyadh)" -> a venue in Riyadh.
 * "UAE" alone is ambiguous, and every such row in the tracker is a webinar, so
 * it is treated as online.
 */
function parseLocation(value: string): { mode: "online" | "venue"; venue: string } {
  const raw = value.trim();
  const inner = /\(([^)]+)\)/.exec(raw)?.[1]?.trim() ?? "";

  if (!inner || /^online$/i.test(inner)) return { mode: "online", venue: "" };
  return { mode: "venue", venue: raw.replace(/\s*\([^)]*\)\s*/, ` (${inner})`).trim() };
}

/** "Webinar" | "Networking" | anything else -> the enum. */
function parseKind(value: string): "webinar" | "seminar" | "networking" {
  const v = value.trim().toLowerCase();
  if (v.startsWith("network")) return "networking";
  if (v.startsWith("seminar") || v.startsWith("in-person")) return "seminar";
  return "webinar";
}

/**
 * The Participants cell, one presenter per line.
 *
 * Four shapes appear, and the tracker mixes them freely inside one cell:
 *
 *   Haziq Neshat Akhtar | Partner - Advisory
 *   Ammar Kaghdi, Associate Director, athGADLANG
 *   Khushboo Mushtaq ACA - Regional Director - Advisory
 *   Moderator: Usman Hussain Khan | Assistant Manager - Assurance
 *
 * So the name ends at whichever of "|", "," or a spaced hyphen comes first —
 * earliest wins, which is what keeps "Partner - Advisory" and "CAMS, CGSS -
 * AML/CFT Expert" intact as roles rather than being cut at their own separators.
 *
 * A "Moderator:" prefix moves into the role rather than being dropped: who
 * chaired a session is worth keeping, and the name field should hold a name.
 */
function parseSpeakers(value: string): { name: string; role: string }[] {
  const separators = ["|", ",", " - "];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const moderator = /^moderator\s*:\s*/i.test(line);
      const body = line.replace(/^moderator\s*:\s*/i, "");

      const found = separators
        .map((sep) => ({ at: body.indexOf(sep), length: sep.length }))
        .filter((s) => s.at > 0)
        .sort((a, b) => a.at - b.at)[0];

      const name = (found ? body.slice(0, found.at) : body).trim();
      const role = found ? body.slice(found.at + found.length).trim() : "";

      return {
        name,
        role: moderator ? `Moderator${role ? ` — ${role}` : ""}` : role,
      };
    })
    .filter((s) => s.name);
}

/**
 * Which regional sites an event belongs on.
 *
 * An online session is open to anyone, so it goes everywhere. Somewhere you have
 * to physically be belongs to the region it is in — nobody in Manchester is
 * attending a Riyadh breakfast.
 */
function parseRegions(
  location: string,
  mode: "online" | "venue",
): TenantCode[] {
  if (mode === "online") return [...tenantCodes];

  const region = /^\s*KSA/i.test(location)
    ? "sa"
    : /^\s*UAE/i.test(location)
      ? "ae"
      : /^\s*(UK|United Kingdom)/i.test(location)
        ? "uk"
        : /^\s*(PK|Pakistan)/i.test(location)
          ? "pk"
          : /^\s*(BH|Bahrain)/i.test(location)
            ? "bh"
            : undefined;

  return region ? [region as TenantCode] : [...tenantCodes];
}

// ---------------------------------------------------------------------------

type Prepared = {
  slug: string;
  title: string;
  kind: string;
  event_date: string;
  start_time: string;
  timezone: string;
  mode: string;
  venue: string;
  excerpt: string;
  partner: string;
  service_line: string;
  speakers: { name: string; role: string }[];
  regions: TenantCode[];
  published: boolean;
};

function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const options = {
    publish: args.includes("--publish"),
    update: args.includes("--update"),
    dryRun: args.includes("--dry-run"),
  };

  if (!file) fail("Usage: npm run import:events -- <path to csv> [--publish] [--update] [--dry-run]");

  // Excel exports Windows-1252. Reading it as UTF-8 throws on the em dash the
  // tracker uses for "no partner".
  const text = new TextDecoder("windows-1252").decode(readFileSync(file));
  const rows = parseCsv(text).map((r) => r.map((c) => c.trim()));

  let header: string[] | undefined;
  const prepared: Prepared[] = [];
  const skipped: string[] = [];

  for (const row of rows) {
    if (!row.some(Boolean)) continue;

    if (row[0] === "Event Name") {
      header = row;
      continue;
    }
    if (!header) continue;

    const get = (name: string) => {
      const i = header!.indexOf(name);
      return i >= 0 ? (row[i] ?? "") : "";
    };

    const title = get("Event Name");
    const description = get("Description");

    // A section heading ("UPCOMING", "aG LED") has a first cell and nothing else
    // that matters; a real row always describes itself.
    if (!title || !description) continue;

    const date = parseDate(get("Date"));
    if (!date) {
      skipped.push(`${title} — unreadable date ${JSON.stringify(get("Date"))}`);
      continue;
    }

    const { time, timezone } = parseTime(get("Time"));
    const location = get("Location");
    const { mode, venue } = parseLocation(location);
    const partner = get("Partner Company");

    prepared.push({
      slug: slugify(title),
      title,
      kind: parseKind(get("Format")),
      event_date: date,
      start_time: time,
      timezone,
      mode,
      venue,
      excerpt: description,
      // The tracker writes an em dash for "none".
      partner: /^[—–-]?$/.test(partner) ? "" : partner,
      service_line: get("Service Line"),
      speakers: parseSpeakers(get("Participants")),
      regions: parseRegions(location, mode),
      published: options.publish,
    });
  }

  if (!prepared.length) fail("No event rows found. Is this the right sheet?");

  for (const e of prepared) {
    console.log(`\n  ${e.title}`);
    console.log(`    slug        ${e.slug}`);
    console.log(`    kind        ${e.kind}`);
    console.log(`    date/time   ${e.event_date}  ${e.start_time} ${e.timezone}`);
    console.log(`    where       ${e.mode}${e.venue ? ` — ${e.venue}` : ""}`);
    console.log(`    partner     ${e.partner || "(none)"}`);
    console.log(`    service     ${e.service_line}`);
    console.log(`    regions     ${e.regions.join(", ")}`);
    console.log(`    speakers    ${e.speakers.length}`);
    for (const s of e.speakers) console.log(`                  ${s.name} — ${s.role || "(no role)"}`);
  }

  if (skipped.length) {
    console.log(`\n  skipped ${skipped.length}:`);
    for (const s of skipped) console.log(`    ${s}`);
  }

  console.log(
    `\n  ${prepared.length} event(s), as ${options.publish ? "PUBLISHED" : "drafts"}` +
      (options.dryRun ? " — dry run, nothing written\n" : "\n"),
  );

  if (options.dryRun) return;

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) fail("SUPABASE_DB_URL is not set. It lives in .env.local.");

  void write(connectionString, prepared, options.update);
}

async function write(connectionString: string, prepared: Prepared[], update: boolean) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const { rows: existing } = await client.query<{ slug: string }>(
      "select slug from public.events",
    );
    const known = new Set(existing.map((r) => r.slug));

    let inserted = 0;
    let updated = 0;
    let left = 0;

    for (const e of prepared) {
      const values = [
        e.slug, e.title, e.kind, e.event_date, e.start_time, e.timezone,
        e.mode, e.venue, e.excerpt, e.partner, e.service_line,
        JSON.stringify(e.speakers), e.regions, e.published,
      ];

      if (!known.has(e.slug)) {
        await client.query(
          `insert into public.events
             (slug, title, kind, event_date, start_time, timezone, mode, venue,
              excerpt, partner, service_line, speakers, regions, published)
           values ($1,$2,$3::public.event_kind,$4,$5,$6,$7::public.event_mode,
                   $8,$9,$10,$11,$12::jsonb,$13::public.region_code[],$14)`,
          values,
        );
        inserted += 1;
      } else if (update) {
        await client.query(
          `update public.events set
             title=$2, kind=$3::public.event_kind, event_date=$4, start_time=$5,
             timezone=$6, mode=$7::public.event_mode, venue=$8, excerpt=$9,
             partner=$10, service_line=$11, speakers=$12::jsonb,
             regions=$13::public.region_code[], published=$14, updated_at=now()
           where slug=$1`,
          values,
        );
        updated += 1;
      } else left += 1;
    }

    console.log(
      `  inserted ${inserted}, updated ${updated}, left alone ${left}\n` +
        (left ? "  (pass --update to overwrite existing events)\n" : ""),
    );
  } finally {
    await client.end();
  }
}

main();
