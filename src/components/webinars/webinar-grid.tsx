"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { WebinarCard } from "@/components/cards/webinar-card";
import { Button } from "@/components/ui/button";
import { webinars as allWebinars, type Webinar } from "@/lib/webinars";
import { cn } from "@/lib/utils";

type WebinarGridProps = {
  items?: Webinar[];
  /** Cards added per "View More" — one full row on wide screens is four. */
  pageSize?: number;
  className?: string;
};

/**
 * The webinar library: four cards a row, revealed a page at a time so a long
 * catalogue never renders in one go.
 *
 * Same shape as <InsightGrid>, and the same pagination seam: when the sessions
 * come from a CMS or playlist query, swap the `slice` for a fetch of the next
 * page — `shown` becomes the offset and `pageSize` the limit.
 */
export function WebinarGrid({
  items = allWebinars,
  pageSize = 8,
  className,
}: WebinarGridProps) {
  const [shown, setShown] = React.useState(pageSize);

  const visible = items.slice(0, shown);
  const hasMore = shown < items.length;

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((webinar) => (
          <WebinarCard key={webinar.slug} webinar={webinar} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Announced on load, so the extra cards are not a silent change. */}
        <p
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-neutral-500"
        >
          Showing {visible.length} of {items.length} sessions
        </p>

        {hasMore && (
          <Button
            size="lg"
            className="rounded-lg"
            onClick={() => setShown((count) => count + pageSize)}
          >
            View More
            <ChevronDown className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
