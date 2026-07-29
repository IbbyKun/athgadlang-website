import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { insightHref, type Insight } from "@/lib/insights";

type InsightCardProps = {
  insight: Insight;
  sizes?: string;
  className?: string;
};

/**
 * Article card for the insights carousel: image on top, meta, title, excerpt.
 * On hover the card lifts, the photo scales, and the title takes brand red.
 *
 * Single stretched link, as with ServiceCard — "Read more" is decoration.
 */
export function InsightCard({
  insight,
  sizes = "(min-width: 1280px) 22rem, (min-width: 640px) 20rem, 82vw",
  className,
}: InsightCardProps) {
  return (
    <article
      className={cn(
        "group relative flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white",
        "ring-1 ring-neutral-200 shadow-sm transition duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-xl hover:ring-neutral-300",
        "focus-within:-translate-y-1.5 focus-within:shadow-xl",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "sm:w-80 xl:w-[22rem]",
        className,
      )}
    >
      <div className="relative aspect-[2/1] shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={insight.image.src}
          alt={insight.image.alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            "group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none",
          )}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
          {insight.category}
          <span aria-hidden className="size-1 rounded-full bg-neutral-300" />
          <time
            dateTime={insight.date}
            className="font-medium normal-case tracking-normal text-neutral-500"
          >
            {formatDate(insight.date)}
          </time>
        </p>

        <h3
          className={cn(
            "line-clamp-3 text-base font-bold leading-snug tracking-tight text-brand-navy",
            "transition-colors duration-300 group-hover:text-brand",
          )}
        >
          <Link
            href={insightHref(insight)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {insight.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">
          {insight.excerpt}
        </p>

        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-brand"
        >
          Read more
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
