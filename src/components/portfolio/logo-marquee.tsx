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
            {clients.map((client) => (
              <LogoTile key={`${copy}-${client.name}`} client={client} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
