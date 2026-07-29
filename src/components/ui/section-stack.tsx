import { cn } from "@/lib/utils";

/**
 * How a layer behaves in the stack.
 *
 * A pinned layer stays put while the next one scrolls over it — which also
 * means anything below its fold is unreachable, so only pin layers that fit
 * the viewport.
 *
 * - `always` — one screen tall at every size (hero, services, portfolio)
 * - `roomy`  — pin only where there is room. Guards width as well as height:
 *              grids drop to fewer columns on narrow screens and grow taller
 *              than the viewport (webinars, testimonials)
 * - `never`  — the layer is deliberately taller than a screen and scrolls
 *              over whatever is pinned beneath it (insights, whose own
 *              internal sticky pane drives the horizontal carousel and would
 *              break if this wrapper pinned too)
 */
export type StackPin = "always" | "roomy" | "never";

/**
 * Every layer must be positioned in every state. A `static` layer ignores
 * z-index entirely, so the pinned layers beneath it would paint on top of it.
 *
 * Written out in full rather than composed from a shared constant: Tailwind
 * only generates utilities it can see as literal strings in the source.
 */
const pinClass: Record<StackPin, string> = {
  always: "sticky top-0",
  roomy:
    "relative [@media(min-width:1024px)_and_(min-height:900px)]:sticky [@media(min-width:1024px)_and_(min-height:900px)]:top-0",
  never: "relative",
};

/**
 * Wraps the stacked layers. Nothing may clip overflow between here and them.
 *
 * `isolate` keeps each stack's z-indexes to itself, so two stacks on one page
 * cannot fight over paint order.
 */
export function SectionStack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("relative isolate", className)}>{children}</div>;
}

type StackLayerProps = {
  children: React.ReactNode;
  /** Paint order: later layers cover earlier ones. */
  index: number;
  pin?: StackPin;
  className?: string;
};

export function StackLayer({
  children,
  index,
  pin = "always",
  className,
}: StackLayerProps) {
  return (
    <div
      // Kept low: the header sits at z-50 and must stay above every layer.
      style={{ zIndex: index + 1 }}
      className={cn(
        pinClass[pin],
        // Soft shadow above the leading edge, so a layer reads as sliding
        // over the one beneath rather than simply replacing it.
        index > 0 && "shadow-[0_-24px_56px_-28px_rgba(15,23,42,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
