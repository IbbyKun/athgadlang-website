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
import { freshEvent, listEvents, withEventBody } from "@/lib/content";
import { eventHref, getEvent, isUpcoming, otherEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getTenant, tenantCode } from "@/lib/tenants";

type PageParams = { tenant: string; slug: string };

/**
 * One page per event, prerendered for the slugs that exist at build time.
 *
 * Params it did not generate are allowed: an event published from the admin
 * panel after the last deploy has to work without a rebuild. An unknown slug
 * still 404s, so nothing unrecognised renders.
 */
export async function generateStaticParams({
  params: { tenant },
}: {
  params: { tenant: string };
}) {
  // Per region, for the same reason as the insight page: Next runs this once per
  // tenant and hands it in, so returning every slug regardless would prerender
  // each event in four regions that will only 404 on it.
  const code = tenantCode(tenant);
  if (!code) return [];

  const events = await listEvents(code);
  return events.map((event) => ({ slug: event.slug }));
}

export const dynamicParams = true;

/** The upcoming/ended state depends on today; see the events index. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { tenant: code, slug } = await params;
  const events = await listEvents(getTenant(code).code);
  const event =
    getEvent(slug, events) ?? (await freshEvent(slug, getTenant(code).code));

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

  // Same fallback as the insight page, for the same race.
  const found =
    getEvent(slug, events) ?? (await freshEvent(slug, getTenant(code).code));

  if (!found) notFound();

  // The listing carries no bodies; this is the one read that fetches one.
  const event = await withEventBody(found);

  const upcoming = isUpcoming(event);
  const others = otherEvents(event, events, 4);

  const tenant = getTenant(code);
  const url = absoluteUrl(tenant, eventHref(event));

  /*
    Registration links are free text and some are still placeholders — the
    built-in events carry "#" until a form exists. Structured data must not
    repeat that: "#" is not a URL, and a crawler offered one rejects the whole
    block rather than the field.
  */
  const registerUrl = /^https?:\/\//.test(event.registerUrl ?? "")
    ? event.registerUrl
    : undefined;

  /*
    Price is free text — "AED 500", "Complimentary" — because that is what an
    invitation says. Structured data wants a number and a currency, so they are
    read off the text only when it is unambiguous, and left out otherwise.
    An event with no price is free, which is expressible exactly.
  */
  const priced = /([A-Z]{3})\s*([\d,]+(?:\.\d+)?)/.exec(event.price ?? "");
  const offerPrice = event.price
    ? priced
      ? { price: priced[2].replace(/,/g, ""), priceCurrency: priced[1] }
      : {}
    : { price: "0", priceCurrency: "AED" };

  return (
    <>
      {/*
        Event structured data — what puts the date, the place and whether it is
        free directly in a search result instead of a bare link.

        `startDate` is the day only, with no time. The stored time is the string an
        invitation states ("12:00 – 13:00 GST"), which cannot be turned into an
        exact instant without parsing prose and guessing at daylight saving. A
        date-only startDate is valid and honest; a wrong timestamp would not be.

        An online event's "location" is a VirtualLocation with the registration
        page as its URL, which is what Google expects for one — a Place with no
        address would be rejected.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "Event",
          name: event.title,
          description: event.excerpt,
          startDate: event.date,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode:
            event.mode === "online"
              ? "https://schema.org/OnlineEventAttendanceMode"
              : "https://schema.org/OfflineEventAttendanceMode",
          location:
            event.mode === "online"
              ? {
                  "@type": "VirtualLocation",
                  // The page itself when there is nowhere else to point.
                  url: registerUrl ?? url,
                }
              : {
                  "@type": "Place",
                  name: event.venue ?? "Venue to be announced",
                  address: event.venue ?? "",
                },
          image: [absoluteUrl(tenant, event.image.src)],
          url,
          organizer: {
            "@type": "Organization",
            name: tenant.brandName ?? siteConfig.name,
            url: absoluteUrl(tenant, "/"),
          },
          // Only claimed when registration is actually open somewhere.
          ...(registerUrl
            ? {
                offers: {
                  "@type": "Offer",
                  url: registerUrl,
                  ...offerPrice,
                  availability: upcoming
                    ? "https://schema.org/InStock"
                    : "https://schema.org/SoldOut",
                },
              }
            : {}),
          ...(event.speakers?.length
            ? {
                performer: event.speakers.map((speaker) => ({
                  "@type": "Person",
                  name: speaker.name,
                })),
              }
            : {}),
        })}
      />
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

                {/*
                  The summary, which until now the page had nowhere to show —
                  it fed the meta description and the structured data and was
                  invisible to the reader who actually opened the page.

                  It matters more since the write-up became optional: an event
                  announced on its date and venue alone would otherwise show a
                  title and then nothing. Set as a standfirst, so it reads as
                  the opening line whether or not a body follows it.
                */}
                {event.excerpt && (
                  <p className="text-pretty text-base leading-relaxed text-neutral-700 sm:text-lg">
                    {event.excerpt}
                  </p>
                )}

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
        description="Send it ahead of the session and we will make sure it is covered, or bring it to us directly and skip the wait."
        actions={[
          { label: "Talk to an Expert", href: "/#contact" },
          { label: "Read Our Insights", href: "/insights", variant: "outline" },
        ]}
      />
    </>
  );
}
