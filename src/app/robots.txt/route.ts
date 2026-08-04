import { headers } from "next/headers";

import { absoluteUrl } from "@/lib/seo";
import { getTenant, isSiteHost, tenantCodeFromHost } from "@/lib/tenants";

/**
 * robots.txt, per host.
 *
 * A handler rather than a static file for two reasons. The sitemap line has to
 * name the host being asked, or four of the five regions would advertise the
 * primary region's sitemap. And a deployment URL — a Vercel preview, a staging
 * host — is not a site anyone should index; those get a blanket refusal, which a
 * file in public/ could not distinguish.
 *
 * `/admin` is disallowed even though it is behind a password: a crawler that
 * cannot get in still wastes its budget trying, and the login page has no
 * business in an index.
 */
export const revalidate = 3600;

export async function GET() {
  const host = (await headers()).get("host") ?? "";

  // Anything that is not one of our domains is a preview or a bare deployment.
  if (!isSiteHost(host)) {
    return text(["User-agent: *", "Disallow: /"].join("\n"));
  }

  const tenant = getTenant(tenantCodeFromHost(host));

  return text(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /api/",
      "",
      `Sitemap: ${absoluteUrl(tenant, "/sitemap.xml")}`,
      "",
    ].join("\n"),
  );
}

function text(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
