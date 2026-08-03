import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { EventAgenda } from "@/components/events/event-agenda";
import { EventGrid } from "@/components/events/event-grid";
import {
  EventKindPill,
  EventStatusPill,
} from "@/components/events/event-meta";
import { EventRegisterPanel } from "@/components/events/event-register-panel";
import { EventSpeakers } from "@/components/events/event-speakers";
import { InsightBody } from "@/components/insights/insight-body";
import { RichBody } from "@/components/insights/rich-body";
import { ShareRow } from "@/components/insights/share-row";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { allEventSlugs, listEvents } from "@/lib/content";
import { getEvent, isUpcoming, otherEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { getTenant } from "@/lib/tenants";

type PageParams = { tenant: string; slug: string };

/**
 * One page per event, prerendered for the slugs that exist at build time.
 *
 * Params it did not generate are allowed: an event published from the admin
 * panel after the last deploy has to work without a rebuild. An unknown slug
 * still 404s, so nothing unrecognised renders.
 */
export async function generateStaticParams() {
  const slugs = await allEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

/** The upcoming/ended state depends on today; see the events index. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { tenant: code, slug } = await params;
  const events = await listEvents(getTenant(code).code);
  const event = getEvent(slug, events);

  if (!event) return {};

  return {
    title: event.title,
    description: event.excerpt,
  };
}

/**
 * One event.
 *
 * Two columns on wide screens: the write-up, running order and presenters on
 * the left, and the panel that says what you can do about it on the right,
 * sticking as the page scrolls. Collapses to one column below `lg`, with the
 * panel first — on a phone, "when is it and can I still get in" comes before
 * the description.
 */
export default async function EventPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { tenant: code, slug } = await params;
  const events = await listEvents(getTenant(code).code);
  const event = getEvent(slug, events);

  if (!event) notFound();

  const upcoming = isUpcoming(event);
  const others = otherEvents(event, events, 4);

  return (
    <>
      <Hero
        eyebrow={upcoming ? "Upcoming event" : "Past event"}
        title={event.title}
        image={event.image}
        fullScreen={false}
      />

      <Section containerSize="wide" className="bg-neutral-50">
        <div className="flex flex-col gap-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-navy transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChevronLeft aria-hidden className="size-4" />
            All Events
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
            {/* Panel first in the DOM, then moved to the right column on wide
                screens: on a phone the date and the register button matter more
                than the write-up, and reading order should say so. */}
            <div className="lg:order-2">
              <EventRegisterPanel event={event} />
            </div>

            <div className="flex flex-col gap-6 lg:order-1">
              <article className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
                <header className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <EventKindPill kind={event.kind} />
                    <EventStatusPill upcoming={upcoming} />
                    <time
                      dateTime={event.date}
                      className="text-sm font-medium text-neutral-500"
                    >
                      {formatEventDate(event.date)}
                    </time>
                  </div>

                  <h2 className="text-balance text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
                    {event.title}
                  </h2>

                  <span aria-hidden className="block h-0.5 w-14 bg-brand" />
                </header>

                {/* Two body formats, as on an article page: rich text from
                    the admin panel, or the block structure the built-in events
                    carry. Both render identically. */}
                {event.richBody ? (
                  <RichBody doc={event.richBody} />
                ) : (
                  <InsightBody blocks={event.body ?? []} />
                )}
              </article>

              {event.agenda && event.agenda.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
                  <EventAgenda
                    items={event.agenda}
                    timezone={event.timezone}
                  />
                </div>
              )}

              {event.speakers.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
                  <EventSpeakers speakers={event.speakers} />
                </div>
              )}

              <ShareRow title={event.title} />
            </div>
          </div>
        </div>
      </Section>

      {others.length > 0 && (
        <Section containerSize="wide" className="bg-white">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="More Events"
              description="What else is on the calendar."
            />

            <EventGrid items={others} />
          </div>
        </Section>
      )}

      <CtaBand
        title="Have a question you want answered live?"
        description="Send it ahead of the session and we will make sure it is covered — or bring it to us directly and skip the wait."
        actions={[
          { label: "Talk to an Expert", href: "/#contact" },
          { label: "Read Our Insights", href: "/insights", variant: "outline" },
        ]}
      />
    </>
  );
}
