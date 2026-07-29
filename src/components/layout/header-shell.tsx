"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Scroll distance before the bar detaches. */
const THRESHOLD = 24;

/**
 * Chrome for the site header: a full-width bar at rest that detaches into a
 * floating, blurred card once the page scrolls.
 *
 * The <header> keeps a constant `--header-h` height in flow, so detaching
 * never reflows the page — the inner card shrinks and insets within that band
 * instead. The top strip is left transparent and click-through, which is what
 * makes it read as floating.
 *
 * Exposes `data-scrolled` so content inside can react (see the logo).
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > THRESHOLD);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Initial read happens in a frame, not synchronously, so a page restored
    // mid-scroll starts in the right state.
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      id="top"
      data-scrolled={scrolled || undefined}
      className="group/header pointer-events-none sticky top-0 z-50 h-(--header-h) w-full"
    >
      <div
        className={cn(
          "flex h-full w-full transition-[padding] duration-500 ease-out motion-reduce:transition-none",
          scrolled && "px-3 pt-3 sm:px-6 sm:pt-4 lg:px-10",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex w-full items-center transition-all duration-500 ease-out motion-reduce:transition-none",
            scrolled
              ? "h-16 rounded-2xl border border-brand bg-white/80 shadow-xl shadow-neutral-900/10 backdrop-blur-xl"
              : "h-full border-b border-neutral-200 bg-white",
          )}
        >
          {children}
        </div>
      </div>
    </header>
  );
}
