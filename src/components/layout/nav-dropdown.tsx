"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

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
    "relative inline-flex h-(--header-h) items-center gap-1.5 text-[15px] font-semibold tracking-tight transition-colors outline-none",
    "after:absolute after:inset-x-0 after:bottom-5 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand after:transition-transform after:duration-200",
    "hover:text-brand hover:after:scale-x-100 focus-visible:text-brand",
    active ? "text-brand after:scale-x-100" : "text-neutral-800",
  );
}

type NavDropdownProps = {
  label: React.ReactNode;
  items: NavItem[];
  active?: boolean;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
};

/**
 * Top-nav dropdown. Supports one level of nesting via `items[].items`,
 * which is what the Services flyout uses.
 */
export function NavDropdown({
  label,
  items,
  active,
  className,
  contentClassName,
  align = "start",
}: NavDropdownProps) {
  const { open, setOpen, hoverProps } = useHoverMenu();

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        {...hoverProps}
        className={cn("group", navTriggerClass(active || open), className)}
      >
        {label}
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        {...hoverProps}
        align={align}
        sideOffset={0}
        className={cn("min-w-64 p-2", contentClassName)}
      >
        {items.map((item) =>
          item.items?.length ? (
            <DropdownMenuSub key={item.href}>
              {/* SubTrigger renders its own trailing chevron. */}
              <DropdownMenuSubTrigger className="gap-8 rounded-md px-3 py-2.5 text-sm font-semibold data-[state=open]:text-brand">
                {item.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-60 p-2">
                <DropdownMenuItem asChild className="rounded-md px-3 py-2.5">
                  <Link href={item.href} className="text-sm font-semibold">
                    All {item.label}
                  </Link>
                </DropdownMenuItem>
                {item.items.map((child) => (
                  <DropdownMenuItem
                    key={child.href}
                    asChild
                    className="rounded-md px-3 py-2.5"
                  >
                    <Link href={child.href} className="text-sm">
                      {child.label}
                    </Link>
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
              <Link href={item.href} className="text-sm font-medium">
                {item.label}
              </Link>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
