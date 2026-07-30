import Image from "next/image";
import Link from "next/link";

import { brand } from "@/lib/images";
import { primaryTenant, type Tenant, type TenantLogo } from "@/lib/tenants";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/** Rendered heights in px; width follows the asset's aspect ratio. */
const heights = { sm: 30, md: 44, lg: 60 } as const;

type LogoProps = {
  /** Region being served; decides which brand mark is used. */
  tenant?: Tenant;
  size?: keyof typeof heights;
  /** "light" uses the knockout variant, for dark backgrounds. */
  tone?: "default" | "light";
  /** Set false to render the mark without a surrounding link. */
  asLink?: boolean;
  /** Eager-load when the logo is above the fold, as in the site header. */
  priority?: boolean;
  className?: string;
};

/**
 * The logo for whichever tenant this build serves — athGADLANG, or Wathiq on
 * the KSA subdomain. Swap the files in `brand` (lib/images.ts) or on the
 * tenant (lib/tenants.ts) and every call site follows.
 */
export function Logo({
  tenant = primaryTenant,
  size = "md",
  tone = "default",
  asLink = true,
  priority = true,
  className,
}: LogoProps) {
  const fallback = tone === "light" ? brand.logoLight : brand.logo;
  const asset: TenantLogo = tenant.logo
    ? tenant.logo[tone === "light" ? "light" : "default"]
    : fallback;

  const height = heights[size];
  const width = Math.round(height * (asset.width / asset.height));

  const image = (
    <Image
      src={asset.src}
      alt={
        asLink ? `${tenant.brandName ?? siteConfig.name} — home` : asset.alt
      }
      width={width}
      height={height}
      priority={priority}
      // The optimiser refuses SVG unless explicitly allowed, and a vector
      // needs no resizing anyway.
      unoptimized={asset.src.endsWith(".svg")}
      /**
       * No w-auto/h-auto here: `width: auto` discards the width attribute and
       * falls back to the intrinsic size, which an SVG declaring width="100%"
       * does not have — the image then collapses to 0×0. The width/height
       * attributes plus preflight's `height: auto` size it correctly.
       */
      className={cn("object-contain", className)}
    />
  );

  if (!asLink) return image;

  return (
    <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
      {image}
    </Link>
  );
}
