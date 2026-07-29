"use client";

import * as React from "react";

const CLOSE_DELAY = 120;

/**
 * Makes a Radix menu open on hover in addition to click, while staying
 * fully keyboard operable.
 *
 * Spread `hoverProps` on both the trigger and the content — the content is
 * portaled, so it needs its own handlers to stay open while the pointer is
 * inside it.
 */
export function useHoverMenu() {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const hoverProps = React.useMemo(
    () => ({
      onMouseEnter: () => {
        cancel();
        setOpen(true);
      },
      // Grace period so the pointer can travel from trigger to panel.
      onMouseLeave: () => {
        cancel();
        timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
      },
    }),
    [cancel],
  );

  React.useEffect(() => cancel, [cancel]);

  return { open, setOpen, hoverProps };
}
