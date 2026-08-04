import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Client } from "@/lib/clients";

type LogoTileProps = {
  client: Client;
  className?: string;
};

/**
 * One card in the logo gallery.
 *
 * White, not brand red. The tile used to be red and invert to white on hover,
 * which worked while every name was set in type we controlled — but a client's
 * logo is not ours to recolour, and the supplied marks are full colour on white.
 * A colour logo on red is unreadable, a knockout on white is invisible, and no
 * single file survives both states.
 *
 * The logo is constrained in both directions. Capping height alone let the wide
 * marks — Al Habtoor, CitrussTV, Pink Camel — run past the edges of the card.
 * Every file is delivered on one canvas at four times the display size, so the
 * set sits at a consistent optical weight instead of each logo being as large as
 * its own aspect ratio allows.
 *
 * A client with no logo file still gets a typographic wordmark, so the roster
 * never shows a stand-in image in place of a real mark.
 */
export function LogoTile({ client, className }: LogoTileProps) {
  return (
    <div
      className={cn(
        "group/tile grid h-24 w-52 shrink-0 place-items-center rounded-xl bg-white px-6 shadow-lg sm:h-28 sm:w-60",
        "ring-1 ring-white/15 transition duration-300 ease-out",
        // Lifts and takes a brand edge, rather than changing colour underneath
        // a logo that is sitting on it.
        "hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-brand",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {client.logo ? (
        <Image
          src={client.logo}
          alt={client.name}
          width={384}
          height={112}
          /*
            Served as-is. `sizes` made the browser pick the 256px entry from the
            srcset for a 192px-wide box, so every logo was resampled 256 -> 192 —
            a non-integer downscale, which is what made the flat-colour marks
            look soft. These files are already exactly twice the display size:
            pixel-for-pixel on a retina screen, a clean halving on a 1x one, and
            around 19 KB each, which is smaller than the optimiser's output.
          */
          unoptimized
          className="max-h-14 w-auto max-w-full object-contain transition-transform duration-300 group-hover/tile:scale-105 motion-reduce:transition-none"
        />
      ) : (
        <span
          className={cn(
            "text-center font-bold leading-tight tracking-tight text-brand-navy transition-colors duration-300",
            "group-hover/tile:text-brand",
            client.name.length > 16 ? "text-sm" : "text-lg",
          )}
        >
          {client.name}
        </span>
      )}
    </div>
  );
}
