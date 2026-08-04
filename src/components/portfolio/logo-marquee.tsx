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
 * How wide one copy must be before the loop is safe.
 *
 * The track is two copies translating exactly 50%, which is seamless only while
 * a single copy still covers the screen. It did not: the roster is split three
 * ways, so a row held five tiles — 1280px — and on any viewport wider than that
 * the second copy ran out before the first came back round, opening a gap at the
 * trailing edge. Repeating each row's own logos until a copy spans this width
 * fixes it without changing which logos belong to which row.
 */
const MIN_COPY_WIDTH = 3840;

/**
 * One seamless row of logos. CSS-only: the track holds two identical copies
 * and travels exactly 50%, so the loop point is invisible. Hovering anywhere
 * on the row pauses it, and reduced-motion visitors get a static row.
 */
export function LogoMarquee({
  clients,
  direction = "left",
  duration = "40s",
  label,
  className,
}: LogoMarqueeProps) {
  const repeats = Math.max(
    1,
    Math.ceil(MIN_COPY_WIDTH / Math.max(1, clients.length * TILE_PITCH)),
  );

  return (
    <div
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
        style={{ "--marquee-duration": duration } as React.CSSProperties}
        className={cn(
          "flex w-max",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
          "group-hover:[animation-play-state:paused]",
          // Without motion, fall back to a plain row that can be scrolled.
          "motion-reduce:animate-none",
        )}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            // The trailing pr matches the inner gap, so one copy's width is
            // exactly half the track — that is what keeps the seam invisible.
            aria-hidden={copy === 1}
            className="flex shrink-0 gap-4 pr-4"
          >
            {Array.from({ length: repeats }).map((_, repeat) =>
              clients.map((client) => (
                <LogoTile
                  key={`${copy}-${repeat}-${client.name}`}
                  client={client}
                />
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
