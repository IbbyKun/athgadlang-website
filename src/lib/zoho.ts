import "server-only";

/**
 * Zoho Campaigns, the email platform the newsletter list is kept in.
 *
 * Authentication is OAuth, set up as a Self Client in the Zoho API Console:
 * there is no user to send through a consent screen, only this server talking
 * to that account. The refresh token is permanent and is the real credential;
 * access tokens last an hour and are fetched from it as needed.
 *
 * Everything here is optional. Nothing in the sign-up path depends on Zoho
 * being configured — an address is stored first and pushed second, and a push
 * that cannot happen leaves the row queued rather than failing the sign-up.
 * See lib/newsletter.ts.
 */

/*
  Data centre. Zoho runs several and an account lives in exactly one; the same
  credentials are rejected by the others with a plain 401, which reads as
  "wrong password" rather than "wrong continent". Defaulted to the US pair,
  which is where this account is, and overridable because moving region is a
  thing Zoho does on request.
*/
const accountsDomain =
  process.env.ZOHO_ACCOUNTS_DOMAIN ?? "accounts.zoho.com";
const campaignsDomain =
  process.env.ZOHO_CAMPAIGNS_DOMAIN ?? "campaigns.zoho.com";

const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
const listKey = process.env.ZOHO_CAMPAIGNS_LIST_KEY;

/** True once the credentials and a list to write into are both present. */
export function isZohoConfigured() {
  return Boolean(clientId && clientSecret && refreshToken && listKey);
}

/*
  The current access token, held in module scope.

  This is a cache with the lifetime of a warm serverless instance, which is the
  right shape for an hour-long token: a cold start pays one extra round trip,
  and everything after it reuses the token instead of asking for a new one per
  sign-up. Nothing is persisted — a token is not worth a database row when the
  thing that mints it is a single request away.

  Expiry is deliberately shortened by a minute, so a token that is about to
  lapse mid-flight is replaced rather than used.
*/
let cached: { token: string; expiresAt: number } | null = null;

async function accessToken() {
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const response = await fetch(`https://${accountsDomain}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken!,
    }),
    // Never cached by Next: this is a credential exchange, and a replayed
    // response would hand back a token that has already expired.
    cache: "no-store",
  });

  const body = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };

  if (!body.access_token) {
    throw new Error(`Zoho refused the refresh token: ${body.error ?? "unknown"}`);
  }

  cached = {
    token: body.access_token,
    expiresAt: Date.now() + ((body.expires_in ?? 3600) - 60) * 1000,
  };

  return cached.token;
}

export type ZohoResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "failed"; detail?: string };

/**
 * Adds an address to the mailing list.
 *
 * Whether the person is then emailed a confirmation before being added, or
 * added outright, is a property of the list in Zoho rather than of this call —
 * a list with its signup form enabled double opts in, one without does not.
 * That is the correct place for the decision: it is a consent policy, not a
 * detail of how the website talks to the platform.
 *
 * `source` shows up in Zoho against the contact, so a regional site can be
 * told apart from an import or a manual add without another field.
 *
 * Never throws. The caller has already stored the address, so a failure here
 * means "still queued", not "lost".
 */
export async function addToNewsletterList(
  email: string,
  source: string,
): Promise<ZohoResult> {
  if (!isZohoConfigured()) return { ok: false, reason: "not-configured" };

  try {
    const token = await accessToken();

    const response = await fetch(
      `https://${campaignsDomain}/api/v1.1/json/listsubscribe`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          resfmt: "JSON",
          listkey: listKey!,
          contactinfo: JSON.stringify({ "Contact Email": email }),
          source,
        }),
        cache: "no-store",
      },
    );

    // Zoho answers 200 with a body saying "error", so the status alone proves
    // nothing — an invalid list key comes back as a perfectly successful HTTP
    // request. The body's own `status` is the one to read.
    const body = (await response.json().catch(() => null)) as {
      status?: string;
      code?: string;
      message?: string;
    } | null;

    if (!body || body.status === "error") {
      return {
        ok: false,
        reason: "failed",
        detail: body?.message ?? `HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "failed",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}
