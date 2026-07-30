import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site-config";
import { getTenant, tenantCodes } from "@/lib/tenants";

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

  return {
    title: {
      default: `${brand} ${tenant.label} — ${siteConfig.tagline}`,
      template: `%s | ${brand}`,
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
      <SiteHeader tenant={tenant} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter tenant={tenant} />
    </>
  );
}
