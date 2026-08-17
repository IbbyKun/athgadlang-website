import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { TenantCode } from "@/lib/tenants";

/**
 * Supabase access, server-side only.
 *
 * Two clients, deliberately separate:
 *
 *   readClient()   anon key, subject to row level security, so it can only
 *                  ever see published rows. Used by the public pages.
 *   writeClient()  service role key, bypasses row level security. Used by the
 *                  admin server actions and nowhere else.
 *
 * Both return `null` when the environment is not configured, rather than
 * throwing. The site predates the database and still carries its built-in
 * articles, so it has to build and run with no Supabase project attached —
 * the content layer treats a null client as "no rows".
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once the project URL and anon key are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** True once writes are possible too. */
export const canWriteContent = Boolean(url && serviceKey);

// No session to persist: every client here is created per request on the
// server, so the auth helpers would only add work and a warning.
const options = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

/** Read-only client for the public site. Null until Supabase is configured. */
export function readClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, options);
}

/**
 * Privileged client for the admin panel. Null until the service role key is
 * set. Callers must already have checked the admin session.
 */
export function writeClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, options);
}

/** Storage bucket holding uploaded cover images. Created by the migrations. */
export const contentBucket = "content";

/** Row shapes, mirroring supabase/migrations/. */
export type InsightRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string | null;
  /** Title tag without the brand suffix. Null falls back to `title`. */
  meta_title: string | null;
  /** Meta description. Null falls back to `excerpt`. */
  meta_description: string | null;
  published_at: string;
  image_url: string;
  image_alt: string;
  body: unknown;
  regions: TenantCode[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  slug: string;
  title: string;
  kind: "webinar" | "seminar" | "networking";
  event_date: string;
  start_time: string;
  timezone: string;
  mode: "online" | "venue";
  venue: string;
  price: string;
  access: string;
  excerpt: string;
  image_url: string;
  image_alt: string;
  register_url: string;
  recording_url: string;
  partner: string;
  service_line: string;
  body: unknown;
  /**
   * `jsonb` arrays of EventSpeaker and EventAgendaItem. `unknown`, like `body`,
   * because the database guarantees only that each is an array — narrow them
   * with `parseSpeakers` / `parseAgenda` rather than casting.
   */
  speakers: unknown;
  agenda: unknown;
  regions: TenantCode[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type WebinarRow = {
  id: string;
  slug: string;
  title: string;
  published_at: string;
  duration: string;
  youtube_id: string | null;
  image_url: string;
  image_alt: string;
  regions: TenantCode[];
  published: boolean;
  created_at: string;
  updated_at: string;
};
