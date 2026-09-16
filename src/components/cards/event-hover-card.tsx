"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

import { EventFacts, EventKindPill } from "@/components/events/event-meta";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useCanHover } from "@/hooks/use-can-hover";
import { eventHref, type EventItem } from "@/lib/events";
import { formatEventDay } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The banner-led card used when two or three events sit side by side.
 *
 * At rest it shows only the pill, the title and the date — these banners
 * already carry their own baked-in headline, so nothing is overlaid on the
 * artwork the way the small grid card overlays a date badge. The excerpt, the
 * full facts, the co-host and the call to action live in a popover instead,
 * because three of these across a row leave no room to show it all at once
 * the way the single-event card can.
 *
 * Hover only, deliberately: it does not open on focus, so a keyboard user
 * simply tabs to the title link and follows it, the same journey a mouse
 * user gets by clicking through. `useCanHover` keeps it off touch devices
 * entirely, where a tap could open a popover with nothing to close it.
 *
 * It opens beside the card rather than above or below it. The panel is taller
 * than the card, so a vertical placement had nowhere to go: below ran off the
 * fold, and flipping above put it under the sticky header. Sideways it only
 * has to shift to stay in view, and the row always leaves room on one side —
 * `side` points it away from the edge the card sits on.
 *
 * The popover content is `pointer-events-none` — nothing in it is
 * interactive, so the pointer never has to travel into it, and closing on
 * `mouseleave` of the card alone (no grace delay) is enough.
 */
export function EventHoverCard({
  event,
  side = "right",
  sizes = "(min-width: 1024px) 31vw, 47vw",
  className,
}: {
  event: EventItem;
  /** Which way the popover opens, so it never has to cross the row's edge. */
  side?: "left" | "right";
  sizes?: string;
  className?: string;
}) {
  const canHover = useCanHover();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <article
          onMouseEnter={() => canHover && setOpen(true)}
          onMouseLeave={() => canHover && setOpen(false)}
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
              )}
            />
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

            <p className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
              <CalendarDays aria-hidden className="size-3.5 text-brand" />
              <time dateTime={event.date}>{formatEventDay(event.date)}</time>
            </p>
          </div>
        </article>
      </PopoverAnchor>

      <PopoverContent
        side={side}
        align="center"
        sideOffset={12}
        // Clears the sticky header, so shifting up to stay in view never
        // tucks the panel underneath it.
        collisionPadding={{ top: 96, bottom: 16, left: 16, right: 16 }}
        // Focus stays wherever it was: opening on hover is not a gesture a
        // keyboard or screen-reader user made, so the popover must not steal
        // focus in either direction.
        onOpenAutoFocus={(openEvent) => openEvent.preventDefault()}
        onCloseAutoFocus={(closeEvent) => closeEvent.preventDefault()}
        className="w-96 gap-3 p-4 pointer-events-none"
      >
        <div className="relative aspect-[2/1] overflow-hidden rounded-md bg-neutral-100">
          <Image
            src={event.image.src}
            alt={event.image.alt}
            fill
            sizes="24rem"
            // Contain, not cover: the card already shows the crop, so the
            // popover's job is to restore the full, uncropped artwork.
            className="object-contain"
          />
        </div>

        <EventKindPill kind={event.kind} className="self-start" />

        <p className="text-balance text-base font-bold leading-snug tracking-tight text-brand-navy">
          {event.title}
        </p>

        <p className="text-pretty text-sm leading-relaxed text-neutral-600">
          {event.excerpt}
        </p>

        <hr className="border-neutral-200" />

        <EventFacts event={event} />

        {event.partner && (
          <p className="text-sm text-neutral-600">
            <span className="font-semibold text-brand-navy">Co-host: </span>
            {event.partner}
          </p>
        )}

        <span
          aria-hidden
          className="mt-1 inline-flex items-center gap-2 self-start rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white"
        >
          {event.registerUrl ? "Register Now" : "View details"}
          <ChevronRight className="size-4" />
        </span>
      </PopoverContent>
    </Popover>
  );
}
