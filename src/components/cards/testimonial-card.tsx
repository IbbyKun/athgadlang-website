import Image from "next/image";
import { Star } from "lucide-react";

import { initials, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

/**
 * Testimonial card: attribution stacked above the quote, the two divided by a
 * rule.
 *
 * Stacked rather than the landscape split this started as. Inside a centred
 * carousel there is one card on screen at a time, so the quote reads better
 * across the card's full width than in a column beside the name — and the
 * name, position and rating make more sense read downwards as one block.
 *
 * On hover the card lifts, the avatar fills with brand red and the name
 * follows it.
 */
export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "group flex w-full flex-col gap-4 rounded-2xl bg-white p-6 text-left sm:p-8",
        "shadow-sm ring-1 ring-neutral-200 transition duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-xl hover:ring-brand/30",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <figcaption className="flex flex-col gap-3">
        {/* Photo and name, on one row — initials until a headshot is supplied. */}
        <span className="flex items-center gap-3">
          {testimonial.image ? (
            <Image
              src={testimonial.image.src}
              alt={testimonial.image.alt}
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-full object-cover ring-1 ring-neutral-200"
            />
          ) : (
            <span
              aria-hidden
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full bg-brand-navy/5 text-sm font-bold text-brand-navy",
                "transition-colors duration-300 group-hover:bg-brand group-hover:text-white",
              )}
            >
              {initials(testimonial.name)}
            </span>
          )}

          <span className="text-base font-bold leading-tight tracking-tight text-brand-navy transition-colors duration-300 group-hover:text-brand">
            {testimonial.name}
          </span>
        </span>

        {/* Position, then the rating beneath it. */}
        <span className="flex flex-col gap-1.5">
          <span className="text-xs leading-snug text-neutral-500">
            {testimonial.role}
            {testimonial.company && ` · ${testimonial.company}`}
          </span>

          <Rating value={testimonial.rating} />
        </span>
      </figcaption>

      {/* The rule between the attribution and the quote. */}
      <span
        aria-hidden
        className="h-px w-full bg-neutral-200 transition-colors duration-300 group-hover:bg-brand/25"
      />

      <blockquote>
        <p className="text-pretty text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
          {testimonial.quote}
        </p>
      </blockquote>
    </figure>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-3.5",
            index < value
              ? "fill-amber-400 text-amber-400"
              : "fill-neutral-200 text-neutral-200",
          )}
        />
      ))}
    </span>
  );
}
