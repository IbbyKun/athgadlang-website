import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsappButton } from "@/components/layout/whatsapp-button";
import { alternatesFor, origin } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { defaultFavicon, getTenant, tenantCodes } from "@/lib/tenants";

/** Prerender every region; anything else 404s rather than rendering on demand. */
export function generateStaticParams() {
  return tenantCodes.map((tenant) => ({ tenant }));
}

export const dynamicParams = false;

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
      default: `${brand} - ${siteConfig.tagline}`,
      template: `%s | ${brand}`,
    },
    description: siteConfig.description,
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
      title: `${brand} - ${siteConfig.tagline}`,
      description: siteConfig.description,
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
  const tenant = getTenant(code);


  return (
    <>
      {/* Target for the footer's "Top" link. It has to sit above the header in
          the document flow: the header itself is sticky, so it is never out of
          view and a fragment link to it would have nothing to scroll. Smooth
          scrolling comes from `scroll-smooth` on <html>. */}
      <div id="top" aria-hidden />

      <SiteHeader tenant={tenant} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter tenant={tenant} />
      <WhatsappButton />
    </>
  );
}
