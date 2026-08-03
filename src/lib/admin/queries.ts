import "server-only";

import {
  writeClient,
  type InsightRow,
  type WebinarRow,
} from "@/lib/supabase";

/**
 * Reads for the admin panel.
 *
 * Separate from `src/lib/content.ts` in two ways that matter: these go through
 * the service role client, so drafts are visible, and they are not cached —
 * an editor must always see the row as it is now, not as it was when the
 * public page last rendered.
 *
 * Every function returns an `error` string instead of throwing, so a missing
 * table or an unreachable project shows up as a message inside the panel
 * rather than an error page with nothing actionable on it.
 */

export type Loaded<T> = { rows: T[]; error?: string };

/** Explains the two setup mistakes that produce an empty panel. */
function describe(message: string) {
  if (message.includes("does not exist")) {
    return "The database tables are missing. Run supabase/schema.sql in the Supabase SQL editor.";
  }
  return message;
}

const unconfigured =
  "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.";

/** Every article, drafts included, newest first. */
export async function listAllInsights(): Promise<Loaded<InsightRow>> {
  const supabase = writeClient();
  if (!supabase) return { rows: [], error: unconfigured };

  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) return { rows: [], error: describe(error.message) };
  return { rows: data as InsightRow[] };
}

/** Every session, drafts included, newest first. */
export async function listAllWebinars(): Promise<Loaded<WebinarRow>> {
  const supabase = writeClient();
  if (!supabase) return { rows: [], error: unconfigured };

  const { data, error } = await supabase
    .from("webinars")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) return { rows: [], error: describe(error.message) };
  return { rows: data as WebinarRow[] };
}

/** One article by id, or null when it is not there. */
export async function getInsightRow(id: string): Promise<InsightRow | null> {
  const supabase = writeClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("insights")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as InsightRow) ?? null;
}

/** One session by id, or null when it is not there. */
export async function getWebinarRow(id: string): Promise<WebinarRow | null> {
  const supabase = writeClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("webinars")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as WebinarRow) ?? null;
}

/**
 * Categories offered in the article form.
 *
 * The site's existing articles use a small, settled set, and a free-text field
 * would quietly fragment it — "Corporate Tax" and "Corporate tax" would filter
 * as two different things. Add to this list when the practice adds a category.
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
