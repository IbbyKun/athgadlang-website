"use client";

import type * as React from "react";

import {
  isSiteHost,
  tenantCookie,
  tenantUrl,
  type Tenant,
} from "@/lib/tenants";

/** `*.localhost` resolves to 127.0.0.1 in Chrome, Firefox and Safari alike. */
function hasLocalSubdomains(hostname: string) {
  return hostname === "localhost" || hostname.endsWith(".localhost");
}

/**
 * Props for a link that switches region.
 *
 * `href` is always the real production URL, so the markup is correct for
 * production and for crawlers, and that is exactly what a click follows once
 * the site is served from our own domain.
 *
 * Anywhere else those subdomains do not exist, and following one would leave
 * for the live site — which is not what the visitor asked for. So the click is
 * intercepted:
 *
 *   *.localhost      the dev server answers on every subdomain, so hop to it
 *                    and let the proxy read the region from the host, as in
 *                    production
 *   anything else    a deployment URL has no subdomains of its own: record the
 *                    region in a cookie and reload, which keeps every
 *                    prefix-free link that follows inside it
 */
export function tenantLinkProps(tenant: Tenant) {
  return {
    href: tenantUrl(tenant),
    onClick(event: React.MouseEvent<HTMLAnchorElement>) {
      // Let modified clicks (new tab, download…) behave normally.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const { hostname, protocol, port } = window.location;
      if (isSiteHost(hostname)) return;

      event.preventDefault();

      if (hasLocalSubdomains(hostname)) {
        const host = tenant.subdomain
          ? `${tenant.subdomain}.localhost`
          : "localhost";
        window.location.href = `${protocol}//${host}${port ? `:${port}` : ""}/`;
        return;
      }

      document.cookie = `${tenantCookie}=${tenant.code}; path=/; samesite=lax`;
      window.location.reload();
    },
  };
}
