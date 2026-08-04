"use client";

import * as React from "react";

import { LogoTile } from "@/components/portfolio/logo-tile";
import { cn } from "@/lib/utils";
import type { Client } from "@/lib/clients";

type LogoMarqueeProps = {
  clients: Client[];
  /** Scroll direction of this row. */
  direction?: "left" | "right";
  /** One full loop, e.g. "40s". Vary per row so rows do not march in step. */
  duration?: string;
  /** Announced to screen readers in place of the duplicated tiles. */
  label: string;
  className?: string;
};

/** A tile plus the gap after it, at `sm` and above. */
const TILE_PITCH = 256;

/**
 * How much track has to be waiting off the trailing edge at any moment.
 *
 * Wider than any viewport this site will realistically meet. Getting it wrong
 * shows up as the row running out and visibly restarting.
 */
const MIN_COVERAGE = 2560;

/**
 * One seamless row of logos.
 *
 * The track holds N copies and travels exactly one copy's width, so the loop
 * point is invisible. N is worked out from the row's own content rather than
 * fixed at two: two copies shifting 50% leaves only one copy's width of track
 * ahead of the screen, and this roster splits three ways, so a row held five
 * tiles — 1280px — and every viewport wider than that saw the row run out.
 *
 * Copies, rather than repeating tiles inside one copy. Reaching the same
 * coverage by repetition took thirty tiles a row; this takes fifteen, and every
 * tile is an image the browser has to raster while the row moves.
 *
 * The animation stops while the row is off screen. A CSS animation runs whether
 * or not anyone can see it, and three tracks a few thousand pixels wide are
 * enough compositor work to be felt as roughness when scrolling elsewhere.
 */
export function LogoMarquee({
  clients,
  direction = "left",
  duration = "40s",
  label,
  className,
}: LogoMarqueeProps) {
  const [visible, setVisible] = React.useState(false);
  const row = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = row.current;
    if (!node) return;

    // A browser without IntersectionObserver keeps the static strip of logos,
    // which is the same thing a reduced-motion visitor sees.
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Margin, so the row is already moving by the time it is scrolled into
      // view rather than visibly starting from rest.
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const copyWidth = Math.max(1, clients.length * TILE_PITCH);
  // One copy is on screen; the coverage has to come from the others.
  const copies = Math.max(2, Math.ceil(MIN_COVERAGE / copyWidth) + 1);

  return (
    <div
      ref={row}
      role="group"
      aria-label={label}
      className={cn(
        "group relative overflow-hidden",
        // Fade the ends so tiles enter and leave rather than being cut off.
        "[mask-image:linear-gradient(to_right,transparent,black_5rem,black_calc(100%-5rem),transparent)]",
        className,
      )}
    >
      <div
        style={
          {
            "--marquee-duration": duration,
            "--marquee-shift": `-${100 / copies}%`,
          } as React.CSSProperties
        }
        className={cn(
          "flex w-max",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
          "group-hover:[animation-play-state:paused]",
          // Off screen it is a static strip of logos.
          !visible && "[animation-play-state:paused]",
          // Without motion, fall back to a plain row that can be scrolled.
          "motion-reduce:animate-none",
        )}
      >
        {Array.from({ length: copies }).map((_, copy) => (
          <div
            key={copy}
            // The trailing pr matches the inner gap, so each copy is exactly one
            // share of the track — that is what keeps the seam invisible.
            aria-hidden={copy > 0}
            className="flex shrink-0 gap-4 pr-4"
          >
            {clients.map((client) => (
              <LogoTile key={`${copy}-${client.name}`} client={client} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
