import "server-only";

import { writeClient } from "@/lib/supabase";
import type { TenantCode } from "@/lib/tenants";

/** A stored subscriber, mirroring supabase/migrations/. */
export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  region: TenantCode | null;
  /** Set once the address has been handed to the email platform. */
  synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export const newsletterTable = "newsletter_subscribers";

/**
 * Record a sign-up.
 *
 * Upsert on the address rather than insert: somebody signing up twice is
 * ordinary — a second visit, a different device — and it should not fail, nor
 * should it leave two rows for one person. The second sign-up refreshes the
 * region and the timestamp, so the row reflects where they last asked from.
 *
 * The address is lowercased first. Mail servers treat the domain as
 * case-insensitive and every provider we would send through treats the whole
 * address that way, so storing both `A@x.com` and `a@x.com` would mean mailing
 * one person twice.
 *
 * Returns `{ ok: false }` rather than throwing when the database is not
 * configured. The site is built to run without Supabase attached, and a
 * sign-up form that 500s on a preview deployment is worse than one that says
 * it could not save.
 */
export async function subscribeToNewsletter(email: string, region: TenantCode) {
  const client = writeClient();
  if (!client) return { ok: false as const, reason: "not-configured" as const };

  const { error } = await client.from(newsletterTable).upsert(
    {
      email: email.toLowerCase(),
      region,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("[newsletter] could not store subscriber", error.message);
    return { ok: false as const, reason: "write-failed" as const };
  }

  return { ok: true as const };
}
