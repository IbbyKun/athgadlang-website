"use client";

import * as React from "react";
import { SectionLink } from "@/components/ui/section-link";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHoverMenu } from "@/hooks/use-hover-menu";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/site-config";

/** Shared look for a top-level nav trigger — plain link or dropdown alike. */
export function navTriggerClass(active?: boolean) {
  return cn(
    // h-full, not the header height: the bar shrinks when it floats.
    "relative inline-flex h-full items-center gap-1.5 text-[15px] font-semibold tracking-tight transition-colors outline-none",
    "after:absolute after:inset-x-0 after:bottom-4 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-200",
    "hover:text-brand hover:after:scale-x-100 focus-visible:text-brand",
    active ? "text-brand after:scale-x-100" : "text-neutral-800",
  );
}

type NavDropdownProps = {
  label: React.ReactNode;
  /**
   * The page the label itself points at. Omitted where the entry only opens a
   * menu, and then the trigger is a button rather than a link.
   */
  href?: string;
  items: NavItem[];
  active?: boolean;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
};

/**
 * Top-nav dropdown. Supports one level of nesting via `items[].items`,
 * which is what the Services flyout uses.
 *
 * Every row is a link, including the ones that open something. A practice area
 * has a page of its own, and so does "Services" — a row that only reveals more
 * rows leaves those pages reachable from nowhere in the nav. Hover opens the
 * panel, a click follows the link, and the keyboard gets both: Enter navigates,
 * the arrow keys walk the menu.
 */
export function NavDropdown({
  label,
  href,
  items,
  active,
  className,
  contentClassName,
  align = "start",
}: NavDropdownProps) {
  const { open, setOpen, hoverProps } = useHoverMenu();

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild {...hoverProps}>
        {href ? (
          <SectionLink
            href={href}
            className={cn("group", navTriggerClass(active || open), className)}
          >
            {label}
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </SectionLink>
        ) : (
          <button
            type="button"
            className={cn("group", navTriggerClass(active || open), className)}
          >
            {label}
            <ChevronDown
              aria-hidden
              className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        {...hoverProps}
        align={align}
        sideOffset={0}
        // w-max overrides the base width, which is pinned to the trigger:
        // "Services" is a narrow trigger, so the panel would otherwise wrap
        // its longest label over three lines.
        className={cn("w-max min-w-64 p-2", contentClassName)}
      >
        {items.map((item) =>
          item.items?.length ? (
            <DropdownMenuSub key={item.href}>
              {/* asChild, so the row is a link and not just a button that
                  opens the flyout. That also makes the trailing chevron ours
                  to draw — see DropdownMenuSubTrigger. */}
              <DropdownMenuSubTrigger
                asChild
                className="gap-8 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold data-[state=open]:text-brand"
              >
                <SectionLink href={item.href}>
                  {item.label}
                  <ChevronRight aria-hidden className="ml-auto size-4" />
                </SectionLink>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-60 p-2">
                {item.items.map((child) => (
                  <DropdownMenuItem
                    key={child.href}
                    asChild
                    className="rounded-md px-3 py-2.5"
                  >
                    <SectionLink href={child.href} className="whitespace-nowrap text-sm">
                      {child.label}
                    </SectionLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="rounded-md px-3 py-2.5"
            >
              <SectionLink href={item.href} className="whitespace-nowrap text-sm font-medium">
                {item.label}
              </SectionLink>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
