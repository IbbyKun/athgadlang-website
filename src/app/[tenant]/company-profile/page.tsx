import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Globe2,
  Handshake,
  ShieldCheck,
  Target,
} from "lucide-react";

import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { LeadersSection } from "@/components/sections/leaders-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsGrid } from "@/components/stats/stats-grid";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { aboutImages } from "@/lib/images";
import { offices } from "@/lib/offices";
import { companyProfilePdf, siteConfig } from "@/lib/site-config";
import { stats } from "@/lib/stats";
import { pageMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenants";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  return pageMetadata({
    tenant: getTenant((await params).tenant),
    path: "/company-profile",
    title: "About Us",
    description:
      "athGADLANG helps businesses navigate complexity with confidence: tax strategy, consulting, assurance and accounting across the UAE, KSA, Bahrain, the UK and Pakistan.",
  });
}

/**
 * About us — the page behind the header's Company Profile button.
 *
 * The supplied copy is the opening section; everything after it is composed
 * from data the site already holds (figures, practice areas, leadership, the
 * office network) rather than new prose, so it stays true as those change.
 */
export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const tenant = getTenant(code);
  // KSA trades as Wathiq and Pakistan as aG Resources, so the prose has to name
  // the region's own brand rather than the group's.
  const brand = tenant.brandName ?? siteConfig.name;

  return (
    <>
      <Hero
        eyebrow="About Us"
        title="A partner for the decisions that carry weight."
        description="Decades of collective experience across audit, tax, accounting and advisory, put to work on the numbers your business is judged by."
        image={aboutImages.team}
        fullScreen={false}
        actions={[{ label: "Talk to an Expert", href: "/#contact" }]}
      />

      <Section containerSize="wide" className="bg-white">
        <div className="flex flex-col gap-14">
          {/* Copy on the left, a photo pair on the right. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-6">
              <SectionHeading title="About Us" />

              <div className="flex max-w-2xl flex-col gap-5 text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
                <p>
                  With decades of collective experience, {brand} helps
                  businesses navigate complexities and challenges with
                  confidence. From tax strategy and consulting to assurance and
                  accounting solutions, our expertise drives growth and
                  stability.
                </p>
                <p>
                  Our team is committed to accuracy, compliance, and strategic
                  insights, as we empower you to make smarter financial
                  decisions. By combining industry knowledge with a
                  client-centric approach, we personalize solutions that align
                  with your goals.
                </p>
                <p>
                  Whether you&rsquo;re looking to optimize your financial
                  structure, strengthen compliance, or drive sustainable growth,
                  we are your trusted partner in building a stronger and more
                  successful future.
                </p>
              </div>
            </div>

            {/* Offset pair, so the block reads as photography rather than a
                grid of thumbnails. */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Photo
                image={aboutImages.workshop}
                className="col-span-2 aspect-[16/10]"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <Photo
                image={aboutImages.office}
                className="aspect-[4/5] lg:translate-y-6"
                sizes="(min-width: 1024px) 20vw, 45vw"
              />
              <Photo
                image={aboutImages.team}
                className="aspect-[4/5]"
                sizes="(min-width: 1024px) 20vw, 45vw"
              />
            </div>
          </div>

          <Values />
        </div>
      </Section>

      {/* The figures panel, on the brand red card it uses on the homepage. */}
      <Section containerSize="wide" className="bg-neutral-50">
        <div className="flex flex-col gap-10 rounded-[2rem] bg-brand px-6 py-14 sm:rounded-[2.5rem] sm:px-10 lg:px-16">
          <h2 className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
            {brand} in Numbers
          </h2>
          <StatsGrid stats={stats} />
        </div>
      </Section>

      <ServicesSection
        tenant={tenant.code}
        title="What We Do"
        description="Five practice areas, one accountable team, built around how your business actually operates."
        fullScreen={false}
      />

      <Offices />

      <LeadersSection
        title="Our Leaders"
        description="The partners and directors accountable for the work, across every region we operate in."
        fullScreen={false}
      />

      {/* Download sits at the foot of the page, just above contact. */}
      <Section className="bg-brand-navy">
        <div className="flex flex-col items-center gap-7 text-center">
          <SectionHeading
            tone="inverted"
            title="Company Profile"
            description="Everything above, plus our full credentials, sector experience and methodology, in one document you can share internally."
          />

          <Button
            asChild
            size="lg"
            className="bg-white text-brand-navy hover:bg-white/90"
          >
            <a href={companyProfilePdf} download>
              <Download className="size-4 text-brand" />
              Download Company Profile
            </a>
          </Button>
        </div>
      </Section>

      <ContactSection
        tenant={tenant.code}
        title="Contact Us"
        description="Tell us what you need and the right specialist will come back to you, usually within one business day."
      />
    </>
  );
}

function Photo({
  image,
  className,
  sizes,
}: {
  image: { src: string; alt: string };
  className?: string;
  sizes: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

const values = [
  {
    icon: ShieldCheck,
    title: "Accuracy first",
    description:
      "Every number we sign off has been checked by someone whose name is also on it. Nothing leaves the firm on trust alone.",
  },
  {
    icon: Handshake,
    title: "One accountable team",
    description:
      "You deal with the people doing the work, not an account manager relaying questions. The partner on your engagement stays on it.",
  },
  {
    icon: Target,
    title: "Advice you can act on",
    description:
      "A report that only describes the problem is half a job. We say what we would do next, and what it will cost you to do it.",
  },
  {
    icon: Globe2,
    title: "Regional depth",
    description:
      "The UAE, KSA, Bahrain, the UK and Pakistan, one team that knows how the same transaction is treated in each of them.",
  },
];

/** How the firm works, as four short commitments. */
function Values() {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="flex items-center gap-4 text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
        <span aria-hidden className="h-0.5 w-7 bg-brand" />
        How We Work
      </h2>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {values.map((value) => (
          <li
            key={value.title}
            className={cn(
              "flex flex-col gap-3 rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200 transition duration-300",
              "hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-brand",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            <span
              aria-hidden
              className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand"
            >
              <value.icon className="size-5" />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-brand-navy">
              {value.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              {value.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The office network, drawn from the same data as the footer and the map. */
function Offices() {
  return (
    <Section containerSize="wide" className="bg-white">
      <div className="flex flex-col gap-8">
        <SectionHeading
          title="Where We Are"
          description="Five countries, one firm, the same standards and the same people wherever your entities sit."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {offices.map((office) => (
            <li
              key={office.slug}
              className="flex flex-col gap-2 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200"
            >
              {/* Five equal cards — the site does not name a head office. */}
              <p className="text-base font-bold tracking-tight text-brand-navy">
                {office.country}
              </p>
              <p className="text-sm leading-relaxed text-neutral-600">
                {office.city}
              </p>
            </li>
          ))}
        </ul>

        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-brand transition-colors hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          See the offices on the map
          <ChevronRight aria-hidden className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
