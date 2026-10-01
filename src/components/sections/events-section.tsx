import { ViewMoreButton } from "@/components/ui/view-more-button";
import { Section, SectionHeading } from "@/components/ui/section";
import { UpcomingEventsGrid } from "@/components/events/upcoming-events-grid";
import type { EventItem } from "@/lib/events";

/**
 * The next events, on the homepage.
 *
 * Sits above insights on purpose: an article keeps, an event does not, so the
 * thing with a date on it is offered first.
 *
 * One event gets the full-width featured card. Two or three sit side by side,
 * widening under the pointer to reveal their detail on a device that can
 * hover, or as a plain grid everywhere else — see `UpcomingEventsGrid`. The
 * homepage does no date filtering of its own: it is just the next events,
 * soonest first, however many of them there are, capped at three.
 *
 * Renders nothing when there is nothing upcoming, and the homepage drops the
 * whole layer in that case. An events section showing only past events invites
 * the reader to conclude the firm has stopped running them, which is worse than
 * having no section at all.
 */
export function EventsSection({
  items,
  title,
  description = "Live webinars and in-person sessions, hosted by the specialists who do the work.",
}: {
  /** Upcoming events, soonest first. */
  items: EventItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
}) {
  if (items.length === 0) return null;

  const heading =
    title ?? (items.length > 1 ? "Upcoming Events" : "Upcoming Event");

  return (
    <Section id="events" containerSize="wide" className="bg-neutral-50">
      <div className="flex flex-col gap-10">
        <SectionHeading title={heading} description={description} />

        <UpcomingEventsGrid items={items} label="upcoming event" />

        <div className="flex justify-center">
          <ViewMoreButton href="/events">All Events</ViewMoreButton>
        </div>
      </div>
    </Section>
  );
}
