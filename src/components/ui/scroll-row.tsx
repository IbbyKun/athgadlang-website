"use client";

import * as React from "react";

import { CarouselArrow } from "@/components/ui/carousel-arrow";
import { Container } from "@/components/ui/container";
import { fullScreenSectionClass } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * Pinning is skipped on narrow screens (native swiping is better) and on
 * short ones, where a screen-height pane cannot fit a full card.
 */
const PIN_QUERY = "(min-width: 768px) and (min-height: 700px)";

type ScrollRowProps = {
  children: React.ReactNode;
  /** Describes the list for screen readers, e.g. "Latest insights". */
  label: string;
  /**
   * Take over vertical scrolling: the row stays pinned to the viewport and
   * advances sideways as the page scrolls, releasing to the next section once
   * it reaches the end. Falls back to native horizontal scrolling on small
   * screens and for `prefers-reduced-motion`.
   */
  pinned?: boolean;
  /** Rendered above the row, inside the pinned viewport. */
  header?: React.ReactNode;
  /** Rendered below the row, inside the pinned viewport. */
  footer?: React.ReactNode;
  containerSize?: React.ComponentProps<typeof Container>["size"];
  className?: string;
};

export function ScrollRow({
  children,
  label,
  pinned = false,
  header,
  footer,
  containerSize = "wide",
  className,
}: ScrollRowProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  /** The clipping window. Stays put; never transformed. */
  const viewportRef = React.useRef<HTMLDivElement>(null);
  /** The moving row. Transformed while pinned, so new cards enter the window. */
  const trackRef = React.useRef<HTMLDivElement>(null);

  /** Horizontal overflow in px — also the extra scroll height when pinned. */
  const [distance, setDistance] = React.useState(0);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  /**
   * Starts false so SSR and the first paint render the plain, natively
   * scrollable row; pinning switches on after we can measure the viewport.
   */
  const [pinActive, setPinActive] = React.useState(false);

  React.useEffect(() => {
    if (!pinned) return;
    const fits = window.matchMedia(PIN_QUERY);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinActive(fits.matches && !calm.matches);
    sync();
    fits.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fits.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, [pinned]);

  // Measure the overflow, and keep it current as the layout changes.
  React.useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    // offsetWidth, not getBoundingClientRect: unaffected by the transform.
    const measure = () =>
      setDistance(Math.max(0, track.offsetWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [pinActive]);

  // Drive the row from page scroll while pinned.
  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!pinActive || !wrapper || !track || distance <= 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Wrapper top goes negative as the sticky child holds position; that
      // travel maps 1:1 onto horizontal movement.
      const travel = -wrapper.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, travel / distance));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      track.style.transform = "";
    };
  }, [pinActive, distance]);

  /**
   * Pages for the dots, and which one is showing. Phone only — see below.
   *
   * Seeded at one card per page, which is what a phone shows, so the first
   * paint has the right number of dots. Starting at 1 would render none and
   * then drop the real row in after hydration, shifting everything under it
   * down — the arrows can start empty because they are positioned over the
   * cards and take no space, but these sit in the column.
   */
  const [pages, setPages] = React.useState(React.Children.count(children));
  const [active, setActive] = React.useState(0);

  /**
   * How many cards fit and how many pages that makes.
   *
   * Split from `syncArrows` for the same reason <SwipeRow> splits its two: this
   * half asks for the track's computed style and a card's rect, which force the
   * browser to flush layout, and none of it can change without the box
   * changing. It runs when the box does — never on a scroll.
   */
  const measurePages = React.useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = track?.children[0];
    if (!viewport || !track || !first || pinActive) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first.getBoundingClientRect().width + gap;
    const fits = step > 0 ? Math.max(1, Math.round(viewport.clientWidth / step)) : 1;

    perViewRef.current = fits;
    pagesRef.current = Math.max(1, Math.ceil(track.children.length / fits));
    setPages(pagesRef.current);
  }, [pinActive]);

  /**
   * Which arrows are live, and which dot is lit. Scroll offsets only — the
   * geometry above is already measured.
   *
   * Same arithmetic as <SwipeRow>, deliberately: these two indicators sit on
   * consecutive sections of the homepage and any difference in how they count
   * or where they land would read as a bug in one of them.
   *
   * Position as a fraction of the travel rather than from which card is
   * central, because that is the form that reaches both ends when the last
   * page is a partial one. See the note in swipe-row.tsx.
   */
  const syncArrows = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || pinActive) return;
    // 1px tolerance: fractional scroll widths never settle exactly.
    const max = viewport.scrollWidth - viewport.clientWidth;
    setAtStart(viewport.scrollLeft <= 1);
    setAtEnd(viewport.scrollLeft >= max - 1);
    setActive(
      max > 0
        ? Math.round((viewport.scrollLeft / max) * (pagesRef.current - 1))
        : 0,
    );
  }, [pinActive]);

  /** Coalesces a burst of scroll events into one update per painted frame. */
  const frameRef = React.useRef(0);
  const onViewportScroll = React.useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      syncArrows();
    });
  }, [syncArrows]);

  React.useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  /** What the last measurement found, for the dot handler below. */
  const perViewRef = React.useRef(1);
  /** And its page count, for `syncArrows` — which runs from a scroll. */
  const pagesRef = React.useRef(pages);

  /** Scrolls to the first card of a page. */
  const showPage = (page: number) => {
    const track = trackRef.current;
    if (!track) return;

    const perView = perViewRef.current;
    const index = Math.min(
      page * perView,
      Math.max(0, track.children.length - perView),
    );

    track.children[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      // The row is the only thing that should move.
      block: "nearest",
      inline: perView > 1 ? "start" : "center",
    });
  };

  /*
    Measure, then place. The page count has to be current before `syncArrows`
    maps a scroll offset onto it, and a ResizeObserver keeps it that way: it is
    the only thing that fires when the breakpoint crossing turns the row back
    into a grid, which is exactly when the count changes and no scroll happens.
  */
  React.useEffect(() => {
    measurePages();
    syncArrows();

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const observer = new ResizeObserver(() => {
      measurePages();
      syncArrows();
    });
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [measurePages, syncArrows, distance]);

  const scrollByCard = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : viewport.clientWidth * 0.8;
    viewport.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  /**
   * While pinned the row is transformed, not scrolled — but the browser still
   * scrolls the clipping window to reveal a focused card, which would desync
   * the two. Convert that drift into page scroll instead; the mapping is 1:1.
   */
  const onFocusCapture = () => {
    const viewport = viewportRef.current;
    if (!pinActive || !viewport) return;
    const drift = viewport.scrollLeft;
    if (!drift) return;
    viewport.scrollLeft = 0;
    window.scrollBy({ top: drift, behavior: "instant" });
  };

  const showArrows = !pinActive && distance > 0;

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      style={
        pinActive && distance > 0
          ? { height: `calc(100svh + ${distance}px)` }
          : undefined
      }
    >
      <div
        className={cn(
          "flex flex-col justify-center gap-5",
          pinActive
            ? "sticky top-0 h-svh overflow-hidden pt-[calc(var(--header-h)+1rem)] pb-6"
            : fullScreenSectionClass,
        )}
      >
        {header && (
          <Container size={containerSize} className="shrink-0">
            {header}
          </Container>
        )}

        {/* Relative so the arrows can sit over the row's own side margins.
            shrink-0 keeps the flex column from squeezing the cards and
            clipping their text when the viewport is short. */}
        <div
          className={cn(
            "relative mx-auto w-full shrink-0",
            containerSize === "wide" ? "max-w-[100rem]" : "max-w-7xl",
          )}
        >
          <div
            ref={viewportRef}
            onScroll={pinActive ? undefined : onViewportScroll}
            onFocusCapture={onFocusCapture}
            role="group"
            aria-label={label}
            tabIndex={pinActive ? undefined : 0}
            className={cn(
              "w-full",
              pinActive
                ? "overflow-hidden"
                : cn(
                    "no-scrollbar snap-x snap-mandatory overflow-x-auto scroll-smooth",
                    // Matches the track's leading padding, so snapping to the
                    // first card keeps that space instead of scrolling it away.
                    "scroll-pl-6 sm:scroll-pl-10 lg:scroll-pl-14",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  ),
            )}
          >
            <div
              ref={trackRef}
              className={cn(
                "flex w-max gap-8",
                // Leading and trailing padding so the first and last cards keep
                // breathing room against the window edges, at rest and at the
                // end of travel — and so an overlaid arrow lands on that
                // margin rather than on a card. Vertical room keeps the hover
                // lift and shadow from being clipped.
                "px-6 pb-8 pt-2 sm:px-10 lg:px-14",
                pinActive && "will-change-transform",
              )}
            >
              {children}
            </div>
          </div>

          {/* Siblings of the viewport, not children: inside it they would
              scroll away with the cards and be clipped by its overflow. */}
          {showArrows && (
            <>
              {/* -mt-3 centres them on the cards rather than on the wrapper:
                  the track carries more padding below than above. */}
              <CarouselArrow
                direction="left"
                disabled={atStart}
                onClick={() => scrollByCard(-1)}
                className="-mt-3 left-1 sm:left-3"
              />
              <CarouselArrow
                direction="right"
                disabled={atEnd}
                onClick={() => scrollByCard(1)}
                className="-mt-3 right-1 sm:right-3"
              />
            </>
          )}
        </div>

        {/*
          The dots, on a phone only.

          `sm:hidden` rather than a check on `pinActive`, because pinning is off
          above `sm` too whenever the screen is short or the reader has asked for
          reduced motion — and a row of dots appearing on a laptop because
          somebody turned animations down is not the behaviour anybody signed
          off. Below `sm` the row is always natively scrolled, so the dots always
          mean something there.
        */}
        {!pinActive && pages > 1 && (
          <div className="flex shrink-0 items-center justify-center gap-2 sm:hidden">
            {Array.from({ length: pages }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => showPage(index)}
                aria-label={`Show ${label}, ${index + 1} of ${pages}`}
                aria-current={index === active}
                className={cn(
                  "relative h-2 rounded-full transition-all duration-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  // Invisibly larger than it looks, so a finger can hit it —
                  // generous vertically, 4px either side so neighbours stay
                  // clear of each other across the 8px gap.
                  "after:absolute after:-inset-y-2 after:-inset-x-1 after:content-['']",
                  index === active
                    ? "w-5 bg-brand"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400",
                )}
              />
            ))}
          </div>
        )}

        {footer && (
          <Container size={containerSize} className="shrink-0">
            {footer}
          </Container>
        )}
      </div>
    </div>
  );
}
