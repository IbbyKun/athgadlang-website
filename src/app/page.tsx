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
import { images } from "@/lib/images";

export default function Home() {
  return (
    <>
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

      <ServicesSection description="Seven practice areas, one accountable team — built around how your business actually operates." />

      <InsightsSection />

      <WebinarsSection />

      <LeadersSection />

      <IndustriesSection />

      <NumbersSection />

      <PortfolioSection />

      <TestimonialsSection />

      <ContactSection />
    </>
  );
}
