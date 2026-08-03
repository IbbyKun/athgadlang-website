import { EventCard } from "@/components/cards/event-card";
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
  className,
}: {
  items: EventItem[];
  /** Widest-screen column count. Three suits a shorter rail. */
  columns?: 3 | 4;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "xl:grid-cols-4",
        className,
      )}
    >
      {items.map((event) => (
        <EventCard key={event.slug} event={event} />
      ))}
    </div>
  );
}
