"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavDropdown, navTriggerClass } from "@/components/layout/nav-dropdown";
import { externalLinkProps, isExternal } from "@/lib/links";
import { navigation } from "@/lib/site-config";

/** Marks "/" only on exact match, section links on any nested route. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden h-full items-center gap-8 lg:flex">
      {navigation.map((item) =>
        item.items?.length ? (
          <NavDropdown
            key={item.href}
            label={item.label}
            href={item.href}
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
