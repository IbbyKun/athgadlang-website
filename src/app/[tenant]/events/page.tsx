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
        title="Events Built for Real Impact"
        description="athGADLANG events bring together clients, industry leaders, and our specialists in Assurance, Accounting, Tax, Consulting, and Outsourcing for conversations that go beyond the expected. Every event is a chance to learn, question, and connect."
        image={images.hero.events}
        fullScreen={false}
      />

      {featured ? (
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="Next Event"
              description="Join us for our upcoming event"
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
            {/* "Previous Event", singular, as supplied — though this section
                shows the whole archive rather than only the last one. Flagged
                for the copy owner; the heading is theirs to decide. */}
            <SectionHeading
              title="Previous Event"
              description="Take a look back at our last event"
            />

            {/* The archive is the one events list worth swiping: it only grows,
                and it is the one nobody came to the page to read. */}
            <EventGrid items={past} swipe label="previous event" />
          </div>
        </Section>
      )}

      {/* One action, deliberately. This band carried a second, outline button
          to aG Studio; the single call to action is the intended shape, so do
          not add a cross-link back on the assumption it went missing. The
          navbar and footer both still reach the other sections. */}
      <CtaBand
        title="Have Questions About an Event?"
        description="Whether you'd like more details on an upcoming session or want to discuss how we can support your team, our people are ready to help."
        actions={[{ label: "Get in Touch", href: "/#contact" }]}
      />
    </>
  );
}
