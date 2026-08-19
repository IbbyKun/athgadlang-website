import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PromoPopup } from "@/components/layout/promo-popup";
import { WhatsappButton } from "@/components/layout/whatsapp-button";
import { alternatesFor, origin } from "@/lib/seo";
import { homeDescription, homeTitle, siteConfig } from "@/lib/site-config";
import {
  defaultFavicon,
  getTenant,
  tenantCode,
  tenantCodes,
} from "@/lib/tenants";

/** Prerender every region; anything else 404s rather than rendering on demand. */
export function generateStaticParams() {
  return tenantCodes.map((tenant) => ({ tenant }));
}

/**
 * True, and the region is checked below instead.
 *
 * This was `false`, which reads as "only the five regions exist" and is the
 * right intent. But `dynamicParams` on a layout governs everything beneath it,
 * not just its own segment: with it off, no descendant could render a param
 * combination that was not generated at build time — so an article's page
 * refused to render until the next deploy, whatever `dynamicParams = true` on
 * that page said, and whatever the caches held.
 *
 * That is what kept three Pakistan articles 404ing on 10 August 2026 while they
 * appeared correctly in the listing. It looked like a caching problem and was
 * chased as one: the route pattern, the literal path and a layout-wide purge were
 * all tried and none worked, because the page component was never reached. Only
 * a rebuild fixed it, which is exactly what "params must have been generated"
 * means.
 *
 * The intent survives without it. An unknown region 404s explicitly a few lines
 * down — clearer than inferring it from a segment config, and it no longer takes
 * every new article down with it.
 */
export const dynamicParams = true;

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: code } = await params;
  const tenant = getTenant(code);
  const brand = tenant.brandName ?? siteConfig.name;
  const favicon = tenant.favicon ?? defaultFavicon;

  return {
    title: {
      // Names the practice and the country: this is the homepage's one chance
      // to say what the firm does, and the tagline did not. Inner pages set
      // their own titles and only borrow the brand from the template.
      default: homeTitle(brand, tenant.inRegion),
      template: `%s | ${brand}`,
    },
    description: homeDescription(brand, tenant.inRegion),
    /*
      Every relative URL in any page's metadata resolves against this, so it has
      to be the region's own host: without it Next warns and falls back to
      localhost, which would ship broken social cards to production.
    */
    metadataBase: new URL(origin(tenant)),
    // Inherited by pages that do not set their own, and correct for the
    // homepage, which is the one page with no metadata of its own.
    alternates: alternatesFor(tenant, "/"),
    openGraph: {
      type: "website",
      siteName: brand,
      /*
        The tagline stays here. A social card is shown to someone who has been
        sent the link and already knows roughly what they are opening, so brand
        reads better than a keyword line — and unlike a search result, its
        length is not what decides whether the text is truncated.
      */
      title: `${brand} - ${siteConfig.tagline}`,
      description: homeDescription(brand, tenant.inRegion),
    },
    icons: {
      icon: [{ url: favicon.svg, type: "image/svg+xml" }],
      apple: [{ url: favicon.apple, sizes: "180x180" }],
    },
  };
}

/**
 * Chrome for a single region. The tenant is threaded down as a prop rather
 * than read from a global: with static prerendering there is no request
 * context to read from, and the value differs per prerendered route.
 */
export default async function TenantLayout({ children, params }: LayoutProps) {
  const { tenant: code } = await params;

  // The five regions and nothing else. `getTenant` falls back to the primary
  // one for anything it does not recognise, which is right for a cookie or a
  // hostname but wrong here: it would quietly serve the UAE site at /xyz/.
  //
  // In practice unreachable — proxy.ts prefixes every request with a code it
  // chose itself — but this is the segment that decides what a region is, so it
  // is the segment that should say so.
  //
  // `tenantCode` rather than a list membership test: it narrows the string to a
  // TenantCode, so the check and the type agree instead of needing a cast to
  // paper over the gap.
  if (!tenantCode(code)) notFound();

  const tenant = getTenant(code);

  return (
    <>
      {/*
        A region with its own colours restates the brand tokens for its pages.

        On :root rather than on a wrapper, because not everything that reads
        them is inside this layout — the body background and the fixed WhatsApp
        button among them — and because a wrapper would add a div to every page
        purely to hold three custom properties.

        Regions without a palette emit nothing and inherit athGADLANG's, which
        is the point: these are one region's colours, not the group's.
      */}
      {tenant.palette && (
        <style>{`:root{--brand:${tenant.palette.brand};--brand-hover:${tenant.palette.brandHover};--brand-navy:${tenant.palette.brandNavy};}`}</style>
      )}

      {/* Target for the footer's "Top" link. It has to sit above the header in
          the document flow: the header itself is sticky, so it is never out of
          view and a fragment link to it would have nothing to scroll. Smooth
          scrolling comes from `scroll-smooth` on <html>. */}
      <div id="top" aria-hidden />

      <SiteHeader tenant={tenant} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter tenant={tenant} />
      <WhatsappButton />

      {/* Renders nothing until it has asked whether there is a popup to show,
          which keeps this layout — and so every page under it — free of
          anything that would need reprerendering to change. */}
      <PromoPopup />
    </>
  );
}
