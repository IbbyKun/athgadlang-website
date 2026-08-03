"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/webinars", label: "Webinars" },
];

/**
 * The panel's top-level navigation. A client component only because the
 * current section has to be marked, which needs the pathname.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="flex items-center gap-1">
      {links.map((link) => {
        // Overview is the root, so it would prefix-match everything.
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "bg-brand/10 text-brand"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-brand-navy",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
