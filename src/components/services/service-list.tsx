import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { type NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Linked list of services as cards — used for a practice area's own services
 * and, on the services index, for each area's list. Numbered so a long list
 * still reads as a set, and it carries the same red hover edge as the article
 * and webinar cards.
 */
export function ServiceList({
  services,
  className,
}: {
  services: NavItem[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {services.map((service, index) => (
        <li key={service.href}>
          <Link
            href={service.href}
            className={cn(
              // shadow-sm at rest, so the card lifts off a white ground too.
              "group flex h-full items-start gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 transition duration-300",
              "hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-brand",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            <span
              aria-hidden
              className="text-sm font-semibold tracking-[0.14em] text-neutral-500 transition-colors group-hover:text-brand"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="flex flex-1 items-start justify-between gap-3">
              <span className="font-semibold leading-snug tracking-tight text-brand-navy transition-colors group-hover:text-brand">
                {service.label}
              </span>
              <ChevronRight
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
