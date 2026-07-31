"use client";

import * as React from "react";
import { SectionLink } from "@/components/ui/section-link";
import { ChevronDown, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LocationChips } from "@/components/layout/location-switcher";
import { SearchForm } from "@/components/layout/search-form";
import { externalLinkProps, isExternal } from "@/lib/links";
import { tenants, type Tenant } from "@/lib/tenants";
import { cn } from "@/lib/utils";
import { navigation, siteConfig, type NavItem } from "@/lib/site-config";

/**
 * Slide-in navigation for tablet and phone. Renders the same `navigation`
 * tree as the desktop nav, with nested levels as collapsible groups.
 */
export function MobileNav({ tenant }: { tenant: Tenant }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="lg:hidden"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-left text-base">Menu</SheetTitle>
        </SheetHeader>

        <div className="px-5 py-4">
          <SearchForm className="w-full" />
        </div>

        <Separator />

        <nav aria-label="Mobile" className="px-2 py-2">
          {navigation.map((item) => (
            <MobileNavNode key={item.href} item={item} onNavigate={close} />
          ))}
        </nav>

        <Separator />

        <div className="px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Region
          </p>
          <LocationChips
            tenants={tenants}
            current={tenant}
            onNavigate={close}
          />
        </div>

        <div className="px-5 pb-8">
          <Button asChild size="lg" className="w-full">
            <SectionLink href={siteConfig.cta.href} onClick={close}>
              {siteConfig.cta.label}
            </SectionLink>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** One nav row — a link, or a disclosure button when it has children. */
function MobileNavNode({
  item,
  onNavigate,
  depth = 0,
}: {
  item: NavItem;
  onNavigate: () => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const hasChildren = Boolean(item.items?.length);

  const rowClass = cn(
    "flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-neutral-100 hover:text-brand",
    depth === 0 ? "text-[15px] font-semibold" : "text-sm font-medium",
  );

  if (!hasChildren) {
    if (isExternal(item.href)) {
      return (
        <a
          href={item.href}
          {...externalLinkProps}
          onClick={onNavigate}
          className={rowClass}
          style={indent(depth)}
        >
          {item.label}
        </a>
      );
    }

    return (
      <SectionLink
        href={item.href}
        onClick={onNavigate}
        className={rowClass}
        style={indent(depth)}
      >
        {item.label}
      </SectionLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className={rowClass}
        style={indent(depth)}
      >
        {item.label}
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-brand transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="mb-1 ml-3 border-l border-neutral-200">
          {item.items?.map((child) => (
            <MobileNavNode
              key={child.href}
              item={child}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function indent(depth: number) {
  return depth > 0 ? { paddingLeft: `${0.75 + depth * 0.5}rem` } : undefined;
}
