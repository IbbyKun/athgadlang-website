import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { EventFacts, EventKindPill } from "@/components/events/event-meta";
import { eventHref, type EventItem } from "@/lib/events";
import { cn } from "@/lib/utils";

/**
 * The next event, given a card of its own.
 *
 * Landscape banner beside the detail on wide screens, stacked below it on
 * narrow ones. It carries the full fact list rather than the compact line the
 * small cards use, because this is the one an undecided reader is deciding on.
 *
 * The call to action is decoration over a stretched link, as elsewhere:
 * registration itself lives on the event's own page, so there is one place a
 * click on this card can go.
 */
export function FeaturedEventCard({
  event,
  eyebrow = "Next up",
  className,
}: {
  event: EventItem;
  /** Overline above the title. */
  eyebrow?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-2xl bg-white",
        "ring-1 ring-neutral-200 shadow-sm transition duration-300 ease-out",
        "hover:shadow-xl hover:ring-2 hover:ring-brand",
        "focus-within:shadow-xl focus-within:ring-2 focus-within:ring-brand",
        "motion-reduce:transition-none",
        "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 lg:aspect-auto lg:min-h-[22rem]">
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            "group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none",
          )}
        />
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <EventKindPill kind={event.kind} />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            {eyebrow}
          </span>
        </div>

        <h3
          className={cn(
            "text-balance text-xl font-bold leading-snug tracking-tight text-brand-navy sm:text-2xl",
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

        <p className="text-pretty text-sm leading-relaxed text-neutral-600">
          {event.excerpt}
        </p>

        <hr className="border-neutral-200" />

        <EventFacts event={event} />

        <span
          aria-hidden
          className={cn(
            "mt-auto inline-flex items-center gap-2 self-start rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white",
            "transition-colors duration-300 group-hover:bg-brand-hover",
          )}
        >
          {/* Worded the same as the button on the event's own page, so the
              card and the page it opens make the same offer. */}
          {event.registerUrl ? "Register Now" : "View details"}
          <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
