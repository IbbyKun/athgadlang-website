import { FeaturedEventCard } from "@/components/cards/featured-event-card";
import { ViewMoreButton } from "@/components/ui/view-more-button";
import { Section, SectionHeading } from "@/components/ui/section";
import type { EventItem } from "@/lib/events";

/**
 * The next event, on the homepage.
 *
 * Sits above insights on purpose: an article keeps, an event does not, so the
 * thing with a date on it is offered first.
 *
 * Exactly one card. The homepage is a summary, and the next session is the only
 * one a visitor can act on right now — the rest of the calendar, and the
 * archive, are on /events behind the button below.
 *
 * Renders nothing when there is nothing upcoming, and the homepage drops the
 * whole layer in that case. An events section showing only past events invites
 * the reader to conclude the firm has stopped running them, which is worse than
 * having no section at all.
 */
export function EventsSection({
  items,
  title = "Upcoming Event",
  description = "Live webinars and in-person sessions, hosted by the specialists who do the work.",
}: {
  /** Upcoming events, soonest first. Only the first is shown. */
  items: EventItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
}) {
  const [next] = items;

  if (!next) return null;

  return (
    <Section id="events" containerSize="wide" className="bg-neutral-50">
      <div className="flex flex-col gap-10">
        <SectionHeading title={title} description={description} />

        <FeaturedEventCard event={next} />

        <div className="flex justify-center">
          <ViewMoreButton href="/events">All Events</ViewMoreButton>
        </div>
      </div>
    </Section>
  );
}
