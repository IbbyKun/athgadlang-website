import { FeaturedEventCard } from "@/components/cards/featured-event-card";
import { EventAccordion } from "@/components/events/event-accordion";
import { EventGrid } from "@/components/events/event-grid";
import { MAX_PROMOTED_EVENTS, type EventItem } from "@/lib/events";

/**
 * The next few events, laid out by how many there are. Shared by the
 * homepage's "Upcoming Events" and the events page's "Next Event" block, so
 * the two promote events the same way.
 *
 * One event gets the full-width featured card with its details shown
 * outright. Two or three sit side by side twice over: `EventAccordion`, a
 * row that widens the card under the pointer to reveal its detail, and the
 * plain `EventGrid` of full-detail cards beneath it. Only one is ever
 * visible — `EventAccordion` needs `xl` for the room to widen a card at all,
 * and a pointer that can hover it without touching, so it is gated
 * `xl:can-hover:flex` while the grid takes `xl:can-hover:hidden`. Everything
 * below that — phones, tablets, and touch laptops at any width — gets the
 * grid, whose cards already show every detail inline, no hover required.
 *
 * Both trees are always mounted; only one is ever painted by CSS. That
 * matches how the phone/desktop split already works for a single `EventCard`
 * elsewhere on the site — a `display: none` branch never fetches its lazy
 * `<Image>`, so this does not double the requests.
 */
export function UpcomingEventsGrid({
  items,
  label = "upcoming event",
}: {
  /** Upcoming events, soonest first. */
  items: EventItem[];
  /** Names the grid's swipe row for screen readers, below `xl`. */
  label?: string;
}) {
  const shown = items.slice(0, MAX_PROMOTED_EVENTS);

  if (shown.length === 0) return null;
  if (shown.length === 1) return <FeaturedEventCard event={shown[0]} />;

  return (
    <>
      <EventAccordion items={shown} className="hidden xl:can-hover:flex" />
      <EventGrid
        items={shown}
        columns={3}
        swipe
        label={label}
        className="xl:can-hover:hidden"
      />
    </>
  );
}
