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
const ROW_HEIGHT_CLASS = "h-80";

/**
 * Flex-grow factors for the active card and its siblings, on `flexBasis: 0`.
 * Unlike `LeaderGallery` — the gallery this copies the mechanic from — there
 * is always exactly one active card here, never zero, so there is no "nothing
 * active, give everyone the same weight" case to account for.
 */
const GROW_ACTIVE = 1.8;
const GROW_RESTING = 1;

/**
 * Two or three upcoming events, side by side, where the card under the
 * pointer widens and reveals its detail — the accordion mechanic from
 * `LeaderGallery` combined with the grid-rows reveal from `ServiceCard`.
 *
 * Neither alone was right: `LeaderGallery` never had a default-open card or a
 * snap-back, because a leaders row starts with nothing selected; `ServiceCard`
 * never had siblings competing for width, because its cards sit in an
 * ordinary grid. This has both — the soonest event opens by default, and the
 * row snaps back to it rather than to nothing — so the reveal has to be
 * driven by `isActive` state rather than `ServiceCard`'s `group-hover:`,
 * which only knows about the one card it is attached to.
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
    Derived rather than stored, so the open card can never be none of them.
    Falling back to the soonest event covers both the resting state and a list
    that changed under a stale slug — a refresh dropping the hovered event
    would otherwise leave every card closed, which is the one state this row
    must not reach: three narrow strips of banner and no readable detail.
  */
  const activeSlug = items.some((event) => event.slug === hovered)
    ? hovered
    : items[0]?.slug;

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
        // `isolate` is load-bearing: the image and both scrims sit at `-z-10`,
        // and without a stacking context here they paint behind this card's
        // own background instead of under its text.
        "group relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-sm ring-1 ring-neutral-900/5",
        "transition-[flex-grow,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        isActive && "shadow-2xl",
      )}
    >
      <Image
        src={event.image.src}
        alt={event.image.alt}
        fill
        sizes="(min-width: 1280px) 45vw, 90vw"
        className={cn(
          "-z-10 object-cover transition-transform duration-700 ease-out motion-reduce:transition-none",
          isActive && "scale-105",
        )}
      />

      {/* Resting scrim: keeps the title legible on any photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/90 via-neutral-950/35 to-neutral-950/5"
      />
      {/* Dim scrim: only the active card goes dark, so the resting cards keep
          reading as photographs rather than all dimming together. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-neutral-950/55 opacity-0 transition-opacity duration-500 motion-reduce:transition-none",
          isActive && "opacity-100",
        )}
      />

      <div className="mt-auto flex flex-col p-6">
        {/* Always visible, whatever width the card holds: the title and the
            date. Everything else needs room this card only has when open. */}
        <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-white">
          <Link
            href={eventHref(event)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-white/80"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/70">
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
            <p
              className={cn(
                "line-clamp-2 pt-2 text-sm leading-relaxed text-white/85 opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
                isActive && "opacity-100",
              )}
            >
              {event.excerpt}
            </p>

            <div
              className={cn(
                "opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
                isActive && "opacity-100",
              )}
            >
              <EventFactLine event={event} className="mt-1.5 text-white/70" />

              <p className="mt-1.5 text-xs text-neutral-300">
                {eventPrice(event)}
              </p>

              {/* Co-host, where there is one — absent for an aG-led event. */}
              {event.partner && (
                <p className="mt-1.5 text-xs text-neutral-300">
                  <span className="font-semibold text-white">Co-host: </span>
                  {event.partner}
                </p>
              )}

              {/* Decorative: the whole card is already one stretched link
                  via the title, so this only has to look like a button. */}
              <span
                aria-hidden
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
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
