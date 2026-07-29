import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { HeaderShell } from "@/components/layout/header-shell";
import { LocationSwitcher } from "@/components/layout/location-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchForm } from "@/components/layout/search-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

/**
 * Sticky site header. Height is fixed by `--header-h` (globals.css) so
 * full-screen sections can pad clear of it; HeaderShell handles the transition
 * to a floating bar on scroll.
 */
export function SiteHeader() {
  return (
    <HeaderShell>
      <Container className="flex h-full items-center justify-between gap-4">
        {/* Scales down a touch once the bar detaches. */}
        <span className="origin-left transition-transform duration-500 ease-out group-data-scrolled/header:scale-90 motion-reduce:transition-none">
          <Logo />
        </span>

        <DesktopNav />

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchForm className="hidden md:flex" />
          <LocationSwitcher className="hidden sm:inline-flex" />
          <Button asChild size="lg" className="hidden rounded-lg sm:inline-flex">
            <Link href={siteConfig.cta.href}>{siteConfig.cta.label}</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </HeaderShell>
  );
}
