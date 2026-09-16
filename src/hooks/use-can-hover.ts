"use client";

import * as React from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** No window on the server, and no hover either — the safer of the two guesses. */
function getServerSnapshot() {
  return false;
}

/**
 * Whether the primary input can hover a pointer without touching — true for
 * a mouse or trackpad, false for touch. `useSyncExternalStore` rather than a
 * state-plus-effect pair, since this is exactly what it is for: reading a
 * value that lives outside React and can change on its own.
 *
 * Width alone cannot answer this: a touch laptop at desktop width still taps
 * rather than hovers, and that is exactly the case a hover-only popover has
 * to get right.
 */
export function useCanHover() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
