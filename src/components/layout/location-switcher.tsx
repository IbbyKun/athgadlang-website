"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHoverMenu } from "@/hooks/use-hover-menu";
import { cn } from "@/lib/utils";
import { defaultLocation, locations, type Location } from "@/lib/site-config";

type LocationSwitcherProps = {
  /**
   * Currently active location. Wire this to the route segment / locale
   * once regional pages exist; it falls back to the first configured office.
   */
  current?: Location;
  className?: string;
};

export function LocationSwitcher({
  current = defaultLocation,
  className,
}: LocationSwitcherProps) {
  const { open, setOpen, hoverProps } = useHoverMenu();

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        {...hoverProps}
        aria-label={`Region: ${current.label}. Change region`}
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-800 outline-none transition-colors",
          "hover:bg-brand/5 hover:text-brand focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-brand/5 text-brand",
          className,
        )}
      >
        {current.label}
        <ChevronDown
          aria-hidden
          className="size-4 text-brand transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        {...hoverProps}
        align="end"
        sideOffset={10}
        className="min-w-44 p-2"
      >
        {locations.map((location) => {
          const isCurrent = location.code === current.code;
          return (
            <DropdownMenuItem
              key={location.code}
              asChild
              className="rounded-md px-3 py-2.5"
            >
              <Link
                href={location.href}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-4 text-sm",
                  isCurrent && "font-semibold text-brand",
                )}
              >
                {location.label}
                {isCurrent && <Check aria-hidden className="size-4" />}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
