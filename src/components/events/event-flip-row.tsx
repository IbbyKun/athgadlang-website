import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, MapPin } from "lucide-react";

import {
  eventHref,
  eventLocation,
  eventPrice,
  type EventItem,
} from "@/lib/events";
import { formatEventDay } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Row height. Fixed, and named here rather than left as a literal because both
 * faces of every card are sized to it — it is the one number that must stay
 * independent of any card's content.
 */
const ROW_HEIGHT_CLASS = "h-[32rem]";

/** The banner's height on the front face; the panel takes the rest. */
const BANNER_CLASS = "h-96";

/** Both faces share this, so they stack exactly and hide each other's back. */
const FACE_CLASS =
  "absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 [backface-visibility:hidden]";

/**
 * Two or three upcoming events, side by side, where the card under the pointer
 * flips over to show its detail. Cards stay equal width and the row never
 * changes size, so nothing around it moves when a card turns.
 *
 * The front is the banner plus a panel with only the title, date and time.
 * Nothing is ever drawn over the banner: an event banner is finished artwork
 * that already states the title, date and how to register, and our own copy
 * laid over it repeats it and collides with it. So the back puts its detail
 * over a heavily blurred, mostly-white copy of the banner instead —
 * enough to carry the event's colour, too soft for the artwork's own text to
 * be read — with the detail on top.
 *
 * Pure CSS: `group-hover` turns the inner wrapper, so there is no state and
 * nothing to hydrate. Under `motion-reduce` the faces do not turn at all; they
 * crossfade instead.
 *
 * Rendered only for a device that can hover (`xl:can-hover:flex` on the
 * caller), so there is no focus handling on purpose: flipping on focus would
 * fire on every tab stop on the way to the link a keyboard user wants, and
 * touch has no hover. Both get the plain `EventGrid`, which shows every detail
 * inline.
 *
 * Links: the front title is the card's stretched link. A face turned away
 * cannot be clicked, so the back carries its own stretched link, but it is out
 * of the tab order (and the accessibility tree) so the card has one tab stop
 * for the event page. "Register Now" is a real separate link stacked above it,
 * also kept out of the tab order for the same reason.
 */
export function EventFlipRow({
  items,
  className,
}: {
  /** Two or three upcoming events, soonest first. */
  items: EventItem[];
  className?: string;
}) {
  return (
    <div className={cn(ROW_HEIGHT_CLASS, "flex gap-6", className)}>
      {items.map((event) => (
        <EventFlipCard key={event.slug} event={event} />
      ))}
    </div>
  );
}

function EventFlipCard({ event }: { event: EventItem }) {
  const href = eventHref(event);
  const external = Boolean(event.registerUrl);

  return (
    <article className="group min-w-0 flex-1 basis-0 [perspective:1400px]">
      <div
        className={cn(
          "relative size-full [transform-style:preserve-3d]",
          "motion-safe:transition-transform motion-safe:duration-[600ms] motion-safe:ease-out",
          "motion-safe:group-hover:[transform:rotateY(180deg)]",
        )}
      >
        {/* Front */}
        <div
          className={cn(
            FACE_CLASS,
            "flex flex-col",
            "motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:group-hover:opacity-0",
          )}
        >
          <div className={cn("relative shrink-0 bg-neutral-100", BANNER_CLASS)}>
            <Image
              src={event.image.src}
              alt={event.image.alt}
              fill
              sizes="(min-width: 1280px) 45vw, 90vw"
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-1.5 p-5">
            <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-brand-navy">
              <Link
                href={href}
                className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
              >
                {event.title}
              </Link>
            </h3>

            <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
              <CalendarDays aria-hidden className="size-3.5 text-brand" />
              <time dateTime={event.date}>{formatEventDay(event.date)}</time>
            </p>

            <p className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
              <Clock aria-hidden className="size-3.5 text-brand" />
              <span>
                {event.time}
                <span className="font-normal text-neutral-500">
                  {" "}
                  {event.timezone}
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Back. Pre-turned so it faces out once the wrapper has rotated; when
            motion is reduced nothing rotates, so it sits flat and fades in, and
            is inert to the pointer until then so its hidden button cannot be
            clicked at rest. */}
        <div
          className={cn(
            FACE_CLASS,
            "motion-safe:[transform:rotateY(180deg)]",
            "motion-reduce:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-200",
            "motion-reduce:pointer-events-none motion-reduce:group-hover:pointer-events-auto motion-reduce:group-hover:opacity-100",
          )}
        >
          <Image
            src={event.image.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 45vw, 90vw"
            className="scale-110 object-cover blur-xl"
          />
          <div aria-hidden className="absolute inset-0 bg-white/85" />

          <div className="relative flex size-full flex-col justify-center gap-3 p-6">
            {/* Not a heading: the front already carries this card's one. */}
            <p className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-brand-navy">
              {event.title}
            </p>

            <p className="line-clamp-4 text-sm leading-relaxed text-neutral-700">
              {event.excerpt}
            </p>

            <p className="flex items-start gap-1.5 text-xs text-neutral-600">
              <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand" />
              {eventLocation(event)}
            </p>

            <p className="text-xs text-neutral-600">{eventPrice(event)}</p>

            {/* Co-host, where there is one — absent for an aG-led event. */}
            {event.partner && (
              <p className="text-xs text-neutral-600">
                <span className="font-semibold text-brand-navy">Co-host: </span>
                {event.partner}
              </p>
            )}

            {/* Mouse-only stretched link, so the whole turned card opens the
                event page. Not a tab stop: the front title already is. */}
            <Link
              href={href}
              tabIndex={-1}
              aria-hidden
              className="absolute inset-0"
            />

            {/* Out of the tab order too: the back is only ever shown to a
                pointer, so a keyboard user would land on it unseen. They reach
                registration through the event page instead. */}
            <Link
              href={event.registerUrl ?? href}
              tabIndex={-1}
              {...(external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className={cn(
                "relative z-10 mt-1 inline-flex items-center gap-2 self-start rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white",
                "transition-colors duration-300 hover:bg-brand-hover motion-reduce:transition-none",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Register Now
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
