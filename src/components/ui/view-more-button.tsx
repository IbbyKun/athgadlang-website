import Link from "next/link";

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
 */
const viewMoreClass = "h-12 px-8 text-base font-semibold";

type ViewMoreButtonProps = {
  children?: React.ReactNode;
  className?: string;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick: () => void }
);

export function ViewMoreButton({
  href,
  onClick,
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
      className={cn(viewMoreClass, className)}
    >
      {children}
    </Button>
  );
}
