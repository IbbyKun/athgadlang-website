import { Fragment } from "react";

import { EventCard } from "@/components/cards/event-card";
import { EventHoverCard } from "@/components/cards/event-hover-card";
import { FeaturedEventCard } from "@/components/cards/featured-event-card";
import { SwipeRow } from "@/components/ui/swipe-row";
import { MAX_PROMOTED_EVENTS, type EventItem } from "@/lib/events";
import { cn } from "@/lib/utils";

/** Most cards shown side by side before the row swipes for the remainder. */
const MAX_ACROSS = 3;

/**
 * The next few events, laid out by how many there are. Shared by the
 * homepage's "Upcoming Events" and the events page's "Next Event" block, so
 * the two promote events the same way.
 *
 * One event gets the full-width featured card with its details shown
 * outright — nothing to hover there. Two or three sit side by side as
 * banner-led cards whose details live behind a hover popover (see
 * `EventHoverCard`). Four to six keep the same three-across row and swipe
 * for the rest, capped at six so the row cannot grow without bound.
 *
 * Below `sm`, where there is no hover to reveal a popover on, this drops to
 * the plain house swipe row of full-detail `EventCard`s instead — one event
 * a screen, same as the archive. Both the phone and desktop card for a given
 * event are always in the tree, one hidden by `sm:hidden` or its opposite:
 * only the visible one is ever painted, and browsers do not fetch a lazy
 * `<Image>` that is `display: none`, so this does not double the requests.
 */
export function UpcomingEventsGrid({
  items,
  label = "upcoming event",
}: {
  /** Upcoming events, soonest first. */
  items: EventItem[];
  /** Names the swipe row for screen readers. */
  label?: string;
}) {
  const shown = items.slice(0, MAX_PROMOTED_EVENTS);

  if (shown.length === 0) return null;
  if (shown.length === 1) return <FeaturedEventCard event={shown[0]} />;

  const desktopSwipe = shown.length > MAX_ACROSS;

  return (
    <SwipeRow
      label={label}
      desktopSwipe={desktopSwipe}
      gridClassName={cn(
        "gap-6",
        !desktopSwipe && shown.length === 2 && "sm:grid-cols-2",
        !desktopSwipe && shown.length === 3 && "sm:grid-cols-3",
      )}
    >
      {shown.map((event, index) => (
        <Fragment key={event.slug}>
          <EventCard
            event={event}
            className="shrink-0 snap-center sm:hidden"
          />
          <EventHoverCard
            event={event}
            // Cards in the left half open rightwards and vice versa, so the
            // panel always expands into the row rather than off its edge.
            side={index < shown.length / 2 ? "right" : "left"}
            className={cn(
              "hidden shrink-0 snap-center sm:flex",
              desktopSwipe ? "sm:w-[calc((100%-3rem)/3)]" : "sm:shrink",
            )}
          />
        </Fragment>
      ))}
    </SwipeRow>
  );
}
