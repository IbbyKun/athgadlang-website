import Image from "next/image";
import Link from "next/link";

import { industryHref, type Industry } from "@/lib/industries";
import { cn } from "@/lib/utils";

/**
 * Resting tones, cycled so the grid keeps the brand's navy / stone / red
 * rhythm. Every tile converges on the same photographic hover state, which is
 * what makes the set read as one system rather than twelve coloured boxes.
 */
const tones = [
  { tile: "bg-brand-navy text-white", icon: "text-white/90" },
  { tile: "bg-neutral-100 text-brand-navy", icon: "text-brand" },
  { tile: "bg-brand text-white", icon: "text-white/90" },
] as const;

type IndustryCardProps = {
  industry: Industry;
  /** Position in the grid — drives the resting colour. */
  index: number;
  /** Columns at the widest breakpoint, so the tones offset per row. */
  columns?: number;
  sizes?: string;
  className?: string;
};

export function IndustryCard({
  industry,
  index,
  columns = 6,
  sizes = "(min-width: 1280px) 15rem, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  className,
}: IndustryCardProps) {
  // Offsetting by the row index staggers the colours into a checkerboard
  // instead of repeating the same sequence on every row.
  const tone = tones[(index + Math.floor(index / columns)) % tones.length];
  const Icon = industry.icon;

  return (
    <article
      className={cn(
        "group relative isolate flex aspect-square flex-col items-center justify-center gap-4 overflow-hidden rounded-xl p-5 text-center",
        "transition duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl focus-within:-translate-y-1 focus-within:shadow-2xl",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        tone.tile,
        className,
      )}
    >
      {/* Photograph, revealed on hover. Scales back to rest as it fades in. */}
      <Image
        src={industry.image.src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className={cn(
          "-z-20 scale-110 object-cover opacity-0 transition-all duration-700 ease-out",
          "group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100",
          "motion-reduce:transition-none",
        )}
      />
      {/* Scrim so the label stays legible over any photograph. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-brand-navy/80 opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100 group-focus-within:opacity-100",
        )}
      />

      <Icon
        aria-hidden
        strokeWidth={1.25}
        className={cn(
          "size-11 shrink-0 transition-all duration-500 ease-out",
          "group-hover:size-9 group-hover:text-white group-focus-within:size-9 group-focus-within:text-white",
          "motion-reduce:transition-none",
          tone.icon,
        )}
      />

      <h3 className="text-[0.95rem] font-bold leading-tight tracking-tight transition-colors duration-500 group-hover:text-white group-focus-within:text-white">
        <Link
          href={industryHref(industry)}
          className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-white/80"
        >
          {industry.name}
        </Link>
      </h3>
    </article>
  );
}
