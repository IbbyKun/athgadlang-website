import { FeaturedEventCard } from "@/components/cards/featured-event-card";
import { EventFlipGrid } from "@/components/events/event-flip-grid";
import { EventGrid } from "@/components/events/event-grid";
import { MAX_PROMOTED_EVENTS, type EventItem } from "@/lib/events";

/**
 * The homepage's next few events, laid out by how many there are.
 *
 * One event gets the full-width featured card with its details shown
 * outright. Two or three sit side by side twice over: `EventFlipGrid`, a
 * row of cards that flip over under the pointer to reveal their detail, and
 * the plain `EventGrid` of full-detail cards beneath it. Only one is ever
 * visible — `EventFlipGrid` needs `xl` for cards wide enough to hold the
 * detail, and a pointer that can hover it without touching, so it is gated
 * `xl:can-hover:flex` while the plain grid takes `xl:can-hover:hidden`.
 * Everything below that — phones, tablets, and touch laptops at any width —
 * gets the plain grid, whose cards already show every detail inline, no hover
 * required. The events page's "Also Coming Up" makes the same split.
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
      <EventFlipGrid
        items={shown}
        columns={shown.length === 2 ? 2 : 3}
        className="hidden xl:can-hover:flex"
      />
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
