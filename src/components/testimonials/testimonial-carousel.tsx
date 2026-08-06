"use client";

import * as React from "react";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import { CarouselArrow } from "@/components/ui/carousel-arrow";
import { type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

type TestimonialCarouselProps = {
  items: Testimonial[];
  /** Describes the carousel for screen readers. */
  label?: string;
  className?: string;
};

/**
 * Three copies of the list, and we sit in the middle one.
 *
 * That is what makes the ring seamless: whichever way the reader goes there is
 * always a real card to slide in and to peek from the far side, because a whole
 * spare copy sits either side of the one on screen. Two copies would run out
 * at one end; more than three is wasted markup.
 */
const COPIES = 3;

/**
 * A centred, circular slider: the focused quote sits in the middle at full
 * size, its neighbours peek in from both sides scaled back and behind it, and
 * each press slides the track one card along. The list wraps in both
 * directions — the card before the first is the last, and the card after the
 * last is the first.
 *
 * Deliberately not a <ScrollRow>. That row scrolls linearly and stops dead at
 * both ends, which is right for a long list of articles the reader skims.
 *
 * How the centring works: the track carries leading and trailing padding of
 * exactly half the leftover width, so the slide at offset 0 starts centred.
 * Translating the track by `-position * slide width` then centres any other
 * slide, and the clipping wrapper is wider than one card, so the neighbours
 * show through either side.
 */
export function TestimonialCarousel({
  items,
  label = "Client testimonials",
  className,
}: TestimonialCarouselProps) {
  const count = items.length;

  /**
   * Offset into the tripled track, not an index into `items`. Starts in the
   * middle copy so there is a full list to travel through either way.
   */
  const [position, setPosition] = React.useState(count);
  /**
   * Cleared only for the frame we silently re-centre on. Every visible move is
   * animated; the jump back to the middle copy must not be, or the reader
   * would see the track race across a whole list.
   */
  const [animate, setAnimate] = React.useState(true);

  const trackRef = React.useRef<HTMLDivElement>(null);

  /** Normalises any offset back into the middle copy. */
  const recentre = (offset: number) =>
    count + (((offset % count) + count) % count);

  const step = (direction: 1 | -1) => {
    setAnimate(true);
    setPosition((current) => {
      const next = current + direction;
      // Presses faster than the transition can finish would otherwise walk off
      // the end of the tripled track before it re-centres us.
      return next < 0 || next >= count * COPIES ? recentre(next) : next;
    });
  };

  const jumpTo = (index: number) => {
    setAnimate(true);
    setPosition((current) => {
      // Whichever copy of that card is nearest, so a dot press never travels
      // further than half a list even when the two are at opposite ends.
      const base = current - (((current % count) + count) % count);
      return [base + index - count, base + index, base + index + count].reduce(
        (best, candidate) =>
          Math.abs(candidate - current) < Math.abs(best - current)
            ? candidate
            : best,
      );
    });
  };

  /**
   * Once a slide has finished animating, if we have wandered out of the middle
   * copy, drop back into it by a whole list. The card under the reader's eye is
   * identical, so the swap is invisible — and it keeps `position` bounded
   * however long they click.
   */
  const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    // Slides animate their own scale and opacity, and transitionend bubbles.
    if (event.target !== event.currentTarget) return;
    if (position >= count && position < count * 2) return;
    setAnimate(false);
    setPosition(recentre(position));
  };

  if (count === 0) return null;

  /** Which testimonial is in focus, wherever in the track we happen to be. */
  const active = (((position % count) + count) % count);

  const slides =
    count > 1
      ? Array.from({ length: count * COPIES }, (_, offset) => ({
          testimonial: items[offset % count],
          offset,
        }))
      : [{ testimonial: items[0], offset: 0 }];

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      // gap-2, not more: the track's own bottom padding already separates the
      // cards from the dots.
      className={cn("flex flex-col items-center gap-2", className)}
    >
      <div
        className="relative w-full"
        // One source of truth: the track padding, each slide's width and the
        // travel per press are all derived from it.
        style={{ "--slide-w": "min(34rem, 84vw)" } as React.CSSProperties}
      >
        {/* Clips the peeking neighbours at the section's edges. */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            onTransitionEnd={onTransitionEnd}
            className={cn(
              "flex",
              // Vertical room inside the clipping wrapper. Without it the
              // card's ring and shadow sit flush against the clip edge and get
              // shaved off top and bottom — more at the bottom, because the
              // shadow falls downwards and the hover lift raises the card.
              "pb-8 pt-4",
              animate && "transition-transform duration-500 ease-out",
              "motion-reduce:transition-none",
            )}
            style={{
              paddingInline: "calc((100% - var(--slide-w)) / 2)",
              transform: `translateX(calc(-${count > 1 ? position : 0} * var(--slide-w)))`,
            }}
          >
            {slides.map(({ testimonial, offset }) => {
              const focused = count > 1 ? offset === position : true;

              return (
                <div
                  key={`${testimonial.id}-${offset}`}
                  // Only the focused card is exposed: the copies either side
                  // are the same quotes over again, and a screen reader
                  // announcing each three times would be nonsense.
                  aria-hidden={!focused}
                  className={cn(
                    "w-(--slide-w) shrink-0 px-3",
                    "transition-all duration-500 ease-out motion-reduce:transition-none",
                    focused
                      ? "z-10 scale-100 opacity-100"
                      : // Behind and receded, and inert so a half-visible card
                        // cannot take a hover or a click meant for the focused
                        // one.
                        "z-0 scale-90 opacity-40 pointer-events-none",
                  )}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 && (
          <>
            {/* -mt-2 centres them on the cards rather than on the wrapper:
                the track carries 8px more padding below than above. */}
            <CarouselArrow
              direction="left"
              label="Previous testimonial"
              onClick={() => step(-1)}
              className="-mt-2 left-2 sm:left-4"
            />
            <CarouselArrow
              direction="right"
              label="Next testimonial"
              onClick={() => step(1)}
              className="-mt-2 right-2 sm:right-4"
            />
          </>
        )}
      </div>

      {/* Announced separately: every slide is always in the DOM, so there is no
          insertion for a live region to notice. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {`Testimonial ${active + 1} of ${count}, ${items[active].name}`}
      </p>

      {count > 1 && (
        <div className="flex items-center gap-2">
          {items.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => jumpTo(index)}
              aria-label={`Show testimonial ${index + 1} of ${count}`}
              aria-current={index === active}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                // The current dot stretches rather than only recolouring, so
                // position is legible without relying on colour alone.
                index === active
                  ? "w-5 bg-brand"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
