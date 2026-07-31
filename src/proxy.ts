import { NextResponse, type NextRequest } from "next/server";

import {
  isSiteHost,
  primaryTenant,
  tenantCode,
  tenantCookie,
  tenantSubdomainCode,
} from "@/lib/tenants";

/**
 * Maps the request onto the `[tenant]` route segment.
 *
 * ksa.athgadlang.com/insights  ->  /sa/insights
 * athgadlang.com/insights      ->  /ae/insights
 *
 * A rewrite, not a redirect: the address bar keeps the clean URL, and Vercel
 * still serves the statically prerendered page for that segment. Because the
 * prefix is added here, internal links stay prefix-free.
 *
 * The region comes from the subdomain wherever there is one to read. On a host
 * that cannot carry our subdomains — a Vercel deployment URL, an IP — it comes
 * from the cookie the region switcher sets, so the whole site behaves as the
 * chosen region behind the same clean URLs it will have in production. Point
 * the real domain at the deployment and the subdomain takes over; nothing about
 * the pages themselves changes.
 *
 * Lives in proxy.ts, not middleware.ts — Next 16 renamed the convention, and
 * the export name must match the filename.
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const fromSubdomain = tenantSubdomainCode(host);

  // A domain of ours is authoritative about its own region: a cookie left over
  // from a preview must never override ksa.athgadlang.com.
  const fromCookie =
    fromSubdomain || isSiteHost(host)
      ? undefined
      : tenantCode(request.cookies.get(tenantCookie)?.value);

  const code = fromSubdomain ?? fromCookie ?? primaryTenant.code;

  const url = request.nextUrl.clone();
  url.pathname = `/${code}${url.pathname}`;
  const response = NextResponse.rewrite(url);

  if (fromCookie) {
    // The URL alone no longer says which region this is, so the edge must not
    // hand one region's page to a visitor who asked for another.
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Vary", "Cookie");
  }

  return response;
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.).*)"],
};
