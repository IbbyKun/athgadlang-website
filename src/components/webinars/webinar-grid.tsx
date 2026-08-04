"use client";

import * as React from "react";

import { moreWebinars } from "@/app/actions/content";
import { WebinarCard } from "@/components/cards/webinar-card";
import { ViewMoreButton } from "@/components/ui/view-more-button";
import type { Webinar } from "@/lib/webinars";
import { cn } from "@/lib/utils";

type WebinarGridProps = {
  /** The first page, rendered on the server. */
  items: Webinar[];
  /** How many there are in total, so the counter and the button are honest. */
  total: number;
  /** Which region to ask for the next page of. */
  region: string;
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
  items,
  total,
  region,
  pageSize = 8,
  className,
}: WebinarGridProps) {
  const [visible, setVisible] = React.useState(items);
  const [loading, setLoading] = React.useState(false);

  // A new first page — a fresh publish arriving through a router refresh —
  // resets what has been revealed. Adjusted during render rather than in an
  // effect: React re-runs this pass immediately with the new state, so the
  // stale cards never reach the DOM.
  const [rendered, setRendered] = React.useState(items);
  if (rendered !== items) {
    setRendered(items);
    setVisible(items);
  }

  const hasMore = visible.length < total;

  async function showMore() {
    if (loading) return;
    setLoading(true);

    try {
      const next = await moreWebinars(region, visible.length, pageSize);
      // Appended by slug rather than blindly, so a page that overlaps — a
      // publish between requests shifts the offsets — cannot duplicate a card.
      setVisible((current) => {
        const seen = new Set(current.map((item) => item.slug));
        return [...current, ...next.filter((item) => !seen.has(item.slug))];
      });
    } finally {
      setLoading(false);
    }
  }

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
          Showing {visible.length} of {total} sessions
        </p>

        {hasMore && (
          <ViewMoreButton onClick={showMore} loading={loading} />
        )}
      </div>
    </div>
  );
}
