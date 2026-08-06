import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { ServiceList } from "@/components/services/service-list";
import { Section, SectionHeading } from "@/components/ui/section";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { serviceCategories } from "@/lib/services";
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
    path: "/services",
    title: "Services",
    description:
      "Assurance, accounting, tax, resourcing, consulting, corporate services and asset management from athGADLANG, across the UAE, KSA, Bahrain, the UK and Pakistan.",
    image: images.hero.home.src,
  });
}

/**
 * The services index, reached from the footer.
 *
 * Deliberately simple: one block per practice area, each listing every service
 * inside it. That puts the whole tree one click — and one crawl — from a single
 * page, which is what makes it worth having.
 */
export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="Services"
        title="Every practice area, one accountable team."
        description="Assurance, accounting, tax, resourcing, consulting, corporate services and asset management — built around how your business actually operates, not around our org chart."
        image={images.hero.services}
        fullScreen={false}
        actions={[{ label: "Talk to an Expert", href: "/#contact" }]}
      />

      {serviceCategories.map((category, index) => (
        <Section
          key={category.href}
          containerSize="wide"
          // Alternating grounds keep a long single-column page readable.
          className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <SectionHeading
                as="h2"
                title={category.label}
                description={category.description}
                className="max-w-2xl"
              />

              <Link
                href={category.href}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {category.label} overview
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            </div>

            <ServiceList services={category.items ?? []} />
          </div>
        </Section>
      ))}

      <CtaBand
        title="Not sure which of these you need?"
        description="Most engagements start as a single question. Ask it, and we will tell you which team should own it — or whether you need us at all."
        actions={[
          { label: "Talk to an Expert", href: "/#contact" },
          { label: "Read Our Insights", href: "/insights", variant: "outline" },
        ]}
      />
    </>
  );
}
