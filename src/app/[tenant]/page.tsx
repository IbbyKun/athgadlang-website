import { ContactSection } from "@/components/sections/contact-section";
import { EventsSection } from "@/components/sections/events-section";
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
import { listEvents, listInsights, listWebinars } from "@/lib/content";
import { splitEvents } from "@/lib/events";
import { images } from "@/lib/images";
import { getTenant } from "@/lib/tenants";

/** Refreshed when the admin panel publishes; see the insights index. */
export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const tenant = getTenant(code).code;

  const [insights, webinars, events] = await Promise.all([
    listInsights(tenant),
    listWebinars(tenant),
    listEvents(tenant),
  ]);

  const { upcoming: upcomingEvents } = splitEvents(events);

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
              { label: "Talk to an Expert", href: "/#contact", variant: "outline" },
            ]}
          />
        </StackLayer>

        <StackLayer index={1}>
          <ServicesSection description="Seven practice areas, one accountable team — built around how your business actually operates." />
        </StackLayer>

        {/* Above insights on purpose: an article keeps, an event does not.
            The layer itself is conditional rather than left to collapse: every
            layer past the first draws an overlap shadow, and an empty one would
            paint that shadow as a stray line across the section below. The
            z-index gap it leaves behind is harmless — they only have to
            increase. */}
        {upcomingEvents.length > 0 && (
          <StackLayer index={2} pin="never">
            <EventsSection items={upcomingEvents} />
          </StackLayer>
        )}

        {/* Taller than a screen by design, and its own sticky pane drives the
            horizontal carousel — so this layer scrolls rather than pins. */}
        <StackLayer index={3} pin="never">
          <InsightsSection items={insights} />
        </StackLayer>

        <StackLayer index={4} pin="roomy">
          <WebinarsSection items={webinars} />
        </StackLayer>

        {/* Closing layer: a pinned layer needs room beneath it inside the
            stack, so the last one can never pin. Leaders takes that slot and
            scrolls over webinars. */}
        <StackLayer index={5} pin="never">
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
