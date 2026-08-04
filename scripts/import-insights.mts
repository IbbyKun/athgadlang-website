/**
 * Fills the insights table from the newsletter tracking spreadsheet.
 *
 *   npm run import:insights -- <sheet url or id> [options]
 *
 *     --publish        Publish immediately. Default: import as drafts.
 *     --update         Overwrite articles already imported.
 *     --limit N        Stop after N articles.
 *     --dry-run        Print what would happen and write nothing.
 *     --report <path>  Write the full per-article decision log to a file.
 *
 * The spreadsheet is a tracker, not the content: each row carries a region, a
 * submitter and a title, and links to a Google Doc that holds the article. So
 * this reads the sheet for the metadata, then every linked document for the
 * body.
 *
 * Bodies are converted with `generateJSON` against `richTextExtensions` — the
 * same schema the editor writes and the article page renders. That is what makes
 * the conversion trustworthy: ProseMirror's own parse rules handle headings,
 * lists and tables, and anything the schema does not define is dropped rather
 * than arriving as unexpected markup.
 *
 * Writes over SUPABASE_DB_URL, the connection string `npm run db:push` uses, so
 * it needs no service role key.
 */

import { inflateRawSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { generateJSON } from "@tiptap/html";
import { Client } from "pg";

import { insightCategories } from "../src/lib/insight-categories.ts";
import { richTextExtensions, type RichDoc } from "../src/lib/rich-text.ts";
import { slugify } from "../src/lib/slug.ts";
import { tenantCodes, type TenantCode } from "../src/lib/tenants.ts";

function fail(message: string): never {
  console.error(`\n${message}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

const usage = [
  "Usage: npm run import:insights -- <sheet url or id> [options]",
  "",
  "  --publish        Publish immediately. Default: import as drafts.",
  "  --update         Overwrite articles already imported.",
  "  --limit N        Stop after N articles.",
  "  --dry-run        Print what would happen and write nothing.",
  "  --report <path>  Write the per-article decision log to a file.",
].join("\n");

type Options = {
  sheetId: string;
  publish: boolean;
  update: boolean;
  limit: number;
  dryRun: boolean;
  report?: string;
};

function parseArgs(argv: string[]): Options {
  let sheet = "";
  let publish = false;
  let update = false;
  let limit = 0;
  let dryRun = false;
  let report: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "--publish": publish = true; break;
      case "--update": update = true; break;
      case "--dry-run": dryRun = true; break;
      case "--report": report = argv[(i += 1)]; break;
      case "--limit": {
        limit = Number(argv[(i += 1)]);
        if (!Number.isInteger(limit) || limit < 1) {
          fail("--limit needs a whole number, e.g. --limit 20");
        }
        break;
      }
      default:
        if (arg.startsWith("-")) fail(`Unknown option ${arg}.\n\n${usage}`);
        if (sheet) fail("Give one spreadsheet.");
        sheet = arg;
    }
  }

  if (!sheet) fail(usage);

  // Accept the address from the browser or the bare id.
  const sheetId =
    /^[\w-]{20,}$/.test(sheet)
      ? sheet
      : (/\/spreadsheets\/d\/([\w-]+)/.exec(sheet)?.[1] ?? "");

  if (!sheetId) fail(`Could not find a spreadsheet id in "${sheet}".`);

  return { sheetId, publish, update, limit, dryRun, report };
}

// ---------------------------------------------------------------------------
// Reading the workbook
// ---------------------------------------------------------------------------

/**
 * The entries of a zip file, decompressed.
 *
 * An .xlsx is a zip, and hyperlinks only survive in that format: the CSV export
 * drops them, and the HTML export is refused outright. Node has no zip reader,
 * and this is 40 lines against a whole dependency, so it reads the central
 * directory itself. Deflate and stored are the only methods Excel writers use.
 */
function unzip(bytes: Buffer): Map<string, Buffer> {
  const files = new Map<string, Buffer>();

  // End of central directory record, searched from the back: the comment field
  // that follows it is variable length.
  let eocd = -1;
  for (let i = bytes.length - 22; i >= 0; i -= 1) {
    if (bytes.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) fail("That download is not a zip file — is the sheet shared?");

  const count = bytes.readUInt16LE(eocd + 10);
  let at = bytes.readUInt32LE(eocd + 16);

  for (let n = 0; n < count; n += 1) {
    if (bytes.readUInt32LE(at) !== 0x02014b50) break;

    const method = bytes.readUInt16LE(at + 10);
    const compressedSize = bytes.readUInt32LE(at + 20);
    const nameLength = bytes.readUInt16LE(at + 28);
    const extraLength = bytes.readUInt16LE(at + 30);
    const commentLength = bytes.readUInt16LE(at + 32);
    const localAt = bytes.readUInt32LE(at + 42);
    const name = bytes.toString("utf8", at + 46, at + 46 + nameLength);

    // The local header repeats the name and extra fields at its own lengths.
    const localNameLength = bytes.readUInt16LE(localAt + 26);
    const localExtraLength = bytes.readUInt16LE(localAt + 28);
    const from = localAt + 30 + localNameLength + localExtraLength;
    const raw = bytes.subarray(from, from + compressedSize);

    files.set(name, method === 0 ? Buffer.from(raw) : inflateRawSync(raw));
    at += 46 + nameLength + extraLength + commentLength;
  }

  return files;
}

const entities: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
};

function unescapeXml(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&(\w+);/g, (whole, name) => entities[name] ?? whole);
}

function stripTags(xml: string) {
  return unescapeXml(xml.replace(/<[^>]+>/g, ""));
}

/** "C7" -> 2 */
function columnOf(ref: string) {
  let n = 0;
  for (const ch of /^([A-Z]+)/.exec(ref)?.[1] ?? "") n = n * 26 + ch.charCodeAt(0) - 64;
  return n - 1;
}

type SheetRow = {
  row: number;
  hidden: boolean;
  cells: Map<number, string>;
  links: Map<number, string>;
};

type Sheet = { name: string; rows: SheetRow[] };

function readWorkbook(bytes: Buffer): Sheet[] {
  const files = unzip(bytes);

  const read = (path: string) => files.get(path)?.toString("utf8") ?? "";

  const shared: string[] = [];
  for (const si of read("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)) {
    shared.push(stripTags(si[1]));
  }

  const names = [...read("xl/workbook.xml").matchAll(/<sheet\b[^>]*name="([^"]*)"/g)]
    .map((m) => unescapeXml(m[1]));

  const sheets: Sheet[] = [];

  names.forEach((name, index) => {
    const xml = read(`xl/worksheets/sheet${index + 1}.xml`);
    if (!xml) return;

    // Hyperlink targets live in the sheet's relationship file, keyed by id.
    const targets = new Map<string, string>();
    for (const m of read(`xl/worksheets/_rels/sheet${index + 1}.xml.rels`)
      .matchAll(/<Relationship\b([^>]*)>/g)) {
      const id = /Id="([^"]+)"/.exec(m[1])?.[1];
      const target = /Target="([^"]+)"/.exec(m[1])?.[1];
      if (id && target) targets.set(id, unescapeXml(target));
    }

    // Attribute order varies between writers, so each is matched on its own.
    const links = new Map<string, string>();
    for (const m of xml.matchAll(/<hyperlink\b([^>]*?)\/?>/g)) {
      const ref = /ref="([A-Z]+\d+)"/.exec(m[1])?.[1];
      const id = /r:id="([^"]+)"/.exec(m[1])?.[1];
      if (ref && id) links.set(ref, targets.get(id) ?? "");
    }

    const rows: SheetRow[] = [];
    for (const rm of xml.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)) {
      const row = Number(/r="(\d+)"/.exec(rm[1])?.[1] ?? 0);
      const hidden = /hidden="(1|true)"/.test(rm[1]);
      const cells = new Map<number, string>();
      const rowLinks = new Map<number, string>();

      for (const cm of rm[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const ref = /r="([A-Z]+\d+)"/.exec(cm[1])?.[1];
        if (!ref) continue;

        const type = /t="(\w+)"/.exec(cm[1])?.[1];
        const body = cm[2] ?? "";
        const raw = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];

        let value = "";
        if (type === "s" && raw) value = shared[Number(raw)] ?? "";
        else if (type === "inlineStr") value = stripTags(body);
        else if (raw) value = unescapeXml(raw);

        const column = columnOf(ref);
        cells.set(column, value.trim());
        const link = links.get(ref);
        if (link) rowLinks.set(column, link);
      }

      rows.push({ row, hidden, cells, links: rowLinks });
    }

    sheets.push({ name, rows });
  });

  return sheets;
}

// ---------------------------------------------------------------------------
// The tracker's shape
// ---------------------------------------------------------------------------

/** Column positions, from the header row the tabs share. */
const REGION = 1;
const TITLE = 2;
const AUTHOR = 3;
const STATUS = 6;
const WEEK = 7;
const MONTH = 0;

type Entry = {
  tab: string;
  row: number;
  hidden: boolean;
  region: string;
  sheetTitle: string;
  author: string;
  status: string;
  week: number;
  month?: string;
  docId: string;
};

const monthNames = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** "June 2026" -> { year: 2026, month: 5 } */
function parseMonth(label: string) {
  const m = /^([A-Za-z]+)\s+(\d{4})$/.exec(label.trim());
  if (!m) return undefined;

  const month = monthNames.indexOf(m[1].slice(0, 3).toLowerCase());
  return month === -1 ? undefined : { year: Number(m[2]), month };
}

function entriesFrom(sheets: Sheet[]): Entry[] {
  const out: Entry[] = [];

  for (const sheet of sheets) {
    // The Regions tab is a lookup list, not content.
    if (!sheet.rows.some((r) => r.links.size)) continue;

    let month: string | undefined;

    for (const row of sheet.rows) {
      const first = row.cells.get(MONTH) ?? "";
      // Month headers sit alone in the first column, above their weeks.
      if (first && first !== "Week" && parseMonth(first)) month = first;

      const link = row.links.get(TITLE) ?? [...row.links.values()][0] ?? "";
      const docId = /\/document\/d\/([\w-]+)/.exec(link)?.[1] ?? "";
      if (!docId) continue;

      out.push({
        tab: sheet.name,
        row: row.row,
        hidden: row.hidden,
        region: row.cells.get(REGION) ?? "",
        sheetTitle: row.cells.get(TITLE) ?? "",
        author: row.cells.get(AUTHOR) ?? "",
        status: row.cells.get(STATUS) ?? "",
        week: Number(row.cells.get(WEEK) ?? 0) || 0,
        month,
        docId,
      });
    }
  }

  return out;
}

/** The article name, from the filename the sheet carries. */
function titleFrom(sheetTitle: string) {
  return sheetTitle
    .replace(/\.(docx?|pdf|txt)\s*$/i, "")
    .replace(/\s*-\s*week\s*\d+\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sheet region -> the regional sites that carry it. */
function regionsFor(region: string): TenantCode[] {
  const named: Record<string, TenantCode[]> = {
    uae: ["ae"],
    uk: ["uk"],
    ksa: ["sa"],
    "saudi arabia": ["sa"],
    bahrain: ["bh"],
    pakistan: ["pk"],
    // Not a site of its own: the Gulf entities are the ones it speaks to.
    gcc: ["ae", "bh", "sa"],
  };

  // USA and North America have no regional site. They are general business
  // interest rather than local guidance, so every region carries them.
  return named[region.trim().toLowerCase()] ?? [...tenantCodes];
}

// ---------------------------------------------------------------------------
// Bodies
// ---------------------------------------------------------------------------

/**
 * Where the website version of a piece starts.
 *
 * The label varies by author: "WEBSITE BLOG", "WEBSITE ARTICLE", a bare "Blog",
 * or "Article Title:". All of them mean the same thing — everything after this
 * line is for the site.
 */
const websiteMarker =
  /^\(?\s*(website\s*(blog|article|version)?|blog|article(\s*title)?)\s*\)?\s*:?\s*$/i;

/** Where the LinkedIn or email version starts. */
const otherMarker = /^\(?\s*(#\s*)?(newsletter|linked\s?in)\b.*$/i;

/** A rule drawn with punctuation, used as a section break. */
const separator = /^[\s_\-–—=*.]{6,}$/;

/** Comparable form of a line: lowercase words only. */
function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * How much of `title` appears in `line`, 0 to 1.
 *
 * Used to find the article's own title inside a document, which is the one
 * landmark every one of these files has regardless of how its sections are
 * labelled — the sheet took its title from the same line.
 */
function titleSimilarity(line: string, title: string) {
  const wanted = new Set(normalise(title).split(" ").filter((w) => w.length > 3));
  if (!wanted.size) return 0;

  const present = new Set(normalise(line).split(" "));
  let hits = 0;
  for (const word of wanted) if (present.has(word)) hits += 1;

  return hits / wanted.size;
}

/** Node types that occupy their own line. */
const blockTypes = new Set([
  "paragraph", "heading", "blockquote", "listItem", "bulletList", "orderedList",
  "table", "tableRow", "tableCell", "tableHeader",
]);

/**
 * The words in a node, for excerpts and for guessing a category.
 *
 * Whitespace has to be reintroduced, because the document does not store any: a
 * line break is a node and a paragraph boundary is a nesting level, so joining
 * the text straight through runs "…looks stable." into "Your workforce…" and
 * invents a word. Inline runs are joined tight — those are one sentence split by
 * a mark, and a space there would break a word instead.
 */
function plainText(node: RichDoc): string {
  if (node.text) return node.text;
  if (node.type === "hardBreak") return " ";

  const children = node.content ?? [];
  const separator = children.some((child) => blockTypes.has(child.type ?? "")) ? " " : "";

  return children.map(plainText).join(separator);
}

type Body = { doc: RichDoc; strategy: string; notes: string[] };

/**
 * The article, separated from whatever else the document holds.
 *
 * These files were written for two destinations at once: a short LinkedIn or
 * email item and the longer piece for the site. Which one comes first, and how
 * the two are labelled, varies — "WEBSITE BLOG", "WEBSITE ARTICLE",
 * "(NEWSLETTER)", a row of underscores, or nothing at all. So the labels are
 * matched as a family and the strategy used is reported per article, because a
 * wrong split puts LinkedIn copy on the website and that is worth being able to
 * audit.
 */
function extractBody(html: string, title: string): Body {
  const whole = generateJSON(html, richTextExtensions) as RichDoc;
  const blocks = [...(whole.content ?? [])];
  const notes: string[] = [];

  const textOf = (i: number) => plainText(blocks[i] ?? {}).trim();

  const websiteAt = blocks.findIndex((_, i) => websiteMarker.test(textOf(i)));
  const otherAt = blocks.findIndex((_, i) => otherMarker.test(textOf(i)));

  /**
   * The line that repeats the article's title, which is where the body begins.
   *
   * Only searched within the first stretch of the document: these titles recur
   * as running headers and inside the text, and it is the first occurrence —
   * the heading — that marks the boundary. Short lines only, for the same
   * reason: a paragraph that happens to mention every word of the title is
   * prose, not a heading.
   */
  const titleLineAt = blocks.findIndex((block, i) => {
    if (i > 12) return false;
    const text = textOf(i);
    return text.length < 220 && titleSimilarity(text, title) >= 0.7;
  });

  let from = 0;
  let strategy: string;

  if (websiteAt !== -1) {
    from = websiteAt + 1;
    strategy = "after website marker";

    // "Article Title:" is followed by the title itself, which the page draws.
    if (titleLineAt === from) from += 1;
  } else if (otherAt !== -1 && titleLineAt > otherAt) {
    // A LinkedIn or newsletter item comes first and nothing labels the article,
    // but its title is in there — the body is what follows that line.
    from = titleLineAt + 1;
    strategy = "after the title line below a LinkedIn/newsletter marker";
  } else if (otherAt !== -1) {
    // If a rule closes the other section, the article is after it.
    const ruleAt = blocks.findIndex((_, i) => i > otherAt && separator.test(textOf(i)));
    if (ruleAt !== -1) {
      from = ruleAt + 1;
      strategy = "after rule below LinkedIn/newsletter marker";
    } else {
      from = otherAt + 1;
      strategy = "LinkedIn/newsletter only — used as the article";
      notes.push("no separate website version in the document");
    }
  } else if (titleLineAt > 0) {
    // No labels at all, but the title appears below the top of the document:
    // whatever precedes it is a hook or a heading, not the article.
    from = titleLineAt + 1;
    strategy = "after the title line";
  } else {
    from = titleLineAt === 0 ? 1 : 0;
    strategy = "whole document";
  }

  let content = blocks.slice(from);

  // Drop leading rules, empties, and a first line that just repeats the title.
  const titleKey = slugify(title);
  while (content.length) {
    const text = plainText(content[0]).trim();
    const empty = !text;
    const rule = separator.test(text);
    const echo = titleKey && slugify(text) === titleKey;
    if (!empty && !rule && !echo) break;
    if (echo) notes.push("dropped a repeated title line");
    content = content.slice(1);
  }

  // And trailing ones.
  while (content.length) {
    const text = plainText(content[content.length - 1]).trim();
    if (text && !separator.test(text)) break;
    content = content.slice(0, -1);
  }

  if (!content.length) notes.push("EMPTY after splitting");

  // A label left inside the article means the split landed in the wrong place —
  // the surest sign that LinkedIn copy has come along with it. Worth reporting
  // even though the text is still readable, because a human should look.
  const leftover = content.findIndex((_, i) => {
    const text = plainText(content[i]).trim();
    return websiteMarker.test(text) || otherMarker.test(text);
  });
  if (leftover !== -1) {
    notes.push(`a section label survives at block ${leftover + 1} — check the split`);
  }

  return { doc: { type: "doc", content }, strategy, notes };
}

/** The card summary: the opening sentences, cut at a word. */
function excerptFrom(doc: RichDoc, limit = 190) {
  const first = (doc.content ?? []).find(
    (node) => node.type === "paragraph" && plainText(node).trim().length > 40,
  );

  const text = plainText(first ?? {}).replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

/**
 * Keywords per category, most specific first.
 *
 * The tracker has no category column and the site's list is fixed, so the
 * category is read out of the writing. Scored rather than first-match: an
 * article about corporate tax in a free zone mentions both, and the one it
 * mentions more is the one it is about. Anything that scores nothing is filed
 * under Advisory and reported, because a wrong guess is one dropdown to fix but
 * a silent one is not.
 */
const categoryKeywords: [string, string[]][] = [
  ["Free Zones", ["free zone", "freezone", "dafza", "jafza", "dmcc", "adgm", "difc", "qualifying free zone"]],
  ["Tax", ["tax", "vat", "zatca", "transfer pricing", "e-invoicing", "excise", "withholding", "fta ", "double taxation", "customs duty"]],
  ["Assurance", ["audit", "auditor", "assurance", "internal control", "external audit"]],
  ["Accounting", ["accounting", "bookkeeping", "ifrs", "financial statement", "balance sheet", "reconciliation", "ledger", "payroll", "wps"]],
  ["Compliance", ["compliance", "anti-money", "aml", "regulator", "regulatory", "governance", "esg", "data protection", "pdpl", "gdpr", "sanction", "disclosure requirement"]],
  ["Resourcing", ["hiring", "recruit", "talent", "workforce", "staffing", "employee", "employment", "job market", "outsourc", "bpo", "secondment", "gen z", "cv ", "resume", "remote work", "four day"]],
  ["Company Formation", ["company formation", "set up a company", "incorporat", "trade licence", "trade license", "business setup", "commercial registration"]],
  ["Corporate Services", ["golden visa", "pro services", "trademark", "liquidation", "bank account opening", "residency visa"]],
  ["Advisory", ["advisory", "consulting", "strategy", "merger", "acquisition", "valuation", "investor", "investment", "economy", "gdp", "market", "growth", "ipo", "vision 2030", "startup", "funding"]],
];

function inferCategory(title: string, body: string) {
  const haystack = `${title}\n${body}`.toLowerCase();

  let best = "";
  let bestScore = 0;

  for (const [category, words] of categoryKeywords) {
    let score = 0;
    for (const word of words) {
      // Count occurrences, so what the piece dwells on wins.
      score += haystack.split(word).length - 1;
    }
    // Ties go to the earlier, more specific category.
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }

  if (!best || !insightCategories.includes(best)) {
    return { category: "Advisory", confident: false };
  }

  return { category: best, confident: bestScore >= 3 };
}

// ---------------------------------------------------------------------------
// Dates and cover images
// ---------------------------------------------------------------------------

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * A publication date.
 *
 * The tracker dates nothing directly: one tab groups rows under month headings,
 * the other only numbers its weeks. So the month heading is used where there is
 * one, spread across that month by position, and otherwise the week number is
 * counted back from the most recent week in the tab. Both give the right
 * ordering on the listing, which is what the date is for here — the exact days
 * are editable per article afterwards.
 */
function publishedAt(entry: Entry, positionInMonth: number, latestWeek: number, today: Date) {
  const parsed = entry.month ? parseMonth(entry.month) : undefined;

  if (parsed) {
    const day = Math.min(1 + positionInMonth * 3, 28);
    return isoDate(new Date(Date.UTC(parsed.year, parsed.month, day)));
  }

  const weeksAgo = Math.max(0, latestWeek - (entry.week || latestWeek));
  const date = new Date(today);
  date.setUTCDate(date.getUTCDate() - weeksAgo * 7);
  return isoDate(date);
}

/**
 * Placeholder cover artwork, borrowed from the pool already on the site.
 *
 * Every article needs a picture and none was supplied, so these are stand-ins
 * the team replaces per article. Chosen by position rather than at random so a
 * re-run does not reshuffle them, and stepped by a number coprime with the pool
 * size so neighbouring cards in the listing never repeat.
 */
const coverPool: [string, string][] = [
  ["photo-1521791136064-7986c2920216", "Business advisers reviewing documentation together"],
  ["photo-1589829545856-d10d557cf95f", "Legal gavel and notes on a meeting table"],
  ["photo-1507679799987-c73779587ccf", "Professional working on documentation at a desk"],
  ["photo-1512453979798-5ea266f8880c", "Dubai skyline seen from the coast"],
  ["photo-1554774853-aae0a22c8aa4", "Tax paperwork and a calculator on a desk"],
  ["photo-1552581234-26160f608093", "Finance team discussing reporting"],
  ["photo-1454165804606-c3d57bc86b40", "Business team reviewing corporate documents"],
  ["photo-1460925895917-afdab827c52f", "Financial dashboards on a laptop screen"],
  ["photo-1551288049-bebda4e38f71", "Analytics dashboard on a monitor"],
  ["photo-1526628953301-3e589a6a8b74", "Reporting dashboard on a computer display"],
  ["photo-1543286386-713bdd548da4", "Growth chart drawn on paper beside a pen"],
  ["photo-1554224155-6726b3ff858f", "Accountant reviewing figures at a desk"],
  ["photo-1450101499163-c8848c66ca85", "Professional signing documentation"],
];

function coverImage(index: number) {
  const [id, alt] = coverPool[(index * 5) % coverPool.length];
  return {
    url: `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1400`,
    alt,
  };
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

type Prepared = {
  entry: Entry;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  confident: boolean;
  author: string;
  publishedAt: string;
  imageUrl: string;
  imageAlt: string;
  regions: TenantCode[];
  body: RichDoc;
  strategy: string;
  notes: string[];
  blocks: number;
  tables: number;
};

function countType(node: RichDoc, type: string): number {
  const self = node.type === type ? 1 : 0;
  return self + (node.content ?? []).reduce((n, c) => n + countType(c, type), 0);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    fail(
      "SUPABASE_DB_URL is not set in .env.local.\n" +
        "Dashboard -> Project Settings -> Database -> Connection string, port 5432.",
    );
  }

  console.log("Reading the spreadsheet…");
  const workbook = await fetch(
    `https://docs.google.com/spreadsheets/d/${options.sheetId}/export?format=xlsx`,
  );
  if (!workbook.ok) {
    fail(
      `Could not download the sheet (${workbook.status}).\n` +
        "It must be shared so that anyone with the link can view it.",
    );
  }

  const sheets = readWorkbook(Buffer.from(await workbook.arrayBuffer()));
  const all = entriesFrom(sheets);
  if (!all.length) fail("No rows in that sheet link to a document.");

  const entries = options.limit ? all.slice(0, options.limit) : all;
  const visible = entries.filter((e) => !e.hidden).length;
  console.log(
    `${all.length} linked rows across ${new Set(all.map((e) => e.tab)).size} tabs` +
      ` (${visible} visible, ${entries.length - visible} inside collapsed groups).`,
  );

  // Latest week per tab, for dating the tab that has no month headings.
  const latestWeek = new Map<string, number>();
  for (const e of entries) {
    latestWeek.set(e.tab, Math.max(latestWeek.get(e.tab) ?? 0, e.week));
  }

  const today = new Date();
  const takenSlugs = new Set<string>();
  const monthPositions = new Map<string, number>();
  const prepared: Prepared[] = [];
  const failures: { entry: Entry; reason: string }[] = [];
  const seenDocs = new Map<string, string>();

  for (const [index, entry] of entries.entries()) {
    process.stdout.write(`\r  reading ${index + 1}/${entries.length}…`);

    const title = titleFrom(entry.sheetTitle);
    if (!title) {
      failures.push({ entry, reason: "no title in the sheet" });
      continue;
    }

    const already = seenDocs.get(entry.docId);
    if (already) {
      failures.push({ entry, reason: `same document as "${already}"` });
      continue;
    }
    seenDocs.set(entry.docId, title);

    const response = await fetch(
      `https://docs.google.com/document/d/${entry.docId}/export?format=html`,
    );
    if (!response.ok) {
      failures.push({ entry, reason: `document not readable (${response.status})` });
      continue;
    }

    const body = extractBody(await response.text(), title);
    if (!body.doc.content?.length) {
      failures.push({ entry, reason: "document is empty after splitting" });
      continue;
    }

    const text = plainText(body.doc);
    const { category, confident } = inferCategory(title, text);

    const monthKey = `${entry.tab}|${entry.month ?? ""}`;
    const position = monthPositions.get(monthKey) ?? 0;
    monthPositions.set(monthKey, position + 1);

    let slug = slugify(title);
    if (!slug) slug = `insight-${index + 1}`;
    const base = slug;
    for (let n = 2; takenSlugs.has(slug); n += 1) slug = `${base}-${n}`;
    takenSlugs.add(slug);

    const cover = coverImage(prepared.length);

    prepared.push({
      entry,
      slug,
      title,
      excerpt: excerptFrom(body.doc),
      category,
      confident,
      author: entry.author,
      publishedAt: publishedAt(entry, position, latestWeek.get(entry.tab) ?? 0, today),
      imageUrl: cover.url,
      imageAlt: cover.alt,
      regions: regionsFor(entry.region),
      body: body.doc,
      strategy: body.strategy,
      notes: body.notes,
      blocks: body.doc.content?.length ?? 0,
      tables: countType(body.doc, "table"),
    });
  }

  process.stdout.write(`\r${" ".repeat(30)}\r`);

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------

  const withTables = prepared.filter((p) => p.tables);
  const unsure = prepared.filter((p) => !p.confident);
  const flagged = prepared.filter((p) => p.notes.length);

  console.log(`Prepared ${prepared.length} articles.`);
  console.log(`  ${withTables.length} contain tables (${withTables.reduce((n, p) => n + p.tables, 0)} in total)`);
  console.log(`  ${unsure.length} have a category worth checking`);
  console.log(`  ${flagged.length} carry a note about how they were split`);
  if (failures.length) console.log(`  ${failures.length} skipped`);

  const byCategory = new Map<string, number>();
  for (const p of prepared) byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
  console.log("\n  categories:");
  for (const [c, n] of [...byCategory].sort((a, b) => b[1] - a[1])) {
    console.log(`     ${String(n).padStart(4)}  ${c}`);
  }

  const strategies = new Map<string, number>();
  for (const p of prepared) strategies.set(p.strategy, (strategies.get(p.strategy) ?? 0) + 1);
  console.log("\n  how each body was found:");
  for (const [s, n] of [...strategies].sort((a, b) => b[1] - a[1])) {
    console.log(`     ${String(n).padStart(4)}  ${s}`);
  }

  if (failures.length) {
    console.log("\n  skipped:");
    for (const f of failures) {
      console.log(`     ${f.entry.tab} r${f.entry.row}  ${f.entry.sheetTitle.slice(0, 56)} — ${f.reason}`);
    }
  }

  if (options.report) {
    const lines = prepared.map((p) =>
      [
        p.slug,
        p.title,
        p.category + (p.confident ? "" : " (check)"),
        p.regions.join("+"),
        p.publishedAt,
        p.author,
        `${p.blocks} blocks`,
        p.tables ? `${p.tables} tables` : "",
        p.strategy,
        p.notes.join("; "),
      ].join("\t"),
    );
    writeFileSync(options.report, lines.join("\n") + "\n");
    console.log(`\n  per-article log written to ${options.report}`);
  }

  if (options.dryRun) {
    console.log(`\nDry run: ${prepared.length} would be imported. Nothing written.`);
    return;
  }

  // -------------------------------------------------------------------------
  // Write
  // -------------------------------------------------------------------------

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const { rows: existing } = await client.query<{ id: string; slug: string }>(
      "select id, slug from public.insights",
    );
    const bySlug = new Map(existing.map((r) => [r.slug, r.id]));

    const inserts = prepared.filter((p) => !bySlug.has(p.slug));
    const updates = options.update ? prepared.filter((p) => bySlug.has(p.slug)) : [];
    const skipped = prepared.length - inserts.length - updates.length;

    if (!inserts.length && !updates.length) {
      console.log("\nNothing to do — every article is already imported.");
      return;
    }

    await client.query("begin");

    for (const p of inserts) {
      await client.query(
        `insert into public.insights
           (slug, title, excerpt, category, author, published_at,
            image_url, image_alt, body, regions, published)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::public.region_code[],$11)`,
        [
          p.slug, p.title, p.excerpt, p.category, p.author || null, p.publishedAt,
          p.imageUrl, p.imageAlt, JSON.stringify(p.body), p.regions, options.publish,
        ],
      );
    }

    for (const p of updates) {
      // Only what the source is authoritative about. Whatever an editor has
      // changed — category, cover image, regions, publish state — is theirs.
      await client.query(
        `update public.insights
            set title = $2, excerpt = $3, published_at = $4, body = $5::jsonb
          where id = $1`,
        [bySlug.get(p.slug), p.title, p.excerpt, p.publishedAt, JSON.stringify(p.body)],
      );
    }

    await client.query("commit");

    console.log(`\nAdded ${inserts.length}, updated ${updates.length}${skipped ? `, left ${skipped} alone` : ""}.`);
    console.log(
      options.publish
        ? "Live on the public pages within five minutes."
        : "Review them at /admin/insights and publish the ones you want.",
    );
  } catch (error) {
    await client.query("rollback").catch(() => {});
    fail(`Import failed, nothing was written: ${(error as Error).message}`);
  } finally {
    await client.end();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main();
}
