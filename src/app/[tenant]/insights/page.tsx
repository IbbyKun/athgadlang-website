import type { Metadata } from "next";

import { InsightGrid } from "@/components/insights/insight-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { listInsights } from "@/lib/content";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenants";

/**
 * Per region, so each host names itself as canonical and the other four as
 * regional alternates — see src/lib/seo.ts for why that matters on a site
 * served from five domains.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: code } = await params;

  return pageMetadata({
    tenant: getTenant(code),
    path: "/insights",
    title: "Insights",
    description:
      "Regulatory updates, technical guidance and expert analysis on tax, audit, compliance and company formation across the UAE, KSA, Bahrain, the UK and Pakistan.",
    image: images.hero.insights.src,
  });
}

/**
 * Prerendered, then refreshed when the admin panel publishes — the server
 * action invalidates the `insights` cache tag. The interval is a backstop for
 * a revalidation that never arrives, not the primary mechanism.
 */
export const revalidate = 300;

/**
 * The insights index. Same language as the homepage — image hero, ruled
 * section headings, lifting article cards — but laid out to be read rather
 * than pinned: no stacked layers or horizontal carousel to scroll past.
 */
export default async function InsightsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const tenant = getTenant(code);
  const pageSize = 8;
  const insights = await listInsights(tenant.code);

  return (
    <>
      <Hero
        eyebrow="Insights"
        title="Perspectives that keep you ahead of the regulation."
        description="Guidance from the specialists who file, audit and advise on it every day — written for the people who have to act on it."
        image={images.hero.insights}
        fullScreen={false}
      />

      <Section containerSize="wide" className="bg-neutral-50">
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="Latest Insights"
            description="Fresh analysis on the changes shaping business across our regions."
          />

          {/* Only the first page is sent; the rest is fetched when asked for. */}
          <InsightGrid
            items={insights.slice(0, pageSize)}
            total={insights.length}
            region={tenant.code}
            pageSize={pageSize}
          />
        </div>
      </Section>

      {/* The footer's newsletter tier sits directly beneath, so this band
          asks for a conversation rather than an email. */}
      <CtaBand
        title="Need this applied to your business?"
        description="Every article here started as a client question. Bring us yours and the right specialist will walk you through what it means for you."
        actions={[
          { label: "Talk to an Expert", href: "/#contact" },
          { label: "Watch Our Webinars", href: "/webinars", variant: "outline" },
        ]}
      />
    </>
  );
}
