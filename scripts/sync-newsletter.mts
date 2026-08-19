/**
 * Pushes queued newsletter subscribers to Zoho Campaigns.
 *
 *   npm run sync:newsletter -- [--write] [--all]
 *
 * Without `--write` it reports what it would send and changes nothing.
 *
 * The sign-up route already hands each new address to Zoho as it arrives, so
 * in normal running this has nothing to do. It exists for the times that path
 * cannot cover: addresses collected before the integration was connected, and
 * ones whose push failed because Zoho was unreachable at that moment. A row
 * with `synced_at` null is exactly that backlog, which is what this drains.
 *
 * `--all` re-sends addresses that are already marked as synced. Adding a
 * contact twice is not an error in Zoho — the second call updates the first —
 * so this is safe, and it is the way back from a list being deleted or the
 * credentials being pointed at a different one.
 *
 * Sequential rather than parallel, with a pause between calls. Zoho allows far
 * more than this needs, and a list of a few hundred addresses is not worth the
 * risk of tripping a rate limit that locks the account out for half an hour.
 */

import { createClient } from "@supabase/supabase-js";

const WRITE = process.argv.includes("--write");
const ALL = process.argv.includes("--all");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN ?? "accounts.zoho.com";
const campaignsDomain =
  process.env.ZOHO_CAMPAIGNS_DOMAIN ?? "campaigns.zoho.com";
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
const listKey = process.env.ZOHO_CAMPAIGNS_LIST_KEY;

if (!clientId || !clientSecret || !refreshToken || !listKey) {
  console.error(
    "Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN and ZOHO_CAMPAIGNS_LIST_KEY.",
  );
  process.exit(1);
}

/** Region labels, so the Zoho `source` field reads like the site does. */
const regionLabels: Record<string, string> = {
  ae: "UAE",
  bh: "Bahrain",
  sa: "KSA",
  uk: "UK",
  pk: "Pakistan",
};

const supabase = createClient(url, key, { auth: { persistSession: false } });

let query = supabase
  .from("newsletter_subscribers")
  .select("email, region, synced_at")
  .order("created_at", { ascending: true });

if (!ALL) query = query.is("synced_at", null);

const { data: rows, error } = await query;
if (error) {
  console.error("Could not read subscribers:", error.message);
  process.exit(1);
}

if (!rows?.length) {
  console.log(
    ALL ? "No subscribers at all." : "Nothing queued — every address is synced.",
  );
  process.exit(0);
}

console.log(
  `${rows.length} address${rows.length === 1 ? "" : "es"} to send${WRITE ? "" : " (dry run)"}`,
);

if (!WRITE) {
  for (const row of rows) console.log(`  would send  ${row.email}`);
  console.log("\nRe-run with --write to send them.");
  process.exit(0);
}

/** One access token for the whole run; they last an hour. */
const tokenResponse = await fetch(`https://${accountsDomain}/oauth/v2/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  }),
});

const { access_token: accessToken, error: tokenError } =
  (await tokenResponse.json()) as { access_token?: string; error?: string };

if (!accessToken) {
  console.error(`Zoho refused the refresh token: ${tokenError ?? "unknown"}`);
  process.exit(1);
}

let sent = 0;
let failed = 0;

for (const row of rows) {
  const response = await fetch(
    `https://${campaignsDomain}/api/v1.1/json/listsubscribe`,
    {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        resfmt: "JSON",
        listkey: listKey,
        contactinfo: JSON.stringify({ "Contact Email": row.email }),
        source: `${regionLabels[row.region ?? ""] ?? "Website"} website`,
      }),
    },
  );

  // Zoho answers 200 with a body saying "error", so the status is not the
  // thing to check — an invalid list key arrives as a successful request.
  const body = (await response.json().catch(() => null)) as {
    status?: string;
    message?: string;
  } | null;

  if (!body || body.status === "error") {
    failed += 1;
    console.log(`  failed  ${row.email}  ${body?.message ?? response.status}`);
  } else {
    sent += 1;
    await supabase
      .from("newsletter_subscribers")
      .update({ synced_at: new Date().toISOString() })
      .eq("email", row.email);
    console.log(`  sent    ${row.email}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
}

console.log(`\nSent ${sent}, failed ${failed}.`);
