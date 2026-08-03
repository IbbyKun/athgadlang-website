"use client";

import * as React from "react";
import { MapPinned, X } from "lucide-react";

import { OfficeMap } from "@/components/maps/office-map";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import type { Office } from "@/lib/offices";

type MapStageProps = {
  offices: Office[];
  /** Section content shown over the tinted map, hidden while exploring. */
  children: React.ReactNode;
};

/**
 * Wraps the contact section content over the office map. Clicking the
 * backdrop clears the overlay and tint and hands the map over for panning,
 * zooming and pin popups; Escape or the close button brings the page back.
 *
 * Renders no wrapper of its own so the absolute layers size to the section.
 */
export function MapStage({ offices, children }: MapStageProps) {
  const [exploring, setExploring] = React.useState(false);
  const [focused, setFocused] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!exploring) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExploring(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exploring]);

  const close = () => {
    setExploring(false);
    setFocused(null);
  };

  return (
    <>
      <OfficeMap offices={offices} interactive={exploring} focused={focused} />

      {/**
       * Navy wash. Unmounted rather than faded to `opacity-0` while exploring:
       * a lingering mix-blend layer over the tile pane is what made the map go
       * blank. backdrop-filter desaturates the map without touching Leaflet's
       * own DOM.
       */}
      {!exploring && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 backdrop-brightness-95 backdrop-contrast-110 backdrop-grayscale"
        >
          <div className="absolute inset-0 bg-brand-navy/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-brand-navy/45" />
        </div>
      )}

      {/**
       * Background click-to-explore. Decorative and not focusable: the section
       * content sits above it, so it only covers the margins — the chip below
       * is the reliable, keyboard-reachable control.
       */}
      {!exploring && (
        <div
          aria-hidden
          onClick={() => setExploring(true)}
          className="absolute inset-0 z-20 cursor-pointer"
        />
      )}

      <div
        className={cn(
          "relative z-30 transition-opacity duration-500",
          exploring && "pointer-events-none opacity-0",
        )}
      >
        <Container size="wide">{children}</Container>
      </div>

      {/* The real control: always clickable, and reachable by keyboard. */}
      {!exploring && (
        <button
          type="button"
          onClick={() => setExploring(true)}
          className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MapPinned aria-hidden className="size-4" />
          Explore our {offices.length} offices
        </button>
      )}

      {exploring && (
        <>
          <button
            type="button"
            onClick={close}
            autoFocus
            className="absolute right-4 top-[calc(var(--header-h)+1rem)] z-40 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-lg transition hover:bg-brand hover:text-white sm:right-8"
          >
            <X aria-hidden className="size-4" />
            Close map
          </button>

          {/* Jump straight to an office rather than hunting for its pin. */}
          <div className="absolute inset-x-0 bottom-6 z-40 flex justify-center px-4">
            <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto rounded-full bg-white/95 p-2 shadow-lg backdrop-blur">
              {offices.map((office) => (
                <button
                  key={office.slug}
                  type="button"
                  onClick={() => setFocused(office.slug)}
                  aria-pressed={focused === office.slug}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition",
                    focused === office.slug
                      ? "bg-brand text-white"
                      : "text-brand-navy hover:bg-brand/10",
                  )}
                >
                  {office.country}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
