import { cn } from "@/lib/utils";

/**
 * The site's loading indicator: a ring in the two brand colours.
 *
 * Deliberately minimal. It appears where something was asked for and has not
 * arrived yet — the next page of articles, a search index — and in those places
 * the reader is waiting on one control, not on the page. Anything larger would
 * draw more attention than the wait deserves.
 *
 * Built from borders rather than an SVG so it costs nothing to render and
 * inherits `currentColor` nowhere: the navy and red are the point. Three sides
 * navy, one red, spun — which reads as a single red mark travelling round a navy
 * ring rather than as a two-colour gradient.
 *
 * `motion-reduce` stops the spin for anyone who has asked for less movement; the
 * ring stays, so the state is still visible.
 */
export function BrandSpinner({
  className,
  label = "Loading",
}: {
  className?: string;
  /** Announced to screen readers. Set to "" where a visible label says it. */
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span
        aria-hidden
        className={cn(
          "size-4 shrink-0 rounded-full border-2 border-brand-navy border-t-brand",
          "animate-spin motion-reduce:animate-none",
        )}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
