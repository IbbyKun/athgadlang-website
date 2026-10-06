import type { Metadata } from "next";

import { AboutFirmsSection } from "@/components/about/firms-section";
import { AboutListenBand } from "@/components/about/listen-band";
import { AboutNewslettersSection } from "@/components/about/newsletters-section";
import { AboutPillarsSection } from "@/components/about/pillars-section";
import { AboutStorySection } from "@/components/about/story-section";
import { AboutTimelineSection } from "@/components/about/timeline-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { aboutHero } from "@/lib/about";
import { pageMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  return {
    ...pageMetadata({
      tenant: getTenant((await params).tenant),
      path: "/demo/about-us",
      title: "About Us (Design Preview)",
      description:
        "athGADLANG is a network of firms across six markets, offering seven service lines to organizations that have decided ordinary is no longer good enough.",
    }),
    // A preview for the design team, not a page for search: it duplicates
    // what /company-profile will say once signed off, and nothing links here.
    // Same treatment as the admin panel.
    robots: { index: false, follow: false },
  };
}

/**
 * The redesigned About Us page, served at /demo/about-us so the design team
 * can review it on the live domain while /company-profile keeps the current
 * page.
 *
 * Deliberately unlisted: it is in no menu, not in the sitemap or `llms.txt`,
 * and marked noindex above. Once the design is signed off, this body replaces
 * the one in `company-profile/page.tsx` and this route is deleted.
 *
 * It is a network page, not a regional one. The hero names six markets, the
 * story covers the whole firm and the timeline walks every office, so all five
 * regions see the same words. Only the contact block at the foot varies, and
 * it resolves its own address and phone from the tenant.
 */
export default async function DemoAboutPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const tenant = getTenant(code);

  return (
    <>
      <Hero
        eyebrow={aboutHero.eyebrow}
        title={aboutHero.title}
        description={aboutHero.description}
        image={aboutHero.image}
        fullScreen={false}
        size="compact"
      />

      <AboutStorySection />
      <AboutPillarsSection />
      <AboutTimelineSection />
      <AboutFirmsSection />
      <AboutListenBand />
      <AboutNewslettersSection />

      <ContactSection
        tenant={tenant.code}
        title="Contact Us"
        description="Tell us what you need and the right specialist will come back to you, usually within one business day."
      />
    </>
  );
}
