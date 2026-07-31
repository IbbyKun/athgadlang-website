import Image from "next/image";
import { Check } from "lucide-react";

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
  stacked = false,
  className,
}: {
  capability: ServiceCapability;
  index: number;
  /** Inside <CapabilityStack>: fill the card it runs through, and let long copy
   *  scroll within its own half rather than run off the foot of it. */
  stacked?: boolean;
  className?: string;
}) {
  const image = capabilityImage(capability);
  /** Odd panels put the image on the left and tint the panel brand red. */
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const paragraphs = Array.isArray(capability.description)
    ? capability.description
    : [capability.description];

  return (
    <section
      id={capability.slug}
      aria-labelledby={`${capability.slug}-title`}
      className={cn(
        "grid lg:grid-cols-2",
        // Inside the card the anchor has to clear the card's own top edge, so
        // the stack sets this instead.
        !stacked && "scroll-mt-(--header-h)",
        className,
      )}
    >
      {/* Image first in the DOM, so the stacked mobile layout leads with it. */}
      <div
        className={cn(
          "relative min-h-64 sm:min-h-80 lg:min-h-[30rem]",
          // In the card the panel is exactly one card tall, so the image half
          // must not insist on a height of its own — a floor taller than the
          // card would push the panel past it and break the scroll mapping.
          stacked && "lg:min-h-0",
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
          // A pinned panel cannot grow, so the longest copy scrolls in place
          // rather than running off the foot of the card.
          stacked && "lg:overflow-y-auto",
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

        <div className="flex max-w-xl flex-col gap-4">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-pretty text-base leading-relaxed text-white/80"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* What the client gets — sentences, so a list rather than chips. */}
        {capability.points && capability.points.length > 0 && (
          <ul className="flex flex-col gap-2">
            {capability.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-base leading-relaxed text-white/85"
              >
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-white" />
                {point}
              </li>
            ))}
          </ul>
        )}

        {/* Named sub-services, where the practice lists them. */}
        {capability.items && capability.items.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {capability.items.map((item) => (
              <li
                key={item}
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
