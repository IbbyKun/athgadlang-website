"use client";

import * as React from "react";
import "leaflet/dist/leaflet.css";
import type { Control, Map as LeafletMap, Marker } from "leaflet";

import { cn } from "@/lib/utils";
import type { Office } from "@/lib/offices";

/** Panning and zooming handlers toggled with `interactive`. */
const HANDLERS = [
  "dragging",
  "scrollWheelZoom",
  "doubleClickZoom",
  "boxZoom",
  "keyboard",
  "touchZoom",
] as const;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );
}

function pinHtml(office: Office, current: boolean) {
  return `<span class="office-pin__dot${
    current ? " office-pin__dot--current" : ""
  }"></span>`;
}

function popupHtml(office: Office) {
  return `
    <p class="office-popup__label">${escapeHtml(office.city)}</p>
    <p class="office-popup__country">${escapeHtml(office.country)}</p>
    <p class="office-popup__address">${escapeHtml(office.address)}</p>
    <a class="office-popup__phone" href="${escapeHtml(office.phoneHref)}">${escapeHtml(
      office.phone,
    )}</a>
  `;
}

type OfficeMapProps = {
  offices: Office[];
  /**
   * Slug of the office serving the region being viewed — drawn as the primary
   * pin. It marks where the reader is, not where the firm is run from.
   */
  current?: string;
  /** When false the map is a decorative backdrop: no panning, no zooming. */
  interactive: boolean;
  /** Slug of an office to fly to and open. Change it to re-trigger. */
  focused?: string | null;
  className?: string;
};

/**
 * Leaflet map of the office network. Pins and popups are built from
 * `offices`, so coordinates stay in the repo rather than in a Google account.
 *
 * Leaflet is imported dynamically inside the effect: it touches `window` at
 * module scope, and this keeps ~40KB out of the initial bundle.
 */
export function OfficeMap({
  offices,
  current,
  interactive,
  focused,
  className,
}: OfficeMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const markersRef = React.useRef<Record<string, Marker>>({});
  const zoomRef = React.useRef<Control.Zoom | null>(null);
  const boundsRef = React.useRef<(() => void) | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      map = L.map(containerRef.current, {
        zoomControl: false,
        // Starts inert; MapStage enables the handlers when exploring.
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      offices.forEach((office) => {
        const marker = L.marker([office.lat, office.lng], {
          title: `${office.country} — ${office.city}`,
          icon: L.divIcon({
            className: "office-pin",
            html: pinHtml(office, office.slug === current),
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            popupAnchor: [0, -12],
          }),
        })
          .addTo(map!)
          .bindPopup(popupHtml(office), {
            className: "office-popup",
            maxWidth: 280,
            minWidth: 220,
          });

        markersRef.current[office.slug] = marker;
      });

      const bounds = L.latLngBounds(
        offices.map((office) => [office.lat, office.lng]),
      );
      const fit = () =>
        map?.fitBounds(bounds, { padding: [72, 72], animate: false });

      fit();
      boundsRef.current = fit;
      zoomRef.current = L.control.zoom({ position: "bottomright" });
      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      markersRef.current = {};
      zoomRef.current = null;
      boundsRef.current = null;
    };
  }, [offices, current]);

  // Flip between decorative backdrop and explorable map.
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    HANDLERS.forEach((name) => {
      const handler = map[name];
      if (interactive) handler.enable();
      else handler.disable();
    });

    if (interactive) zoomRef.current?.addTo(map);
    else {
      zoomRef.current?.remove();
      map.closePopup();
      boundsRef.current?.();
    }

    // Re-sync the tile grid. Without this, tiles can stay unloaded after the
    // overlay above the map is added or removed. Twice: once now, once after
    // the overlay's transition has finished.
    map.invalidateSize({ animate: false });
    const settle = setTimeout(
      () => mapRef.current?.invalidateSize({ animate: false }),
      600,
    );
    return () => clearTimeout(settle);
  }, [interactive, ready]);

  // Fly to a specific office and open its popup.
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !focused) return;
    const marker = markersRef.current[focused];
    if (!marker) return;
    map.flyTo(marker.getLatLng(), 13, { duration: 0.9 });
    marker.openPopup();
  }, [focused, ready]);

  return (
    <div
      /*
        `inert`, not `aria-hidden`. Leaflet builds its own controls — zoom
        buttons and the attribution link are real anchors — and while the map is
        a backdrop rather than a thing to use, `aria-hidden` hid them from
        screen readers without taking them out of the tab order. Tabbing through
        the contact section landed on invisible buttons that announced nothing.
        `pointer-events-none` does not help: it stops the mouse, not the keyboard.

        `inert` removes the whole subtree from the tab order and the
        accessibility tree together, which is exactly the state a decorative map
        should be in, and it reverts the moment the reader chooses to explore.
      */
      inert={!interactive}
      className={cn(
        "absolute inset-0 z-0 bg-brand-navy",
        interactive ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
    >
      {/**
       * Leaflet owns this node's class list — it adds `leaflet-container` and
       * friends imperatively. Its className must therefore be a constant, so
       * React never diffs and rewrites the attribute: doing so strips those
       * classes, which drops `img.leaflet-tile { max-width: none }` and lets
       * Tailwind's preflight collapse every tile to zero width.
       *
       * Mode-dependent classes belong on the wrapper above, never here.
       */}
      <div ref={containerRef} className="size-full" />
    </div>
  );
}
