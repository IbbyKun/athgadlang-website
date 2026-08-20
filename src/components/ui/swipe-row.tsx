"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SwipeRowProps = {
  children: React.ReactNode;
  /** Names the list for screen readers, e.g. "Services". */
  label: string;
  /**
   * The row's own layout: its gaps at every width, and the columns it takes
   * from `sm` up. Passed in rather than fixed here, because those belong to the
   * section that owns the cards and differ between them — services sit on
   * `gap-6`, the aG Studio grid on `gap-3 sm:gap-4`. Only the scrolling
   * mechanics are this component's business.
   */
  gridClassName?: string;
  /**
   * Set where the grid was a `flex-1` child of a full-height column, so it
   * keeps absorbing the leftover height from `sm` up. Off by default: adding
   * `flex-1` to a grid whose parent is content-height does nothing, but saying
   * so explicitly is better than every caller having to know that.
   */
  stretch?: boolean;
  /**
   * How many cards this row shows at once on a phone — one by default, two for
   * the leaders row.
   *
   * Only the first paint uses it; the real figure is measured on mount and
   * takes over. It exists because the server cannot measure anything, so
   * without it a two-up row is rendered with a dot per card and then drops to a
   * dot per page the moment it hydrates — twelve dots visibly collapsing to
   * six. Not duplication of the CSS so much as the intent the CSS implements,
   * stated where the first render can see it.
   */
  perView?: number;
  /**
   * How position is shown. The two look the same; what differs is what a dot
   * means and whether you can press it.
   *
   * `dots` is one per page, and each is a button. Right for a list whose length
   * is a decision somebody made — five practice areas, eleven leaders, four
   * articles — where pressing the fourth dot is a sensible thing to offer.
   *
   * `bar` caps the count and drops the buttons. Same dots to look at, but they
   * report where the row has got to rather than addressing pages, so the mark
   * stays the same size however long the list becomes. For anything whose
   * length is whatever the table holds: twenty past events would be twenty
   * buttons, about 312px of a 412px screen, and fifty would be unreadable.
   *
   * Below the cap the two are indistinguishable on screen, which is the point —
   * three past events look like any other row of three.
   */
  indicator?: "dots" | "bar";
  className?: string;
};

/**
 * A row the reader swipes on a phone, and the grid it always was from `sm` up.
 *
 * Not a <ScrollRow>. That one is a full-screen pane that takes over vertical
 * scrolling and advances sideways as the page scrolls, with arrows either side —
 * right for a long list of articles being skimmed. This is the opposite trade:
 * no pinning, no arrows, no height of its own, and it exists only below `sm`.
 * Above that it stops being a row at all and the grid takes over untouched,
 * which is what keeps the desktop layout out of this entirely.
 *
 * Native scrolling with `snap-x snap-mandatory`, not a transformed track. A
 * swipe should have the momentum, rubber-banding and interruptibility the
 * platform already provides, and none of that is worth reimplementing to gain
 * nothing. The scrollbar is hidden because the dots below say the same thing
 * more clearly at this size — which is the whole reason they are here: a grid
 * that has become a row gives the reader no hint that anything sits off the
 * right edge, and an affordance nobody notices is the same as no affordance.
 *
 * The dots are the ones the testimonial carousel uses, deliberately: same size,
 * same colours, same stretch on the active one so position survives being read
 * without colour. Two different indicators on one page would read as two
 * different kinds of control.
 */
/**
 * Most dots a capped bar will draw.
 *
 * Five, because that is about where a row of them stops reading as a position
 * and starts reading as a list of things to count — and because five 8px marks
 * with their gaps come to roughly 84px, which sits comfortably under the
 * narrowest card without ever being the widest thing in the section.
 */
const BAR_DOTS = 5;

export function SwipeRow({
  children,
  label,
  gridClassName,
  stretch = false,
  perView: expectedPerView = 1,
  indicator = "dots",
  className,
}: SwipeRowProps) {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const count = React.Children.count(children);

  /**
   * What the last measurement found: how many cards the row shows at once, and
   * how many it is actually laying out. Refs rather than state because only
   * `show` reads them, and it runs from a click rather than from a render.
   */
  const perViewRef = React.useRef(expectedPerView);
  const cardsRef = React.useRef(count);

  const [pages, setPages] = React.useState(
    Math.max(1, Math.ceil(count / expectedPerView)),
  );
  /** Index of the page on screen, not of the card. */
  const [active, setActive] = React.useState(0);

  /**
   * How far along the row is, 0 to 1. What the capped bar lights up from, since
   * it has fewer dots than pages and so cannot use the page index.
   */
  const [progress, setProgress] = React.useState(0);

  /**
   * Reads how many cards fit, how many pages that makes, and which one is on
   * screen.
   *
   * All measured from the DOM rather than declared: the card width, the gap and
   * the row's padding are set in CSS by the caller and differ per section, so
   * anything derived from an assumed step would be wrong for one of them.
   */
  const sync = React.useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    /*
      Only the children the layout is using. A slide can be `display: none` at
      this width — the leaders row hides its closing prompt on a phone and
      shows it under the dots instead — and a zero-width box would otherwise
      count towards the pages and leave a dot with nothing behind it.
    */
    const cards = Array.from(row.children).filter(
      (card) => card.getBoundingClientRect().width > 0,
    );
    const first = cards[0];
    if (!first) return;

    const style = getComputedStyle(row);
    const gap = Number.parseFloat(style.columnGap) || 0;
    const inner =
      row.clientWidth -
      Number.parseFloat(style.paddingLeft) -
      Number.parseFloat(style.paddingRight);
    const step = first.getBoundingClientRect().width + gap;
    const fits = step > 0 ? Math.max(1, Math.round(inner / step)) : 1;
    const total = Math.max(1, Math.ceil(cards.length / fits));

    perViewRef.current = fits;
    cardsRef.current = cards.length;
    setPages(total);

    /*
      Position as a fraction of how far the row can travel, rather than from
      which card sits nearest the middle.

      The two agree in the middle of a row and only this one is right at the end
      of it. Eleven cards two at a time is six pages, and the sixth would begin
      at the eleventh card — which the row can never bring to its left edge,
      because by then there is only one card left to fill a two-card window. Ask
      which card is central at that point and the answer is the tenth for both
      of the last two pages, so the sixth dot could never light up. Mapping
      0..maxScroll onto 0..pages-1 reaches both ends by construction and needs
      no special case for the half page at the finish.
    */
    const travel = row.scrollWidth - row.clientWidth;
    setActive(
      travel > 0 ? Math.round((row.scrollLeft / travel) * (total - 1)) : 0,
    );

    setProgress(travel > 0 ? row.scrollLeft / travel : 0);
  }, []);

  React.useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    sync();
    row.addEventListener("scroll", sync, { passive: true });
    // Covers rotation and the breakpoint crossing, where the row becomes a grid
    // and every rect changes at once.
    const observer = new ResizeObserver(sync);
    observer.observe(row);

    return () => {
      row.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  /** Scrolls to the first card of a page. */
  const show = (page: number) => {
    const row = rowRef.current;
    if (!row) return;

    const perView = perViewRef.current;
    const cards = Array.from(row.children).filter(
      (card) => card.getBoundingClientRect().width > 0,
    );

    // Clamped to the last full window, so the final page starts at a card the
    // row can actually scroll to rather than one past the end of its travel.
    const index = Math.min(
      page * perView,
      Math.max(0, cards.length - perView),
    );
    const card = cards[index];
    if (!card) return;

    card.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      // The row is the only thing that should move. Without `nearest` the
      // browser is free to scroll the page vertically to centre the card too.
      block: "nearest",
      // A one-up row centres its card inside the peek padding either side; a
      // two-up row aligns the pair against the left edge.
      inline: perView > 1 ? "start" : "center",
    });
  };

  return (
    /*
      With `stretch`, carries `flex-1` from `sm` up and hands it to the grid
      inside, because the grid used to be the section's own flex child and take
      the leftover height directly. Wrapping it for the dots put a div between
      the two; without this the grid would stretch to a wrapper that is only as
      tall as its content, and the cards would stop absorbing the space on a
      tall screen.
    */
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 sm:gap-0",
        stretch && "sm:flex-1",
        className,
      )}
    >
      <div
        ref={rowRef}
        role="group"
        aria-label={label}
        className={cn(
          /*
            The card is 82% of the window and the padding is half of what is
            left, so a centred card leaves an equal sliver of its neighbours
            either side. That peek is the second affordance after the dots: a
            card cut off at the edge is the clearest possible statement that
            the row continues.

            `py-2` because `overflow-x: auto` forces the vertical axis to
            scroll too, which would otherwise shave the cards' ring, shadow and
            focus lift.
          */
          "no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-[9%] py-2",
          // From here up it is the grid again, and nothing above is left in
          // play: no snapping, no clipping, no padding of its own.
          "sm:grid sm:snap-none sm:overflow-visible sm:px-0 sm:py-0",
          stretch && "sm:flex-1",
          gridClassName,
        )}
      >
        {children}
      </div>

      {indicator === "bar" && pages > 1 && (
        /*
          Decorative, and `aria-hidden` for it. Nothing here is pressable —
          these are spans, not buttons — because the row is already a labelled
          scroll container and that is what a screen reader navigates. The mark
          is here to say the row keeps going, which is a thing to see rather
          than a thing to operate.
        */
        <div
          aria-hidden
          className="flex items-center justify-center gap-2 sm:hidden"
        >
          {Array.from({ length: Math.min(pages, BAR_DOTS) }, (_, index) => {
            const shown = Math.min(pages, BAR_DOTS);
            /*
              Lit from how far the row has travelled rather than from a page
              index: past the cap there are more pages than dots, so no dot
              belongs to a page. Under the cap this lands on the same answer the
              page index would, which is what makes a short list
              indistinguishable from a row of the real, pressable ones.
            */
            const lit = index === Math.round(progress * (shown - 1));

            return (
              <span
                key={index}
                // The dots' own measurements, down to the transition.
                className={cn(
                  "h-2 rounded-full transition-all duration-300 motion-reduce:transition-none",
                  lit ? "w-5 bg-brand" : "w-2 bg-neutral-300",
                )}
              />
            );
          })}
        </div>
      )}

      {indicator === "dots" && pages > 1 && (
        <div className="flex items-center justify-center gap-2 sm:hidden">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => show(index)}
              aria-label={`Show ${label}, ${index + 1} of ${pages}`}
              aria-current={index === active}
              className={cn(
                "relative h-2 rounded-full transition-all duration-300",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                /*
                  An 8px pill is well under a finger. The pseudo-element grows
                  the hit area to roughly 24px tall without moving the dot:
                  vertically generous, horizontally only 4px either side, so
                  neighbouring targets stay clear of each other across the 8px
                  gap rather than overlapping and stealing each other's taps.
                */
                "after:absolute after:-inset-y-2 after:-inset-x-1 after:content-['']",
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
