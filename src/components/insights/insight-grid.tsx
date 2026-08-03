"use client";

import * as React from "react";

import { InsightCard } from "@/components/cards/insight-card";
import { ViewMoreButton } from "@/components/ui/view-more-button";
import { insights as allInsights, type Insight } from "@/lib/insights";
import { cn } from "@/lib/utils";

type InsightGridProps = {
  items?: Insight[];
  /** Cards added per "View More" — one full row on wide screens is four. */
  pageSize?: number;
  className?: string;
};

/**
 * The insights index: four cards a row, revealed a page at a time so a long
 * archive never renders in one go.
 *
 * Client-side batching is the placeholder for real pagination: when the
 * articles come from a CMS, keep this component's shape and swap the `slice`
 * for a fetch of the next page — `shown` becomes the offset, `pageSize` the
 * limit, and `hasMore` comes from the response rather than the array length.
 */
export function InsightGrid({
  items = allInsights,
  pageSize = 8,
  className,
}: InsightGridProps) {
  const [shown, setShown] = React.useState(pageSize);

  const visible = items.slice(0, shown);
  const hasMore = shown < items.length;

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((insight) => (
          <InsightCard key={insight.slug} insight={insight} layout="grid" />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Announced on load, so the extra cards are not a silent change. */}
        <p
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-neutral-500"
        >
          Showing {visible.length} of {items.length} articles
        </p>

        {hasMore && (
          <ViewMoreButton
            onClick={() => setShown((count) => count + pageSize)}
          />
        )}
      </div>
    </div>
  );
}
