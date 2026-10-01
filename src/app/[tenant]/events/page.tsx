import type { Metadata } from "next";

import { EventGrid } from "@/components/events/event-grid";
import { UpcomingEventsGrid } from "@/components/events/upcoming-events-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { listEvents } from "@/lib/content";
import { splitEvents, splitUpcomingByHorizon } from "@/lib/events";
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
  const { upcoming, past } = splitEvents(events);
  // The next event, plus any others within 10 days — see the helper's own
  // comment for why the soonest is always promoted even when it is alone.
  const { promoted, rest } = splitUpcomingByHorizon(upcoming);

  return (
    <>
      <Hero
        eyebrow="Events"
        title="Events Built for Real Impact"
        description="athGADLANG events bring together clients, industry leaders, and our specialists in Assurance, Accounting, Tax, Consulting, and Outsourcing for conversations that go beyond the expected. Every event is a chance to learn, question, and connect."
        image={images.hero.events}
        fullScreen={false}
      />

      {promoted.length > 0 ? (
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title={promoted.length > 1 ? "Next Events" : "Next Event"}
              description="Join us for our upcoming event"
            />

            <UpcomingEventsGrid items={promoted} label="next event" />
          </div>
        </Section>
      ) : past.length === 0 ? (
        /* Only when the region has no events at all. With nothing upcoming
           but an archive to show, the page goes straight to previous events:
           an apology above a full shelf of past sessions reads as a gap, not
           as a real state. Without either, it would run from the hero to the
           contact band with nothing between, so it says so instead. */
        <Section containerSize="wide" className="bg-neutral-50">
          <div className="flex flex-col items-center gap-4 text-center">
            <SectionHeading
              title="Nothing Scheduled Yet"
              description="The next round of sessions is being planned. In the meantime, our recorded webinars and written guidance cover the same ground."
            />
          </div>
        </Section>
      ) : null}

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
            {/* Plural: the section shows the whole archive, not only the last
                event. */}
            <SectionHeading
              title="Previous Events"
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
