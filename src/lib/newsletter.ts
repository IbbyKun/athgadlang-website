import "server-only";

import { writeClient } from "@/lib/supabase";
import { getTenant, type TenantCode } from "@/lib/tenants";
import { addToNewsletterList } from "@/lib/zoho";

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

  const address = email.toLowerCase();

  const { error } = await client.from(newsletterTable).upsert(
    {
      email: address,
      region,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("[newsletter] could not store subscriber", error.message);
    return { ok: false as const, reason: "write-failed" as const };
  }

  await pushToPlatform(client, address, region);

  return { ok: true as const };
}

/**
 * Hands the address to Zoho Campaigns and records that it went.
 *
 * Deliberately after the row is written and deliberately unable to fail the
 * sign-up. Zoho being down, rate limiting us, or simply not configured yet
 * must not turn somebody's sign-up into an error message: they asked to hear
 * from us, we have their address, and the only thing outstanding is a transfer
 * we can retry. `synced_at` is what tells the two apart, and
 * `scripts/sync-newsletter.mts` is what drains the backlog.
 *
 * The region travels as Zoho's `source`, so a Pakistan sign-up can be told
 * from a UK one inside Campaigns without a custom field.
 */
async function pushToPlatform(
  client: NonNullable<ReturnType<typeof writeClient>>,
  address: string,
  region: TenantCode,
) {
  const result = await addToNewsletterList(
    address,
    `${getTenant(region).label} website`,
  );

  if (!result.ok) {
    // Not configured is the expected state until the list key is set, and is
    // not worth a line in the log on every sign-up.
    if (result.reason !== "not-configured") {
      console.error("[newsletter] Zoho rejected the address", result.detail);
    }
    return;
  }

  await client
    .from(newsletterTable)
    .update({ synced_at: new Date().toISOString() })
    .eq("email", address);
}
