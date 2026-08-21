import { EventCard } from "@/components/cards/event-card";
import { SwipeRow } from "@/components/ui/swipe-row";
import type { EventItem } from "@/lib/events";
import { cn } from "@/lib/utils";

/**
 * A grid of event cards. Four a row at the widest, matching the article and
 * webinar grids so the three resource sections keep the same rhythm.
 *
 * No "view more" batching: an events list is short by nature — a handful
 * coming up, an archive that is measured in months — so there is nothing to
 * defer.
 */
export function EventGrid({
  items,
  columns = 4,
  swipe = false,
  label = "event",
  className,
}: {
  items: EventItem[];
  /** Widest-screen column count. Three suits a shorter rail. */
  columns?: 3 | 4;
  /**
   * Swipe as a row on a phone rather than stacking. Opt-in, because this grid
   * serves three lists and only the archive is long enough to be worth it —
   * turning a list of two into a carousel adds a gesture and takes away the
   * ability to see both at once.
   */
  swipe?: boolean;
  /** Names the row for screen readers. Only read when `swipe` is on. */
  label?: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  /** The columns, identical either way — only the container differs. */
  const columnsClass = cn(
    "gap-6 sm:grid-cols-2 lg:grid-cols-3",
    columns === 4 && "xl:grid-cols-4",
    className,
  );

  const cards = items.map((event) => (
    <EventCard
      key={event.slug}
      event={event}
      // The card already carries `w-full`, which with the peek expressed as the
      // row's padding is exactly the width wanted — so there is nothing to
      // override here but the flex behaviour.
      className={swipe ? "shrink-0 snap-center sm:shrink" : undefined}
      sizes={
        swipe
          ? "(min-width: 1280px) 23rem, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 82vw"
          : undefined
      }
    />
  ));

  if (!swipe) {
    return <div className={cn("grid grid-cols-1", columnsClass)}>{cards}</div>;
  }

  return (
    <SwipeRow
      label={label}
      // A bar, not dots. This grid's length is however many rows the table
      // holds, and the archive only ever grows — a dot per card is fine at
      // three and unreadable at thirty.
      indicator="bar"
      gridClassName={cn("px-[6%]", columnsClass)}
    >
      {cards}
    </SwipeRow>
  );
}
