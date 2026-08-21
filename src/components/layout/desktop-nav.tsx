"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavDropdown, navTriggerClass } from "@/components/layout/nav-dropdown";
import { externalLinkProps, isExternal } from "@/lib/links";
import { navigationFor } from "@/lib/site-config";
import { type TenantCode } from "@/lib/tenants";

/** Marks "/" only on exact match, section links on any nested route. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * The region comes in as a code rather than a filtered tree: this is a Client
 * Component, and the Services entries carry a description, a card and a
 * portrait reference that would all be serialised into the page payload. The
 * tree is already in this bundle, so it is cheaper to narrow it here.
 */
export function DesktopNav({ region }: { region: TenantCode }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden h-full items-center gap-8 lg:flex">
      {navigationFor(region).map((item) =>
        item.items?.length ? (
          <NavDropdown
            key={item.href}
            label={item.label}
            href={item.menuOnly ? undefined : item.href}
            items={item.items}
            active={isActive(pathname, item.href)}
          />
        ) : isExternal(item.href) ? (
          <a
            key={item.href}
            href={item.href}
            {...externalLinkProps}
            className={navTriggerClass()}
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className={navTriggerClass(isActive(pathname, item.href))}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
