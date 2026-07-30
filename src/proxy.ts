import { NextResponse, type NextRequest } from "next/server";

import { tenantCodeFromHost } from "@/lib/tenants";

/**
 * Maps the request host onto the `[tenant]` route segment.
 *
 * ksa.athgadlang.com/insights  ->  /sa/insights
 * athgadlang.com/insights      ->  /ae/insights
 *
 * A rewrite, not a redirect: the address bar keeps the clean URL, and Vercel
 * still serves the statically prerendered page for that segment. Because the
 * prefix is added here, internal links stay prefix-free.
 *
 * Lives in proxy.ts, not middleware.ts — Next 16 renamed the convention, and
 * the export name must match the filename.
 */
export function proxy(request: NextRequest) {
  const code = tenantCodeFromHost(request.headers.get("host") ?? "");
  const url = request.nextUrl.clone();
  url.pathname = `/${code}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.).*)"],
};
