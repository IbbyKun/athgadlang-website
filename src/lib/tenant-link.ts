"use client";

import type * as React from "react";

import { tenantUrl, type Tenant } from "@/lib/tenants";

/**
 * Props for a link that switches region.
 *
 * `href` is always the real production URL, so markup is correct for
 * production and for crawlers. In development those subdomains do not exist —
 * following one would land on the live site — so the click is intercepted and
 * sent to the `*.localhost` equivalent on whatever port the dev server is
 * actually using. Chrome, Firefox and Safari all resolve `*.localhost` to
 * 127.0.0.1, and middleware reads the subdomain from it exactly as in
 * production.
 */
export function tenantLinkProps(tenant: Tenant) {
  return {
    href: tenantUrl(tenant),
    onClick(event: React.MouseEvent<HTMLAnchorElement>) {
      if (process.env.NODE_ENV === "production") return;
      // Let modified clicks (new tab, download…) behave normally.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      const { protocol, port } = window.location;
      const host = tenant.subdomain
        ? `${tenant.subdomain}.localhost`
        : "localhost";
      window.location.href = `${protocol}//${host}${port ? `:${port}` : ""}/`;
    },
  };
}
