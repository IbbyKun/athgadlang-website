import "server-only";

import { popupTable, type SitePopupRow } from "@/lib/popup";
import {
  writeClient,
  type EventRow,
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
    return "The database tables are missing. Run `npm run db:push` to apply the migrations.";
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

/** Every event, drafts included, soonest first — the calendar order. */
export async function listAllEvents(): Promise<Loaded<EventRow>> {
  const supabase = writeClient();
  if (!supabase) return { rows: [], error: unconfigured };

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) return { rows: [], error: describe(error.message) };
  return { rows: data as EventRow[] };
}

/** One event by id, or null when it is not there. */
export async function getEventRow(id: string): Promise<EventRow | null> {
  const supabase = writeClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as EventRow) ?? null;
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
/**
 * Timezone labels offered as suggestions on the event form.
 *
 * One per region the group operates in. The field is free text, so this is a
 * shortcut rather than a constraint — a session run from anywhere else can still
 * state its own.
 */
export const eventTimezones = [
  "GST (UTC+4)",
  "AST (UTC+3)",
  "PKT (UTC+5)",
  "BST (UTC+1)",
  "GMT (UTC+0)",
];


/** Every popup, drafts included, newest first. */
export async function listAllPopups(): Promise<Loaded<SitePopupRow>> {
  const supabase = writeClient();
  if (!supabase) return { rows: [], error: unconfigured };

  const { data, error } = await supabase
    .from(popupTable)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { rows: [], error: describe(error.message) };
  return { rows: data as SitePopupRow[] };
}

/** One popup by id, or null when it is not there. */
export async function getPopupRow(id: string): Promise<SitePopupRow | null> {
  const supabase = writeClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from(popupTable)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return (data as SitePopupRow) ?? null;
}

/**
 * Events a popup can point at: published, and not already over.
 *
 * Past events are left out because a popup exists to bring people to something
 * they can still attend. Ordered soonest first, which is the order somebody
 * picking "the next seminar" is thinking in.
 */
export async function upcomingEventChoices() {
  const supabase = writeClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("events")
    .select("slug, title, event_date")
    .eq("published", true)
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true });

  return (data ?? []) as { slug: string; title: string; event_date: string }[];
}
