import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type CarouselArrowProps = {
  direction: "left" | "right";
  onClick: () => void;
  /**
   * Faded rather than removed, so the row never reflows and the control stays
   * where the reader last saw it. A cycling carousel never passes this.
   */
  disabled?: boolean;
  /** Overrides the generic "Scroll left/right" for screen readers. */
  label?: string;
  /** Positioning is the caller's: each carousel has its own edges. */
  className?: string;
};

/**
 * The carousel control, in one place.
 *
 * Both the insights row and the testimonial carousel use it, and they used to
 * be separate buttons that had already drifted in size and in whether they
 * carried a shadow. Absolute by default because every carousel overlays these
 * on its own side margins rather than parking them under the cards.
 */
export function CarouselArrow({
  direction,
  onClick,
  disabled = false,
  label,
  className,
}: CarouselArrowProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        label ?? (direction === "left" ? "Scroll left" : "Scroll right")
      }
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2",
        "grid size-10 place-items-center rounded-full border border-neutral-300 bg-white text-brand-navy shadow-md transition",
        "hover:border-brand hover:bg-brand hover:text-white",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-35",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  );
}
