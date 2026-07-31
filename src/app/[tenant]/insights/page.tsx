import type { Metadata } from "next";

import { InsightGrid } from "@/components/insights/insight-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { images } from "@/lib/images";
import { insights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Regulatory updates, technical guidance and expert analysis on tax, audit, compliance and company formation across the UAE, KSA, Bahrain, the UK and Pakistan.",
};

/**
 * The insights index. Same language as the homepage — image hero, ruled
 * section headings, lifting article cards — but laid out to be read rather
 * than pinned: no stacked layers or horizontal carousel to scroll past.
 */
export default function InsightsPage() {
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

          <InsightGrid items={insights} />
        </div>
      </Section>

      {/* The footer's newsletter tier sits directly beneath, so this band
          asks for a conversation rather than an email. */}
      <CtaBand
        title="Need this applied to your business?"
        description="Every article here started as a client question. Bring us yours and the right specialist will walk you through what it means for you."
        actions={[
          { label: "Talk to an Expert", href: "/contact" },
          { label: "Watch Our Webinars", href: "/webinars", variant: "outline" },
        ]}
      />
    </>
  );
}
