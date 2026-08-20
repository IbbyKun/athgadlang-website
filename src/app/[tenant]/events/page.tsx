import type { Metadata } from "next";

import { FeaturedEventCard } from "@/components/cards/featured-event-card";
import { EventGrid } from "@/components/events/event-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { listEvents } from "@/lib/content";
import { splitEvents } from "@/lib/events";
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
    path: "/events",
    title: "Events",
    description:
      "Live webinars and in-person seminars on tax, audit, compliance and business setup across the UAE, KSA, Bahrain, the UK and Pakistan, hosted by the athGADLANG specialists who advise on them day to day.",
    image: images.hero.events.src,
  });
}

/**
 * Whether an event is upcoming depends on today's date, so this page cannot be
 * prerendered once and left. An hour is fine: nothing here changes within one,
 * and it means the split moves on its own without a deploy.
 */
export const revalidate = 86400;

/**
 * The events page: what is next, what else is coming, and what has already
 * run.
 *
 * Deliberately three shelves rather than one long list. An events list answers
 * two different questions — "what can I attend?" and "what did I miss?" — and
 * mixing them makes both harder to read.
 */
export default async function EventsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const events = await listEvents(getTenant(code).code);
  const { featured, rest, past } = splitEvents(events);

  return (
    <>
      <Hero
        eyebrow="Events"
        title="Come and ask the questions in person."
        description="Live sessions and working clinics on the changes that affect how you file, report and operate, small enough that you get an answer, not a slide."
        image={images.hero.events}
        fullScreen={false}
      />

      {featured ? (
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="Next Up"
              description="The next session on the calendar."
            />

            <FeaturedEventCard event={featured} />
          </div>
        </Section>
      ) : (
        /* Nothing scheduled is a real state, not a broken page — say so, and
           point at the two things that are always available. */
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col items-center gap-4 text-center">
            <SectionHeading
              title="Nothing Scheduled Yet"
              description="The next round of sessions is being planned. In the meantime, our recorded webinars and written guidance cover the same ground."
            />
          </div>
        </Section>
      )}

      {rest.length > 0 && (
        <Section containerSize="wide" className="bg-white">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="Also Coming Up"
              description="Further ahead in the calendar, register early where seats are limited."
            />

            <EventGrid items={rest} />
          </div>
        </Section>
      )}

      {past.length > 0 && (
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="Previous Events"
              description="Sessions that have already run. Where a recording exists, it is on the event's page."
            />

            {/* The archive is the one events list worth swiping: it only grows,
                and it is the one nobody came to the page to read. */}
            <EventGrid items={past} swipe label="previous event" />
          </div>
        </Section>
      )}

      <CtaBand
        title="Want a session for your own team?"
        description="We run these privately too, shaped around your industry, your systems and the questions your finance team is actually asking."
        actions={[
          { label: "Request a Session", href: "/#contact" },
          { label: "Watch aG Studio", href: "/webinars", variant: "outline" },
        ]}
      />
    </>
  );
}
