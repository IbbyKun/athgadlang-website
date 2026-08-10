import { headers } from "next/headers";

import { listEvents, listInsights } from "@/lib/content";
import { leaderSlugs } from "@/lib/leaders";
import { legalDocuments } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";
import { getTenant, tenantCodeFromHost } from "@/lib/tenants";

/**
 * The sitemap for whichever region is being asked.
 *
 * A route handler rather than Next's `sitemap.ts` convention, because that
 * convention cannot read the request: this site is five hosts, each with its own
 * set of articles, and one file exported at build time could only ever describe
 * one of them. Handlers see the Host header, so each region gets a sitemap that
 * lists its own content — and the proxy leaves this path alone, since it excludes
 * anything with a file extension.
 *
 * Revalidated on the same interval as the pages, so publishing an article puts
 * it in the sitemap without a deploy.
 */
export const revalidate = 86400;

type Entry = {
  path: string;
  /** Rough guide for crawl budget, not a ranking signal. */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
};

export async function GET() {
  const host = (await headers()).get("host") ?? "";
  const tenant = getTenant(tenantCodeFromHost(host));

  // Region-filtered: a sitemap that listed every article in every region would
  // advertise around a hundred per region that 404 there, spending a crawler's
  // budget to prove us wrong. `generateStaticParams` asks per region for the same
  // reason.
  const [insights, events] = await Promise.all([
    listInsights(tenant.code),
    listEvents(tenant.code),
  ]);

  const entries: Entry[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.9, changeFrequency: "daily" },
    { path: "/webinars", priority: 0.8, changeFrequency: "weekly" },
    { path: "/events", priority: 0.8, changeFrequency: "weekly" },
    { path: "/company-profile", priority: 0.6, changeFrequency: "yearly" },
    // Low priority but they belong in the map: a crawler that cannot find the
    // privacy policy is a crawler that thinks the site does not have one.
    ...legalDocuments.map((document) => ({
      path: `/${document.slug}`,
      priority: 0.3,
      changeFrequency: "yearly" as const,
    })),
  ];

  // Practice areas and the services beneath them. Section anchors are left out:
  // a fragment is the same document, and listing it twice invites a crawler to
  // treat one page as several.
  for (const category of serviceCategories) {
    entries.push({ path: category.href, priority: 0.8, changeFrequency: "monthly" });
    for (const service of category.items ?? []) {
      if (!service.href.includes("#")) {
        entries.push({ path: service.href, priority: 0.7, changeFrequency: "monthly" });
      }
    }
  }

  for (const slug of leaderSlugs) {
    entries.push({
      path: `/about/leadership/${slug}`,
      priority: 0.5,
      changeFrequency: "yearly",
    });
  }

  for (const insight of insights) {
    entries.push({
      path: `/insights/${insight.slug}`,
      priority: 0.7,
      changeFrequency: "monthly",
    });
  }

  for (const event of events) {
    entries.push({
      path: `/events/${event.slug}`,
      priority: 0.6,
      changeFrequency: "weekly",
    });
  }

  // Recordings play in a dialog on the listing rather than at their own address,
  // so /webinars above is the only URL there is to offer for them.

  // Deduplicated: a service can be listed under two practice areas.
  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map((entry) =>
      [
        "  <url>",
        `    <loc>${absoluteUrl(tenant, entry.path)}</loc>`,
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    ),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
