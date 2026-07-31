"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { tenantCodes } from "@/lib/tenants";

/**
 * Scrolls a section into view by its position in the layout.
 *
 * Not `scrollIntoView`: a section that is pinned — the capability panels stack
 * under the header — has already been shifted to the top of the viewport, so
 * that method sees it as visible and does nothing, and clicking a panel you had
 * scrolled past would go nowhere. `offsetTop` is unaffected by pinning, so it
 * lands where the section begins whether it is above or below you.
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const target = document.getElementById(id);
  if (!target) return;

  let top = 0;
  for (
    let node: HTMLElement | null = target;
    node;
    node = node.offsetParent as HTMLElement | null
  ) {
    top += node.offsetTop;
  }

  // Whatever the section itself asks to keep clear of the header.
  const margin = Number.parseFloat(
    getComputedStyle(target).scrollMarginTop || "0",
  );

  window.scrollTo({ top: Math.max(0, top - margin), behavior });
}

/**
 * Links are written without the `[tenant]` prefix, because the proxy adds it.
 * `usePathname` reports the address bar, which has no prefix either — this only
 * guards the comparison in case a deployment ever surfaces the rewritten path.
 */
function withoutTenant(pathname: string) {
  const [, first, ...rest] = pathname.split("/");
  return (tenantCodes as string[]).includes(first)
    ? `/${rest.join("/")}` || "/"
    : pathname;
}

/**
 * A link that may point at a section of a page — "/services/tax#corporate-tax".
 *
 * Use it wherever hrefs come from `site-config`, because a nav entry there can
 * be a whole page or a section of one and the component cannot know which.
 *
 * When the target is the page we are already on, the router is bypassed. Next
 * appends the fragment to the current URL instead of replacing it once the
 * pathname stops changing, so clicking two sections in turn leaves
 * "/services/consulting#risk-advisory#business-advisory" in the address bar.
 * Setting the fragment ourselves keeps one fragment on the URL, and scrolling
 * ourselves means clicking the section you are already on takes you back to it
 * rather than doing nothing.
 */
export const SectionLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link>
>(function SectionLink({ href, onClick, ...props }, ref) {
  const pathname = usePathname();

  const target = typeof href === "string" ? href : "";
  const separator = target.indexOf("#");
  const path = separator === -1 ? target : target.slice(0, separator);
  const id = separator === -1 ? "" : target.slice(separator + 1);
  // "/#industries" carries an empty path, and its page is the homepage.
  const samePage = Boolean(id) && (path || "/") === withoutTenant(pathname);

  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      onClick={(event) => {
        onClick?.(event);

        // Leave modified clicks (new tab, new window, download) to the browser.
        if (
          !samePage ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();

        // Relative to the current URL, so this replaces the fragment rather
        // than appending to it. Re-clicking the current section should not
        // stack a second identical history entry.
        const url = `#${id}`;
        if (window.location.hash === url) {
          window.history.replaceState(null, "", url);
        } else {
          window.history.pushState(null, "", url);
        }

        // Next frame: a menu or drawer closing on this same click releases its
        // scroll lock first, which would otherwise swallow the scroll.
        requestAnimationFrame(() => scrollToSection(id));
      }}
    />
  );
});
