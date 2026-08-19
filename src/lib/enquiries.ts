import "server-only";

import { writeClient } from "@/lib/supabase";
import type { TenantCode } from "@/lib/tenants";

/** A stored enquiry, mirroring supabase/migrations/. */
export type ContactEnquiryRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  region: TenantCode | null;
  source_path: string | null;
  /** Set when somebody in the panel ticks it off. Null is the queue. */
  handled_at: string | null;
  created_at: string;
};

export const enquiriesTable = "contact_enquiries";

/** Rows per page in the admin list. */
export const enquiriesPerPage = 25;

/**
 * Record an enquiry from the contact form.
 *
 * Returns `{ ok: false }` rather than throwing when the database is not
 * configured, the same as the newsletter — the site is built to run with no
 * Supabase project attached. The caller turns that into a visible failure
 * rather than a success message, which is the whole point of storing these:
 * an enquiry that cannot be saved must not be told it was.
 */
export async function saveEnquiry(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  region: TenantCode;
  sourcePath: string | null;
}) {
  const client = writeClient();
  if (!client) return { ok: false as const, reason: "not-configured" as const };

  const { error } = await client.from(enquiriesTable).insert({
    first_name: input.firstName,
    last_name: input.lastName,
    // Lowercased for the same reason as a subscriber's: the domain is
    // case-insensitive everywhere it matters, and two spellings of one address
    // read as two people.
    email: input.email.toLowerCase(),
    phone: input.phone,
    message: input.message,
    region: input.region,
    source_path: input.sourcePath,
  });

  if (error) {
    console.error("[contact] could not store enquiry", error.message);
    return { ok: false as const, reason: "write-failed" as const };
  }

  return { ok: true as const };
}

export type EnquiryPage = {
  rows: ContactEnquiryRow[];
  /** Matching the current filter, not the table. Drives the pager. */
  total: number;
  /** Clamped to what exists, so ?page=999 lands on the last page. */
  page: number;
  pageCount: number;
  error?: string;
};

/**
 * A page of enquiries, newest first.
 *
 * Paged and searched in Postgres rather than in the browser, which is the
 * opposite of how the content lists work — see SearchableList for why those
 * filter client-side. The difference is that articles and events are a few
 * hundred rows written by us and bounded by how much anyone can write, while
 * this table only ever grows and is filled in by strangers. Shipping every
 * lead the firm has ever taken to the browser to find one of them would get
 * slower every week and put the whole list in a page source.
 */
export async function listEnquiries({
  page = 1,
  query = "",
  status = "all",
}: {
  page?: number;
  query?: string;
  status?: "all" | "open";
} = {}): Promise<EnquiryPage> {
  const empty = { rows: [], total: 0, page: 1, pageCount: 1 };

  const client = writeClient();
  if (!client) {
    return {
      ...empty,
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    };
  }

  /*
    One `or` across the fields somebody would search by. The term is stripped
    of the filter language's own punctuation first: a comma separates
    conditions and a parenthesis closes the group, so either one typed into the
    box would be read as part of the query rather than as text to look for.
  */
  const term = query.trim().replace(/[,()\\]/g, " ").trim();
  const or = term
    ? ["first_name", "last_name", "email", "phone", "message"]
        .map((column) => `${column}.ilike.%${term}%`)
        .join(",")
    : null;

  // Counted before the rows are fetched, because which range to ask for
  // depends on how many there are — a page past the end should land on the
  // last page rather than return nothing.
  let counting = client
    .from(enquiriesTable)
    .select("id", { count: "exact", head: true });
  if (status === "open") counting = counting.is("handled_at", null);
  if (or) counting = counting.or(or);

  const { count, error: countError } = await counting;
  if (countError) return { ...empty, error: describe(countError.message) };

  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / enquiriesPerPage));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), pageCount);
  const first = (current - 1) * enquiriesPerPage;

  let selecting = client.from(enquiriesTable).select("*");
  if (status === "open") selecting = selecting.is("handled_at", null);
  if (or) selecting = selecting.or(or);

  const { data, error } = await selecting
    .order("created_at", { ascending: false })
    .range(first, first + enquiriesPerPage - 1);

  if (error) return { ...empty, error: describe(error.message) };

  return {
    rows: (data ?? []) as ContactEnquiryRow[],
    total,
    page: current,
    pageCount,
  };
}

/**
 * How many enquiries are waiting for a reply. Asked for separately from the
 * list because it has to ignore the list's filters: the "Awaiting reply" tab
 * should show the size of the queue, not the size of itself.
 */
export async function countOpenEnquiries() {
  const client = writeClient();
  if (!client) return 0;

  const { count } = await client
    .from(enquiriesTable)
    .select("id", { count: "exact", head: true })
    .is("handled_at", null);

  return count ?? 0;
}

/** How many there are in total. For the overview card. */
export async function countEnquiries() {
  const client = writeClient();
  if (!client) return 0;

  const { count } = await client
    .from(enquiriesTable)
    .select("id", { count: "exact", head: true });

  return count ?? 0;
}

/** Ticks an enquiry off, or puts it back in the queue. */
export async function setEnquiryHandled(id: string, handled: boolean) {
  const client = writeClient();
  if (!client) return;

  await client
    .from(enquiriesTable)
    .update({ handled_at: handled ? new Date().toISOString() : null })
    .eq("id", id);
}

/** Deletes one. The only way to remove a lead once it is dealt with. */
export async function deleteEnquiryRow(id: string) {
  const client = writeClient();
  if (!client) return;

  await client.from(enquiriesTable).delete().eq("id", id);
}

/** Same wording as the content queries use for the same two mistakes. */
function describe(message: string) {
  if (message.includes("does not exist")) {
    return "The contact_enquiries table is missing. Run `npm run db:push` to apply the migrations.";
  }
  return message;
}
