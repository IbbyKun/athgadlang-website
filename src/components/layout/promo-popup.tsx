"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, X } from "lucide-react";

import type { Popup } from "@/lib/popup";

/**
 * The announcement overlay shown on arrival.
 *
 * Dim background, bright text, one button, and a close control in the corner.
 * No card, no border, no shadow: the dimmed page behind it is the frame, and
 * anything drawn around the text would only compete with the one thing the
 * popup exists to say.
 *
 * Fetched from /api/popup rather than rendered into the page — see the note
 * there for why, which comes down to not rewriting 830 pages to schedule a
 * seminar.
 */

/** How long a dismissal lasts. */
const quietHours = 24;

/** Per popup, so a new announcement is not silenced by an old dismissal. */
const storageKey = (id: string) => `ag_popup_dismissed:${id}`;

function dismissedRecently(id: string) {
  try {
    const at = Number(window.localStorage.getItem(storageKey(id)));
    if (!Number.isFinite(at) || at <= 0) return false;

    return Date.now() - at < quietHours * 60 * 60 * 1000;
  } catch {
    // Private browsing, or storage disabled. Showing the popup is the right
    // failure: it is the behaviour of a first-time visitor, which is what a
    // browser that cannot remember anything effectively is.
    return false;
  }
}

export function PromoPopup() {
  const [popup, setPopup] = React.useState<Popup | null>(null);
  const [open, setOpen] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    // Aborted on unmount so a navigation away mid-flight does not set state on
    // a component that has gone.
    const controller = new AbortController();

    fetch("/api/popup", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { popup: Popup | null } | null) => {
        const found = data?.popup;
        if (!found || dismissedRecently(found.id)) return;

        setPopup(found);
        setOpen(true);
      })
      // A popup that cannot be fetched is a popup that is not shown. Nothing
      // on the page depends on it, so there is nothing to report.
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
    if (!popup) return;

    try {
      window.localStorage.setItem(storageKey(popup.id), String(Date.now()));
    } catch {
      // Nothing to do: it reappears next visit, which is the tolerable failure.
    }
  }, [popup]);

  // Escape closes it, and the page behind stops scrolling while it is up —
  // otherwise the wheel scrolls the article underneath the overlay.
  React.useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  if (!open || !popup) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-title"
      // Clicking the dimmed area closes it, which is what people try first.
      onClick={close}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
    >
      {/*
        A card, floating on the dimmed page.

        This started as bare text on the backdrop, which sounded right and read
        badly: with nothing to bound it, the heading ran the width of the screen
        and collided with the close button. The card is what makes the popup an
        object on the page rather than text sprayed across it — and it is what
        gives the artwork somewhere to sit.
      */}
      <div
        // The card is not the backdrop, so a click inside it must not close.
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-brand-navy text-center shadow-2xl ring-1 ring-white/10"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          // Over the artwork, so it needs a ground of its own — a bare white
          // glyph disappears against a pale image.
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/50 text-white/80 backdrop-blur transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X aria-hidden className="size-5" />
        </button>

        <PopupMedia popup={popup} />

        <div className="flex flex-col items-center gap-4 p-6 sm:p-7">
          <h2
            id="promo-popup-title"
            className="text-balance text-xl font-bold leading-tight text-white sm:text-2xl"
          >
            {popup.title}
          </h2>

          {popup.body && (
            <p className="text-pretty text-sm leading-relaxed text-white/70">
              {popup.body}
            </p>
          )}

          {popup.href && popup.label && (
            <PopupLink popup={popup} onNavigate={close} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The top of the card: a looping clip for a recording, the artwork for an
 * event, and nothing at all for a plain announcement.
 *
 * The video plays muted and repeats. Muted is not a preference — a browser
 * refuses to autoplay sound, and the whole thing would sit there paused
 * instead. Controls are hidden because this is a moving poster rather than
 * something to watch here: the button underneath is what opens it properly.
 */
function PopupMedia({ popup }: { popup: Popup }) {
  if (popup.videoId) {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      // A loop needs a playlist to loop over, and one video is a playlist of
      // one. Without this the clip plays once and stops on a black frame.
      playlist: popup.videoId,
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });

    return (
      <div className="relative aspect-video w-full bg-black">
        {/* Behind the frame: what is seen for the moment before the embed
            loads, and what remains if YouTube is blocked. */}
        {popup.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={popup.image}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <iframe
          src={`https://www.youtube-nocookie.com/embed/${popup.videoId}?${params}`}
          title={popup.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  if (popup.image) {
    return (
      <div className="aspect-video w-full bg-black">
        {/* A plain <img>: this is a client component fetching a URL it only
            learns at runtime, so there is no build-time size to optimise for. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={popup.image}
          alt={popup.imageAlt ?? ""}
          className="size-full object-cover"
        />
      </div>
    );
  }

  return null;
}

/**
 * The button. An external target opens in a new tab and is a plain anchor; an
 * event page is a `Link`, so it routes without reloading the site.
 *
 * Either way the popup is marked dismissed on the way out — somebody who has
 * acted on it should not be shown it again by the page they land on.
 */
function PopupLink({
  popup,
  onNavigate,
}: {
  popup: Popup;
  onNavigate: () => void;
}) {
  const className =
    "inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-base font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  if (popup.external) {
    return (
      <a
        href={popup.href}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {popup.label}
        <ArrowUpRight aria-hidden className="size-5" />
      </a>
    );
  }

  return (
    <Link href={popup.href!} onClick={onNavigate} className={className}>
      {popup.label}
      <ChevronRight aria-hidden className="size-5" />
    </Link>
  );
}
