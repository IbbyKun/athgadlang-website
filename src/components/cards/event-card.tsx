import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { EventFactLine, EventKindPill } from "@/components/events/event-meta";
import { eventHref, isUpcoming, type EventItem } from "@/lib/events";
import { formatEventDay } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The small event card, used in every grid.
 *
 * Same hover language as the article and webinar cards — lift, brand-red edge,
 * photo scale — with the date lifted onto the image as a tear-off block,
 * because the date is the thing a reader scans a grid of events for.
 *
 * Single stretched link; the "Details" row is decoration.
 */
export function EventCard({
  event,
  sizes = "(min-width: 1280px) 23rem, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw",
  className,
}: {
  event: EventItem;
  sizes?: string;
  className?: string;
}) {
  const upcoming = isUpcoming(event);

  return (
    <article
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white",
        "ring-1 ring-neutral-200 shadow-sm transition duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-brand",
        "focus-within:-translate-y-1.5 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-brand",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[2/1] shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            "group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none",
            // A past event is visibly in the archive rather than on sale.
            !upcoming && "opacity-80 saturate-50",
          )}
        />

        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-navy shadow-sm">
          <time dateTime={event.date}>{formatEventDay(event.date)}</time>
        </span>

        {!upcoming && (
          <span className="absolute right-3 top-3 rounded-full bg-neutral-950/70 px-2.5 py-1 text-xs font-bold text-white">
            Ended
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <EventKindPill kind={event.kind} short className="self-start" />

        <h3
          className={cn(
            "line-clamp-3 text-base font-bold leading-snug tracking-tight text-brand-navy",
            "transition-colors duration-300 group-hover:text-brand",
          )}
        >
          <Link
            href={eventHref(event)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {event.title}
          </Link>
        </h3>

        <EventFactLine event={event} />

        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {event.excerpt}
        </p>

        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand"
        >
          {upcoming ? "Details & registration" : "View details"}
          <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
