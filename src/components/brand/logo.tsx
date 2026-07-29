import Image from "next/image";
import Link from "next/link";

import { brand } from "@/lib/images";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/** Rendered heights in px; width follows the asset's aspect ratio. */
const heights = { sm: 30, md: 44, lg: 60 } as const;

const RATIO = brand.logo.width / brand.logo.height;

type LogoProps = {
  size?: keyof typeof heights;
  /** Set false to render the mark without a surrounding link. */
  asLink?: boolean;
  /** Eager-load when the logo is above the fold, as in the site header. */
  priority?: boolean;
  className?: string;
};

/**
 * The athGADLANG logo. The asset already contains the wordmark and tagline,
 * so this renders image-only — swap the file in `brand.logo` (lib/images.ts)
 * to update it everywhere.
 */
export function Logo({
  size = "md",
  asLink = true,
  priority = true,
  className,
}: LogoProps) {
  const height = heights[size];
  const width = Math.round(height * RATIO);

  const image = (
    <Image
      src={brand.logo.src}
      alt={asLink ? `${siteConfig.name} — home` : brand.logo.alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );

  if (!asLink) return image;

  return (
    <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
      {image}
    </Link>
  );
}
