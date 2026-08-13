import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { type NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Linked list of services as cards — used for a practice area's own services
 * and, on the services index, for each area's list.
 *
 * Navy at rest, brand red on hover: the cards are the substance of these pages
 * and they now carry brand colour rather than sitting as white tiles on a white
 * ground. White text throughout, so the two states differ in hue and not in
 * legibility.
 *
 * Wrapped flex rather than a grid, and centred. Three across at the widest,
 * same card width a grid would give — but a row of one or two closes centred
 * under the ones above rather than hanging off the left edge.
 */
export function ServiceList({
  services,
  className,
}: {
  services: NavItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap justify-center gap-4", className)}>
      {services.map((service) => (
        <li
          key={service.href}
          className="w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
        >
          <Link
            href={service.href}
            className={cn(
              "group flex h-full items-start gap-4 rounded-xl bg-brand-navy p-5 text-white shadow-sm ring-1 ring-brand-navy/10 transition duration-300",
              "hover:-translate-y-1 hover:bg-brand hover:shadow-lg hover:ring-2 hover:ring-brand",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            <span className="flex flex-1 items-start justify-between gap-3">
              <span className="font-semibold leading-snug tracking-tight">
                {service.label}
              </span>
              <ChevronRight
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
