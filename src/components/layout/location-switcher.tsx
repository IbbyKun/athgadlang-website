"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHoverMenu } from "@/hooks/use-hover-menu";
import { tenantLinkProps } from "@/lib/tenant-link";
import { type Tenant } from "@/lib/tenants";
import { cn } from "@/lib/utils";

type LocationSwitcherProps = {
  /** Regions to offer. */
  tenants: Tenant[];
  /** The tenant this build serves. */
  current: Tenant;
  className?: string;
};

/**
 * Region switcher. Each region is its own subdomain, so these are plain
 * cross-origin links rather than client-side routes.
 */
export function LocationSwitcher({
  tenants,
  current,
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
        {tenants.map((tenant) => {
          const isCurrent = tenant.code === current.code;
          return (
            <DropdownMenuItem
              key={tenant.code}
              asChild
              className="rounded-md px-3 py-2.5"
            >
              <a
                {...tenantLinkProps(tenant)}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-4 text-sm",
                  isCurrent && "font-semibold text-brand",
                )}
              >
                {tenant.label}
                {isCurrent && <Check aria-hidden className="size-4" />}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Region links for the mobile drawer. */
export function LocationChips({
  tenants,
  current,
  onNavigate,
}: {
  tenants: Tenant[];
  current: Tenant;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tenants.map((tenant) => {
        const { href, onClick } = tenantLinkProps(tenant);
        return (
          <a
            key={tenant.code}
            href={href}
            onClick={(event) => {
              onNavigate?.();
              onClick(event);
            }}
            aria-current={tenant.code === current.code ? "true" : undefined}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              tenant.code === current.code
                ? "border-brand bg-brand/5 text-brand"
                : "hover:border-brand hover:text-brand",
            )}
          >
            {tenant.label}
          </a>
        );
      })}
    </div>
  );
}
