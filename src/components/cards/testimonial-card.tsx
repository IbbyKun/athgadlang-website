import { Quote, Star } from "lucide-react";

import { initials, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

/**
 * Landscape testimonial card: attribution rail on the left, quote on the
 * right, divided by a rule. On hover the card lifts, the rail's avatar fills
 * with brand red, the name follows, and the quote glyph deepens.
 */
export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "group flex flex-col gap-5 rounded-2xl bg-white p-6 sm:flex-row sm:gap-7 sm:p-7",
        "shadow-sm ring-1 ring-neutral-200 transition duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-xl hover:ring-brand/30",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <figcaption
        className={cn(
          "flex shrink-0 flex-col gap-3",
          "sm:w-44 sm:border-r sm:border-neutral-200 sm:pr-7",
          "transition-colors duration-300 sm:group-hover:border-brand/25",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "grid size-11 place-items-center rounded-full bg-brand-navy/5 text-sm font-bold text-brand-navy",
            "transition-colors duration-300 group-hover:bg-brand group-hover:text-white",
          )}
        >
          {initials(testimonial.name)}
        </span>

        <span className="flex flex-col gap-0.5">
          <span className="text-[0.95rem] font-bold leading-tight tracking-tight text-brand-navy transition-colors duration-300 group-hover:text-brand">
            {testimonial.name}
          </span>
          <span className="text-xs leading-snug text-neutral-500">
            {testimonial.role}
          </span>
          {testimonial.company && (
            <span className="text-xs leading-snug text-neutral-500">
              {testimonial.company}
            </span>
          )}
        </span>

        <Rating value={testimonial.rating} />
      </figcaption>

      <blockquote className="relative flex-1">
        <Quote
          aria-hidden
          className={cn(
            "absolute -top-1 left-0 size-8 fill-current text-brand/10",
            "transition-colors duration-300 group-hover:text-brand/25",
          )}
        />
        <p className="relative text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
          {testimonial.quote}
        </p>
      </blockquote>
    </figure>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span
      className="mt-auto flex items-center gap-0.5"
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
