"use client";

import * as React from "react";

/**
 * Reports when an element first scrolls into view, for reveal-on-scroll.
 *
 * `inView` is `null` until the observer has had its say, and callers must treat
 * that as "show it". The server has no viewport, so anything gated on a boolean
 * would render hidden — and stay hidden for a visitor without JavaScript, and
 * for a crawler. Null is the honest third state, and it renders as visible.
 *
 * Fires once and disconnects: a band that re-animates every time it passes the
 * fold is a distraction, not a flourish.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.2,
}: { threshold?: number } = {}) {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        } else {
          // The first callback fires as soon as we observe, so an element
          // already on screen never flashes hidden — only one below the fold
          // gets parked, and it has nothing to flash in front of.
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
