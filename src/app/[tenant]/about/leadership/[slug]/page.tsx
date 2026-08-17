import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { LeaderCard } from "@/components/cards/leader-card";
import { LinkedinIcon } from "@/components/icons/social";
import { CtaBand } from "@/components/sections/cta-band";
import { ServiceList } from "@/components/services/service-list";
import { Section, SectionHeading } from "@/components/ui/section";
import {
  getLeader,
  leaderHref,
  leaderSlugs,
  otherLeaders,
  type LeaderProfile,
} from "@/lib/leaders";
import { pageMetadata } from "@/lib/seo";
import { servicesLedBy } from "@/lib/services";
import { getTenant } from "@/lib/tenants";
import { externalLinkProps } from "@/lib/links";
import { cn } from "@/lib/utils";

type PageParams = { params: Promise<{ tenant: string; slug: string }> };

/** One page per leader; unknown slugs 404 rather than render. */
export function generateStaticParams() {
  return leaderSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { tenant, slug } = await params;
  const leader = getLeader(slug);

  if (!leader) return {};

  return pageMetadata({
    tenant: getTenant(tenant),
    path: leaderHref(leader),
    title: `${leader.name}, ${leader.role}`,
    description: leader.bio?.[0] ?? "",
    image: leader.image.src,
  });
}

/**
 * A leader's profile. The navy header carries the portrait, the name and the
 * opening paragraph; the rest of the biography runs beside an at-a-glance panel
 * built from facts the biography itself states. Below that: the pages that name
 * them, and the rest of the team.
 */
export default async function LeaderPage({ params }: PageParams) {
  const { slug } = await params;
  const leader = getLeader(slug);

  if (!leader) notFound();

  const [lead, ...rest] = leader.bio ?? [];
  const practices = servicesLedBy(leader.slug);
  const others = otherLeaders(leader, 4);
  const firstName = leader.name.split(" ")[0];

  return (
    <>
      <Section
        containerSize="wide"
        className="isolate overflow-hidden bg-brand-navy"
      >
        {/* Brand wash, brightest behind the portrait. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_15%_0%,rgba(156,34,38,0.35),transparent_70%)]"
        />

        <div className="flex flex-col gap-10">
          <Link
            href="/#leaders"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronLeft aria-hidden className="size-4" />
            All Leaders
          </Link>

          <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
            {/* Portrait on a brand block, offset so the two read as one mark. */}
            <div className="relative w-full max-w-xs lg:max-w-none">
              <div
                aria-hidden
                className="absolute -bottom-3 -left-3 h-2/3 w-2/3 rounded-2xl bg-brand"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/15">
                <Image
                  src={leader.image.src}
                  alt={leader.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 20rem, 20rem"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {leader.name}
                </h1>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
                  {leader.role}
                </p>
              </div>

              {lead && (
                <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                  {lead}
                </p>
              )}

              {leader.linkedin && (
                <a
                  href={leader.linkedin}
                  {...externalLinkProps}
                  className={cn(
                    "inline-flex items-center gap-2 self-start rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-colors",
                    "hover:bg-white hover:text-[#0A66C2] hover:ring-white",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  )}
                >
                  <LinkedinIcon className="size-4" />
                  {firstName} on LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section containerSize="wide" className="bg-white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div className="flex flex-col gap-8">
            <SectionHeading title="Background" />

            <div className="flex max-w-2xl flex-col gap-5">
              {rest.length > 0 ? (
                rest.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-pretty text-base leading-relaxed text-neutral-600"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-base leading-relaxed text-neutral-600">
                  {lead}
                </p>
              )}
            </div>
          </div>

          {leader.profile && <AtAGlance profile={leader.profile} />}
        </div>
      </Section>

      {practices.length > 0 && (
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col gap-8">
            <SectionHeading
              title={`Where ${firstName} Leads`}
              description="The practices this profile is accountable for."
            />
            <ServiceList services={practices} />
          </div>
        </Section>
      )}

      {others.length > 0 && (
        <Section containerSize="wide" className="bg-white">
          <div className="flex flex-col gap-8">
            <SectionHeading
              title="The Rest of the Team"
              description="We draw on our global network to assemble a team of experts."
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {others.map((other) => (
                <LeaderCard key={other.slug} leader={other} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand
        title={`Work with ${firstName}`}
        description="Bring us the question you are actually stuck on. We will tell you who should own it and what we would do first."
        actions={[
          { label: "Talk to an Expert", href: "/#contact" },
          { label: "Read Our Insights", href: "/insights", variant: "outline" },
        ]}
      />
    </>
  );
}

/** Facts stated in the biography, as a panel beside it. */
function AtAGlance({ profile }: { profile: LeaderProfile }) {
  const rows: { label: string; values: string[] }[] = [
    ...(profile.experience
      ? [{ label: "Experience", values: [profile.experience] }]
      : []),
    ...(profile.qualifications?.length
      ? [{ label: "Qualifications", values: profile.qualifications }]
      : []),
    ...(profile.firms?.length
      ? [{ label: "Previously", values: profile.firms }]
      : []),
    ...(profile.focus?.length
      ? [{ label: "Focus", values: profile.focus }]
      : []),
    ...(profile.industries?.length
      ? [{ label: "Industries", values: profile.industries }]
      : []),
    ...(profile.regions?.length
      ? [{ label: "Markets", values: profile.regions }]
      : []),
  ];

  if (rows.length === 0) return null;

  return (
    <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
      <div className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          At a glance
        </h2>

        <dl className="mt-5 flex flex-col divide-y divide-neutral-200">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-2 py-3.5 first:pt-0">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
                {row.label}
              </dt>
              <dd>
                {/* One line for a single fact; chips for a list. */}
                {row.values.length === 1 ? (
                  <p className="text-sm font-medium leading-relaxed text-brand-navy">
                    {row.values[0]}
                  </p>
                ) : (
                  <ul className="flex flex-wrap gap-1.5">
                    {row.values.map((value) => (
                      <li
                        key={value}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200"
                      >
                        {value}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
