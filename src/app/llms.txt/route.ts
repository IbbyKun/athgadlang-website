import { headers } from "next/headers";

import { leaderHref, leaders } from "@/lib/leaders";
import { absoluteUrl } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";
import { contactFor, siteConfig } from "@/lib/site-config";
import {
  getTenant,
  isSiteHost,
  tenantCodeFromHost,
  tenants,
} from "@/lib/tenants";

/**
 * llms.txt — what this site is, for a model reading it rather than a crawler
 * indexing it.
 *
 * A convention rather than a standard: a Markdown summary at a known path, so
 * an assistant asked about the firm can find the structure without inferring it
 * from navigation markup. It costs one small route and it is the only file on
 * the site whose audience is explicitly a model.
 *
 * Per host, for the same reason robots.txt is: the region decides which
 * brand name and which sitemap this describes. A preview or deployment URL is
 * not a site anyone should summarise, and gets nothing.
 *
 * Deliberately links rather than duplicates. Restating the service copy here
 * would create a second version to keep in step with the pages, and the pages
 * are the version that is reviewed.
 */
export const revalidate = 3600;

export async function GET() {
  const host = (await headers()).get("host") ?? "";

  if (!isSiteHost(host)) {
    return new Response("Not found", { status: 404 });
  }

  const tenant = getTenant(tenantCodeFromHost(host));
  const brand = tenant.brandName ?? siteConfig.name;
  const contact = contactFor(tenant.code);

  const lines = [
    `# ${brand}`,
    "",
    `> An audit, tax, accounting and advisory firm serving businesses in ${tenant.inRegion}.`,
    "",
    `${brand} is the ${tenant.label} practice of the athGADLANG group, which operates across the UAE, Saudi Arabia, Bahrain, the UK and Pakistan. This file describes the ${tenant.label} site; each region has its own.`,
    "",
    "## Services",
    "",
    ...serviceCategories.map(
      (area) =>
        `- [${area.label}](${absoluteUrl(tenant, area.href)})${area.description ? `: ${area.description}` : ""}`,
    ),
    "",
    "## Content",
    "",
    `- [Insights](${absoluteUrl(tenant, "/insights")}): written guidance on tax, audit, compliance and business setup.`,
    `- [Webinars](${absoluteUrl(tenant, "/webinars")}): recordings of past sessions.`,
    `- [Events](${absoluteUrl(tenant, "/events")}): upcoming live sessions and seminars.`,
    "",
    "## About",
    "",
    `- [Company profile](${absoluteUrl(tenant, "/company-profile")})`,
    /*
      `/#leaders` and not `/about/leadership`: there is no leadership index page.
      Profiles live at /about/leadership/<slug> and the homepage section is what
      indexes them — which is why the profile pages themselves link back here.
    */
    `- [Leadership](${absoluteUrl(tenant, "/#leaders")}) lists the partner and director profiles:`,
    ...leaders.map(
      (leader) =>
        `  - [${leader.name}](${absoluteUrl(tenant, leaderHref(leader))}), ${leader.role}`,
    ),
    `- [Contact](${absoluteUrl(tenant, "/#contact")}): ${contact.email}, ${contact.phone}, ${contact.address}`,
    "",
    "## Regional sites",
    "",
    // Named so an assistant asked a region-specific question can be pointed at
    // the site that actually answers it, rather than generalising from this one.
    ...tenants.map((other) => {
      const otherBrand = other.brandName ?? siteConfig.name;
      return `- ${other.label}, ${otherBrand}: ${absoluteUrl(other, "/")}`;
    }),
    "",
    "## Notes",
    "",
    "- Guidance on this site is general and not a substitute for advice on a specific set of facts.",
    `- Full index: ${absoluteUrl(tenant, "/sitemap.xml")}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
