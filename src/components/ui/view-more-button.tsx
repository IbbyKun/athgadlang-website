import Link from "next/link";

import { BrandSpinner } from "@/components/ui/brand-spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The site's one call-to-action button.
 *
 * It started as the "View More" button under the card sections, and it is now
 * the shape every action on the site takes — hero, closing bands, downloads,
 * the lot. One size, one weight, one radius; only the colour changes with what
 * is behind it. Identical actions should not look different from each other,
 * and a reader should be able to recognise "this is the button" on any page.
 *
 * Larger than the default `lg` size on purpose. These are usually the only
 * action in an otherwise passive band, so they are sized to be found rather
 * than to sit politely inside the layout. No trailing icon by default — the
 * label says what it does, and an arrow on a centred button pulls the eye off
 * it.
 *
 * The reveal-in-place flavour can also show that a page is on its way: those
 * cards come from the server rather than from an array already in the browser,
 * so pressing it is a request and the reader should be able to see that.
 */
const actionSizeClass = "h-12 px-8 text-base font-semibold";

/**
 * What the button sits on, which is all that changes between them.
 *
 * `brand` on light backgrounds, `light` on the navy bands — a white button on
 * navy carries far better than brand red does, and red-on-navy was the pairing
 * that failed contrast in the footer. `outline` is the secondary action beside
 * a `light` one, and `navy` is for the light sections that already have a red
 * button doing something else.
 */
export type ActionTone = "brand" | "navy" | "light" | "outline";

const toneClass: Record<ActionTone, string> = {
  brand: "bg-brand text-white hover:bg-brand-hover",
  navy: "bg-brand-navy text-white hover:bg-brand-navy/90",
  light: "bg-white text-brand-navy hover:bg-white/90",
  outline:
    "border-white/40 bg-transparent text-white hover:bg-white hover:text-brand-navy",
};

/** The canonical action button styling, for the few places that need a bare class. */
export function actionButtonClass(tone: ActionTone = "brand", className?: string) {
  return cn(actionSizeClass, toneClass[tone], className);
}

type ViewMoreButtonProps = {
  children?: React.ReactNode;
  tone?: ActionTone;
  className?: string;
} & (
  | { href: string; onClick?: never; loading?: never }
  | {
      href?: never;
      onClick: () => void;
      /** Shows the spinner and refuses further presses while a page is in flight. */
      loading?: boolean;
    }
);

export function ViewMoreButton({
  href,
  onClick,
  loading,
  tone = "brand",
  children = "View More",
  className,
}: ViewMoreButtonProps) {
  if (href) {
    return (
      <Button asChild size="lg" className={actionButtonClass(tone, className)}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={onClick}
      disabled={loading}
      // Reduced rather than the default disabled fade: the button keeps its
      // place and its label, so the wait reads as this button working.
      className={actionButtonClass(
        tone,
        cn(loading && "disabled:opacity-80", className),
      )}
    >
      {loading ? (
        <>
          <BrandSpinner label="" className="text-current" />
          Loading
        </>
      ) : (
        children
      )}
    </Button>
  );
}
