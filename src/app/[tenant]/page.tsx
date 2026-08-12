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
import { listEvents, listInsights, listWebinars } from "@/lib/content";
import { splitEvents } from "@/lib/events";
import { brand, images } from "@/lib/images";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { contactFor, homeDescription, siteConfig } from "@/lib/site-config";
import { getTenant, tenantUrl, tenants } from "@/lib/tenants";

/** Refreshed when the admin panel publishes; see the insights index. */
export const revalidate = 86400;

export default async function Home({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const tenant = getTenant(code);
  const contact = contactFor(tenant.code);

  const [insights, webinars, events] = await Promise.all([
    listInsights(tenant.code),
    listWebinars(tenant.code),
    listEvents(tenant.code),
  ]);

  const { upcoming: upcomingEvents } = splitEvents(events);

  return (
    <>
      {/*
        Organization and WebSite, once, on the homepage. These are what let a
        search engine show a knowledge panel — the firm's name, logo, contact
        details and regional sites — instead of guessing from page text. The
        `sameAs` list is what ties the five regional hosts to one organisation.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "ProfessionalService",
          "@id": absoluteUrl(tenant, "/#organization"),
          name: tenant.brandName ?? siteConfig.name,
          // The same sentence the meta description carries, so the structured
          // data and the snippet do not describe the firm two different ways.
          description: homeDescription(
            tenant.brandName ?? siteConfig.name,
            tenant.inRegion,
          ),
          url: absoluteUrl(tenant, "/"),
          logo: absoluteUrl(tenant, brand.logo.src),
          image: absoluteUrl(tenant, images.hero.home.src),
          email: contact.email,
          telephone: contact.phone,
          // The office serving this region, not a single group address: each
          // regional site describes the practice a reader can actually walk into.
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address,
            addressLocality: contact.office.city,
            addressCountry: contact.office.countryCode,
          },
          openingHours: contact.openHours,
          areaServed: tenants.map((other) => ({
            "@type": "Country",
            name: other.label,
          })),
          sameAs: tenants
            .filter((other) => other.code !== tenant.code)
            .map((other) => tenantUrl(other)),
        })}
      />

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

      <ServicesSection description="Seven practice areas, one accountable team — built around how your business actually operates." />

      {/* Above insights on purpose: an article keeps, an event does not. */}
      {upcomingEvents.length > 0 && <EventsSection items={upcomingEvents} />}

      <InsightsSection items={insights} />

      <WebinarsSection items={webinars} />

      <LeadersSection />

      <IndustriesSection />

      <NumbersSection />

      <PortfolioSection />

      <TestimonialsSection />

      <ContactSection tenant={tenant.code} />
    </>
  );
}
