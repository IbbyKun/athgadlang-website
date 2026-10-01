"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

import { EventFactLine } from "@/components/events/event-meta";
import { eventHref, eventPrice, type EventItem } from "@/lib/events";
import { formatEventDay } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Row height. Fixed, and named here rather than left as a literal because the
 * whole point of this accordion is that widening a card never makes it taller
 * — so this is the one number that must stay independent of any card content.
 */
const ROW_HEIGHT_CLASS = "h-[32rem]";

/**
 * How much of that height the banner takes, leaving the rest for the panel.
 *
 * Two heights, not one. The panel has to be tall enough for an open card, and
 * a single height would mean a closed card reserving that room and leaving it
 * empty. So the banner holds the difference until the card is opened and the
 * detail needs it back.
 *
 * Heights rather than an aspect ratio, because the card's width changes as it
 * opens: an aspect-sized banner would take the row's height with it.
 */
const BANNER_OPEN_CLASS = "h-72";
const BANNER_CLOSED_CLASS = "h-96";

/**
 * Flex-grow factors for the card under the pointer and the rest, on
 * `flexBasis: 0`. Nothing is open at rest, so every card sits at
 * `GROW_RESTING` and the row divides evenly — there is no separate neutral
 * case to write, unlike `LeaderGallery`, which pushes its other cards below
 * their resting weight and so needs one.
 */
const GROW_ACTIVE = 1.6;
const GROW_RESTING = 1;

/**
 * Two or three upcoming events, side by side, where the card under the
 * pointer widens and reveals its detail — the accordion mechanic from
 * `LeaderGallery`, over the banner-then-panel card the rest of the site uses.
 *
 * Nothing is open at rest: the row divides evenly and each card carries only
 * its banner, title and date until the pointer picks one out. Widening that
 * card takes room from the others only in the sense that flex-grow is
 * relative — none of them is pushed below the weight it started at.
 *
 * Nothing is ever drawn over the banner, which is the one rule this card
 * exists to keep. `ServiceCard` reveals its copy on top of its image, but it
 * is illustrated with photographs; an event banner is a finished piece of
 * artwork that already states the title, the date, the time and how to
 * register. Laid over one, our own copy repeats it and collides with it. So
 * the banner gets its own height and the copy sits in an opaque panel below,
 * where the reveal has room of its own to open into.
 *
 * Rendered only for a device that can hover (`xl:can-hover:flex` on the
 * caller) — there is no focus handling at all here, on purpose. Widening a
 * card on focus would fire on every tab stop on the way to the link a
 * keyboard user actually wants, and touch has no hover to gate on in the
 * first place; both get the plain `EventGrid` instead. The card's own link
 * stays a normal tab stop regardless.
 */
export function EventAccordion({
  items,
  className,
}: {
  /** Two or three upcoming events, soonest first. */
  items: EventItem[];
  className?: string;
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);

  /*
    Checked against the current list rather than trusted, so a refresh that
    drops the hovered event closes the row instead of leaving a slug pointing
    at a card that is no longer there.
  */
  const activeSlug = items.some((event) => event.slug === hovered)
    ? hovered
    : null;

  return (
    <div
      className={cn(ROW_HEIGHT_CLASS, "flex gap-6", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((event) => (
        <EventAccordionCard
          key={event.slug}
          event={event}
          isActive={event.slug === activeSlug}
          onMouseEnter={() => setHovered(event.slug)}
        />
      ))}
    </div>
  );
}

function EventAccordionCard({
  event,
  isActive,
  onMouseEnter,
}: {
  event: EventItem;
  isActive: boolean;
  onMouseEnter: () => void;
}) {
  return (
    <article
      onMouseEnter={onMouseEnter}
      style={{ flexBasis: 0, flexGrow: isActive ? GROW_ACTIVE : GROW_RESTING }}
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white",
        "transition-[flex-grow,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        isActive
          ? "shadow-xl ring-2 ring-brand"
          : "shadow-sm ring-1 ring-neutral-200",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-neutral-100",
          "transition-[height] duration-500 ease-out motion-reduce:transition-none",
          isActive ? BANNER_OPEN_CLASS : BANNER_CLOSED_CLASS,
        )}
      >
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          sizes="(min-width: 1280px) 45vw, 90vw"
          className="object-cover object-center"
        />
      </div>

      {/* Centred, because the panel is sized for the open card and a closed
          one leaves the difference empty — split above and below the title it
          reads as room, trailing after it as an unfinished card. */}
      <div className="flex flex-1 flex-col justify-center p-5">
        {/* Always visible, whatever width the card holds: the title and the
            date. Everything else needs room this card only has when open. */}
        <h3
          className={cn(
            "line-clamp-2 text-base font-bold leading-snug tracking-tight text-brand-navy",
            "transition-colors duration-300 group-hover:text-brand motion-reduce:transition-none",
          )}
        >
          <Link
            href={eventHref(event)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
          <CalendarDays aria-hidden className="size-3.5 text-brand" />
          <time dateTime={event.date}>{formatEventDay(event.date)}</time>
        </p>

        {/* 0fr → 1fr animates the height, not the opacity, which is what
            reveals this without the card itself ever changing height — the
            grow-shrink of the row happens beside this, never because of it. */}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none",
            isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                "opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
                isActive && "opacity-100",
              )}
            >
              <p className="line-clamp-2 pt-3 text-sm leading-relaxed text-neutral-600">
                {event.excerpt}
              </p>

              <EventFactLine event={event} className="mt-2.5" />

              <p className="mt-1.5 text-xs text-neutral-500">
                {eventPrice(event)}
              </p>

              {/* Co-host, where there is one — absent for an aG-led event. */}
              {event.partner && (
                <p className="mt-1.5 text-xs text-neutral-500">
                  <span className="font-semibold text-brand-navy">
                    Co-host:{" "}
                  </span>
                  {event.partner}
                </p>
              )}

              {/* Decorative: the whole card is already one stretched link
                  via the title, so this only has to look like a button. */}
              <span
                aria-hidden
                className={cn(
                  "mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white",
                  "transition-colors duration-300 group-hover:bg-brand-hover motion-reduce:transition-none",
                )}
              >
                Register Now
                <ChevronRight className="size-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
