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

  const syncArrows = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || pinActive) return;
    // 1px tolerance: fractional scroll widths never settle exactly.
    const max = viewport.scrollWidth - viewport.clientWidth;
    setAtStart(viewport.scrollLeft <= 1);
    setAtEnd(viewport.scrollLeft >= max - 1);
  }, [pinActive]);

  React.useEffect(syncArrows, [syncArrows, distance]);

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
            onScroll={pinActive ? undefined : syncArrows}
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

        {footer && (
          <Container size={containerSize} className="shrink-0">
            {footer}
          </Container>
        )}
      </div>
    </div>
  );
}
