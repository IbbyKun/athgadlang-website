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
const ROW_HEIGHT_CLASS = "h-[26rem]";

/**
 * Flex-grow factors for the card under the pointer and the rest, on
 * `flexBasis: 0`. Nothing is open at rest, so every card sits at
 * `GROW_RESTING` and the row divides evenly — there is no separate neutral
 * case to write, unlike `LeaderGallery`, which pushes its other cards below
 * their resting weight and so needs one.
 */
const GROW_ACTIVE = 1.8;
const GROW_RESTING = 1;

/**
 * Two or three upcoming events, side by side, where the card under the
 * pointer widens and reveals its detail — the accordion mechanic from
 * `LeaderGallery` combined with the grid-rows reveal from `ServiceCard`.
 *
 * Nothing is open at rest: the row divides evenly and each card carries only
 * its banner, title and date until the pointer picks one out. Widening that
 * card takes room from the others only in the sense that flex-grow is
 * relative — none of them is pushed below the weight it started at.
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
