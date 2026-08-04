import Link from "next/link";

import { BrandSpinner } from "@/components/ui/brand-spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The "View More" call to action, in one place.
 *
 * Five sections used to render this button themselves, which is five chances
 * for them to drift apart — and they had, in size and in whether they carried a
 * chevron. It comes in two flavours because two of the five reveal more cards
 * in place and three navigate to a full index, but it is deliberately the same
 * button either way: identical labels should not look different.
 *
 * Larger than the default `lg` size on purpose. This is the only action in an
 * otherwise passive band of cards, so it is sized to be found rather than to
 * sit politely inside the layout. No trailing icon — the label says what it
 * does, and an arrow on a centred button pulls the eye off it.
 *
 * The reveal-in-place flavour can also show that a page is on its way: the cards
 * now come from the server rather than from an array already in the browser, so
 * pressing it is a request and the reader should be able to see that.
 */
const viewMoreClass = "h-12 px-8 text-base font-semibold";

type ViewMoreButtonProps = {
  children?: React.ReactNode;
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
  children = "View More",
  className,
}: ViewMoreButtonProps) {
  if (href) {
    return (
      <Button asChild size="lg" className={cn(viewMoreClass, className)}>
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
      className={cn(viewMoreClass, loading && "disabled:opacity-80", className)}
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
