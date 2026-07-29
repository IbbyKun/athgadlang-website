import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { LocationSwitcher } from "@/components/layout/location-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchForm } from "@/components/layout/search-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

/**
 * Sticky site header. Its height is fixed by `--header-h` (globals.css) so
 * sections such as <Hero fullScreen> can subtract it from the viewport.
 */
export function SiteHeader() {
  return (
    <header
      id="top"
      className="sticky top-0 z-50 h-(--header-h) w-full border-b border-neutral-200 bg-white"
    >
      <Container className="flex h-full items-center justify-between gap-4">
        <Logo />

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
    </header>
  );
}
