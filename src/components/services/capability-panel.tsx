import Image from "next/image";

import { capabilityImage, type ServiceCapability } from "@/lib/services";
import { cn } from "@/lib/utils";

/**
 * One capability as a full-bleed split: half tinted panel, half photograph.
 * Panels alternate side and tone down the page — navy with the image right,
 * then brand red with the image left — which gives a long list of capabilities
 * a rhythm instead of a scroll of identical blocks.
 *
 * The image half crops to roughly a square on wide screens, so the artwork in
 * `serviceCapabilityImages` is chosen to survive that crop.
 */
export function CapabilityPanel({
  capability,
  index,
}: {
  capability: ServiceCapability;
  index: number;
}) {
  const image = capabilityImage(capability);
  /** Odd panels put the image on the left and tint the panel brand red. */
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <section
      id={capability.slug}
      aria-labelledby={`${capability.slug}-title`}
      className="scroll-mt-(--header-h) grid lg:grid-cols-2"
    >
      {/* Image first in the DOM, so the stacked mobile layout leads with it. */}
      <div
        className={cn(
          "relative min-h-64 sm:min-h-80 lg:min-h-[30rem]",
          flipped ? "lg:order-1" : "lg:order-2",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className={cn(
          "flex flex-col justify-center gap-5 px-6 py-14 sm:px-10 lg:px-14 lg:py-16",
          flipped ? "bg-brand lg:order-2" : "bg-brand-navy lg:order-1",
        )}
      >
        <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-white/70">
          <span aria-hidden className="h-0.5 w-8 bg-white/50" />
          {number}
        </p>

        <h3
          id={`${capability.slug}-title`}
          className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
        >
          {capability.title}
        </h3>

        <p className="max-w-xl text-pretty text-base leading-relaxed text-white/80">
          {capability.description}
        </p>
      </div>
    </section>
  );
}
