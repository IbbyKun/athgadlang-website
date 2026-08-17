import type { Metadata } from "next";

import { pageMetaFor } from "@/lib/page-meta";
import { siteConfig } from "@/lib/site-config";
import { tenantUrl, tenants, type Tenant } from "@/lib/tenants";

/**
 * Metadata shared by every page.
 *
 * The problem this exists to solve is specific to a site served from five hosts.
 * `athgadlang.com/services/tax` and `uk.athgadlang.com/services/tax` are the
 * same words, and to a crawler with no other information they are two pages
 * competing with each other. Left alone, five regional sites split their own
 * ranking five ways.
 *
 * The fix is not to pick one and canonicalise the rest away — each region is a
 * real site for a real market, and KSA trades under its own brand. It is to say
 * so: every page names itself as its own canonical and lists the other four as
 * regional alternates, which is exactly what `hreflang` is for. A search engine
 * then knows there is one page in five variants and shows a reader the one for
 * where they are.
 */

/** BCP 47 tags for the markets each region serves. */
const regionLocales: Record<string, string> = {
  ae: "en-AE",
  bh: "en-BH",
  sa: "en-SA",
  uk: "en-GB",
  pk: "en-PK",
};

/** A tenant's origin, without the trailing slash `tenantUrl` adds. */
export function origin(tenant: Tenant) {
  return tenantUrl(tenant).replace(/\/$/, "");
}

/** An absolute URL on a region's own host. */
export function absoluteUrl(tenant: Tenant, path = "/") {
  return `${origin(tenant)}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Canonical and regional alternates for one page.
 *
 * `regions` matters more than it looks. Most pages — the services, the
 * homepage — exist on all five hosts, and listing all five is right. An article
 * targeted at Bahrain exists on one, and naming the other four as alternates
 * would point a crawler at four addresses that return 404, which is worse than
 * saying nothing: it spends crawl budget to discover that we were wrong.
 *
 * `x-default` goes to the first region that actually carries the page.
 */
export function alternatesFor(
  tenant: Tenant,
  path = "/",
  regions?: readonly string[],
): Metadata["alternates"] {
  const carrying = regions?.length
    ? tenants.filter((other) => regions.includes(other.code))
    : tenants;

  // A page nothing claims is still on the host being rendered.
  const others = carrying.length ? carrying : [tenant];

  const languages: Record<string, string> = {};
  for (const other of others) {
    languages[regionLocales[other.code] ?? "en"] = absoluteUrl(other, path);
  }
  languages["x-default"] = absoluteUrl(others[0], path);

  return { canonical: absoluteUrl(tenant, path), languages };
}

/**
 * Everything a page needs for its address, its social card and its region.
 *
 * Spread into a page's `generateMetadata` return so that a new page gets all of
 * it by naming its path once, rather than by remembering five separate fields.
 */
export function pageMetadata({
  tenant,
  path,
  title: passedTitle,
  description: passedDescription,
  image,
  type = "website",
  publishedTime,
  authors,
  regions,
}: {
  tenant: Tenant;
  path: string;
  title: string;
  description: string;
  /** Card image. Absolute, or a site-relative path. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  /** Region codes that carry this page. Omitted means all of them. */
  regions?: readonly string[];
}): Metadata {
  const url = absoluteUrl(tenant, path);
  const brand = tenant.brandName ?? siteConfig.name;

  /*
    The supplied metadata sheet wins over whatever the page passed in.

    Applied here rather than at each call site so a page never has to know
    whether a row exists for it: pages go on stating a sensible title and
    description of their own, and those are what a page without a row keeps.
    That also means filling in more of the sheet is a data change and nothing
    else.
  */
  const supplied = pageMetaFor(tenant.code, path);
  const title = supplied?.title ?? passedTitle;
  const description = supplied?.description ?? passedDescription;

  /*
    A supplied title is a finished title tag: the sheet writes them complete,
    ending in "| athGADLANG", "| Wathiq" or a sub-brand. The layout's title
    template appends the brand to whatever a page returns, which on those would
    produce "… | athGADLANG | athGADLANG". `absolute` opts out of the template,
    which is exactly what a finished title wants. A page with no row keeps the
    template, since its title is a fragment written to be completed by it.
  */
  const titleField = supplied?.title ? { absolute: supplied.title } : title;
  const cardImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(tenant, image)
    : undefined;

  return {
    title: titleField,
    description,
    // Makes every relative URL in this page's metadata resolve against the
    // region's own host rather than against localhost.
    metadataBase: new URL(origin(tenant)),
    alternates: alternatesFor(tenant, path, regions),
    openGraph: {
      type,
      url,
      siteName: brand,
      title,
      description,
      locale: (regionLocales[tenant.code] ?? "en").replace("-", "_"),
      ...(cardImage ? { images: [{ url: cardImage }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors?.length ? { authors } : {}),
    },
    twitter: {
      card: cardImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(cardImage ? { images: [cardImage] } : {}),
    },
  };
}

/**
 * A JSON-LD block.
 *
 * Rendered as a script tag rather than through a component library so the shape
 * of the data stays visible at the call site. The content is our own, built from
 * typed data, so there is nothing here that a crawler could be fed that we did
 * not put in.
 */
export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
      // A literal </script> inside a string would close the tag early.
      /</g,
      "\\u003c",
    ),
  };
}
