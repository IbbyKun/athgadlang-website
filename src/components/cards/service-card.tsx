import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig, type NavItem } from "@/lib/site-config";

type ServiceCardProps = {
  service: NavItem;
  /** Trading name, substituted into the supplied copy's `{brand}`. */
  brand?: string;
  /** Passed to next/image for correct srcset selection. */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Full-bleed image card. At rest only the title shows, bottom-left. On hover
 * or keyboard focus the image dims and the title slides up to reveal the
 * description and a Read More affordance.
 *
 * The whole card is one link — the stretched pseudo-element on the title
 * covers it, so "Read More" stays decorative and the card has a single
 * tab stop.
 */
export function ServiceCard({
  service,
  brand = siteConfig.name,
  sizes = "(min-width: 1280px) 22vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
}: ServiceCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex min-h-96 overflow-hidden rounded-2xl bg-neutral-900 shadow-sm ring-1 ring-neutral-900/5",
        "transition-shadow duration-500 hover:shadow-2xl focus-within:shadow-2xl",
        className,
      )}
    >
      {service.image && (
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "-z-10 object-cover transition-transform duration-700 ease-out",
            "group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none",
          )}
        />
      )}

      {/* Resting scrim: keeps the title legible on any photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/90 via-neutral-950/35 to-neutral-950/5"
      />
      {/* Hover scrim: dims the whole image so the revealed copy reads cleanly. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-neutral-950/55 opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
        )}
      />

      <div className="mt-auto flex w-full flex-col p-6">
        <h3 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
          <Link
            href={service.href}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-white/80"
          >
            {service.label}
          </Link>
        </h3>

        {/* 0fr → 1fr animates the height, which slides the title upward. */}
        <div
          className={cn(
            "grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out",
            "group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] motion-reduce:transition-none",
          )}
        >
          <div className="overflow-hidden">
            {/* The supplied promise line, then its paragraph. Falls back to the
                functional description for anything without supplied copy. */}
            {service.card && (
              <p
                className={cn(
                  "pt-3 text-sm font-semibold leading-snug text-white opacity-0 transition-opacity duration-300",
                  "group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
                )}
              >
                {service.card.tagline}
              </p>
            )}

            <p
              className={cn(
                "pt-3 text-sm leading-relaxed text-white/85 opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
              )}
            >
              {service.card
                ? service.card.body.replace("{brand}", brand)
                : service.description}
            </p>

            <span
              aria-hidden
              className={cn(
                "mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white",
                "opacity-0 transition-[opacity,background-color] duration-300",
                "group-hover:opacity-100 group-focus-within:opacity-100 group-hover:bg-brand-hover",
                "motion-reduce:transition-none",
              )}
            >
              Read More
              <ChevronRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
