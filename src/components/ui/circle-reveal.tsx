"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Below this, the pair renders as two ordinary sections. */
const QUERY = "(min-width: 768px) and (min-height: 700px)";

type CircleRevealProps = {
  /** Stays in place, and is revealed from. */
  base: React.ReactNode;
  /** Appears inside the growing circle. */
  reveal: React.ReactNode;
  /**
   * Screens of scrolling the reveal occupies. One screen means the circle
   * opens over roughly one full page-down.
   */
  screens?: number;
  className?: string;
};

/**
 * Pins two full-screen sections on top of each other and opens the upper one
 * through a circle growing from the centre, driven by scroll position.
 *
 * Both sections must fit one viewport — the pane clips anything taller. Falls
 * back to plain stacked sections on small screens and for reduced motion,
 * which is also what the server renders.
 */
export function CircleReveal({
  base,
  reveal,
  screens = 1,
  className,
}: CircleRevealProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const layerRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const fits = window.matchMedia(QUERY);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setActive(fits.matches && !calm.matches);
    sync();
    fits.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fits.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const layer = layerRef.current;
    if (!active || !wrapper || !layer) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      // Pinned travel: how far the wrapper can move before the pane releases.
      const range = wrapper.offsetHeight - window.innerHeight;
      if (range <= 0) return;

      const travelled = -wrapper.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, travelled / range));

      // Radius that reaches the furthest corner from the centre.
      const max = Math.hypot(window.innerWidth, window.innerHeight) / 2;
      // Squared, so it holds as a small dot before opening out quickly.
      const radius = max * progress * progress;

      layer.style.clipPath = `circle(${radius.toFixed(1)}px at 50% 50%)`;
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
      layer.style.clipPath = "";
    };
  }, [active]);

  if (!active) {
    return (
      <>
        {base}
        {reveal}
      </>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      style={{ height: `calc(${screens + 1} * 100svh)` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0">{base}</div>
        <div
          ref={layerRef}
          // Starts closed, so the base section is what shows first.
          style={{ clipPath: "circle(0px at 50% 50%)" }}
          className="absolute inset-0 will-change-[clip-path]"
        >
          {reveal}
        </div>
      </div>
    </div>
  );
}
