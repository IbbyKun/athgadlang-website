import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { IndustriesSection } from "@/components/sections/industries-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { LeadersSection } from "@/components/sections/leaders-section";
import { NumbersSection } from "@/components/sections/numbers-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WebinarsSection } from "@/components/sections/webinars-section";
import { CircleReveal } from "@/components/ui/circle-reveal";
import { SectionStack, StackLayer } from "@/components/ui/section-stack";
import { images } from "@/lib/images";

export default function Home() {
  return (
    <>
      {/* Stacked: each layer scrolls over the one pinned beneath it. */}
      <SectionStack>
        <StackLayer index={0}>
          <Hero
            eyebrow="Audit · Tax · Advisory"
            title="Clarity in the numbers. Confidence in every decision."
            description="From assurance and tax to resourcing and corporate services, athGADLANG partners with businesses across the UAE, KSA, Bahrain, the UK and Pakistan — bringing difference, differently."
            image={images.hero.home}
            actions={[
              { label: "Explore Our Services", href: "/services" },
              { label: "Talk to an Expert", href: "/contact", variant: "outline" },
            ]}
          />
        </StackLayer>

        <StackLayer index={1}>
          <ServicesSection description="Seven practice areas, one accountable team — built around how your business actually operates." />
        </StackLayer>

        {/* Taller than a screen by design, and its own sticky pane drives the
            horizontal carousel — so this layer scrolls rather than pins. */}
        <StackLayer index={2} pin="never">
          <InsightsSection />
        </StackLayer>

        <StackLayer index={3} pin="roomy">
          <WebinarsSection />
        </StackLayer>

        {/* Closing layer: a pinned layer needs room beneath it inside the
            stack, so the last one can never pin. Leaders takes that slot and
            scrolls over webinars. */}
        <StackLayer index={4} pin="never">
          <LeadersSection />
        </StackLayer>
      </SectionStack>

      {/* The numbers panel opens out of a dot at the centre of industries. */}
      <CircleReveal
        base={<IndustriesSection />}
        reveal={<NumbersSection />}
      />

      {/* Second stack: the closing sections slide over one another too. */}
      <SectionStack>
        <StackLayer index={0}>
          <PortfolioSection />
        </StackLayer>

        <StackLayer index={1} pin="roomy">
          <TestimonialsSection />
        </StackLayer>

        {/* Closing layer — the last one can never pin. */}
        <StackLayer index={2} pin="never">
          <ContactSection />
        </StackLayer>
      </SectionStack>
    </>
  );
}
