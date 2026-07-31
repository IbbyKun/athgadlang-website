"use client";

import * as React from "react";

import { CapabilityPanel } from "@/components/services/capability-panel";
import { scrollToSection } from "@/components/ui/section-link";
import { type ServiceCapability } from "@/lib/services";

/**
 * Laptops and desktops, which is what this is designed for. No height floor:
 * the card is sized from the window, the panel fills it exactly, and copy that
 * does not fit scrolls within its own half — so a short window is cramped
 * rather than broken. Narrower than this the two halves cannot sit side by side
 * at all, and the panels flow down the page instead.
 */
const ROOMY = "(min-width: 1024px)";

/**
 * The capability panels, running through one card.
 *
 * The card parks below the header and page scroll moves the panels up through
 * it: at rest one panel fills the card, mid-scroll two meet at its edge, and
 * once the last has arrived the card releases and the page carries on. The
 * panels move; the frame does not.
 *
 * Scroll only drives a transform, so the page never gives up control of
 * scrolling — wheel, trackpad, space bar and scrollbar all behave normally.
 * A scroll of one card's height advances exactly one panel, which is what keeps
 * `#risk-advisory` landing on the right one.
 *
 * The card only appears where there is room. Until it is switched on — a narrow
 * or short window, reduced motion, or no JavaScript at all — the panels follow
 * one another down the page as they always did.
 */
export function CapabilityStack({
  capabilities,
}: {
  capabilities: ServiceCapability[];
}) {
  const [running, setRunning] = React.useState(false);
  const wrapper = React.useRef<HTMLDivElement>(null);
  const card = React.useRef<HTMLDivElement>(null);
  const strip = React.useRef<HTMLDivElement>(null);

  // One panel has nothing to travel through.
  const enabled = capabilities.length > 1;

  React.useEffect(() => {
    if (!enabled) return;

    /*
     * Reduced motion is not consulted. The panels move by exactly as much as
     * the page is scrolled, in the same direction, with no easing, delay or
     * parallax — it is the visitor's own scrolling, framed. What that setting
     * asks us to drop is movement the visitor did not ask for.
     */
    const roomy = window.matchMedia(ROOMY);
    const decide = () => setRunning(roomy.matches);

    decide();
    roomy.addEventListener("change", decide);

    return () => roomy.removeEventListener("change", decide);
  }, [enabled]);

  React.useEffect(() => {
    if (!running) return;

    let frame = 0;
    // Captured for the cleanup: by then the ref may point elsewhere.
    const rail = strip.current;

    const update = () => {
      frame = 0;
      const box = wrapper.current;
      const pinned = card.current;
      if (!box || !pinned || !rail) return;

      // The wrapper is one card tall per panel, so its overhang is exactly the
      // distance the strip has to travel. How far the card has been carried
      // down the wrapper is how far through that travel we are — no need to
      // know the header's height or the gap, the pinned card reports it.
      const travel = box.clientHeight - pinned.clientHeight;
      const carried =
        pinned.getBoundingClientRect().top - box.getBoundingClientRect().top;
      const passed = Math.min(Math.max(carried, 0), Math.max(travel, 0));

      rail.style.transform = `translate3d(0, ${-passed}px, 0)`;
    };

    const onScroll = () => {
      // One write per frame, however many scroll events arrive.
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rail) rail.style.transform = "";
    };
  }, [running, capabilities.length]);

  React.useEffect(() => {
    if (!running) return;

    // Arriving on /services/consulting#risk-advisory, the browser scrolls to
    // where the panel was before the card existed. Once it does, that position
    // means something else, so land on it again — without a glide, since as far
    // as the visitor is concerned the page simply opened there.
    const id = window.location.hash.slice(1);
    if (id && capabilities.some((capability) => capability.slug === id)) {
      scrollToSection(id, "auto");
    }
  }, [running, capabilities]);

  const panels = capabilities.map((capability, index) => (
    <CapabilityPanel
      key={capability.slug}
      capability={capability}
      index={index}
      stacked={running}
      className={
        running
          ? // Exactly one card, and an anchor that lands on the card's top edge
            // rather than the viewport's.
            "h-(--card-h) scroll-mt-[calc(var(--header-h)+var(--card-gap))]"
          : undefined
      }
    />
  ));

  if (!running) return <>{panels}</>;

  return (
    <div
      ref={wrapper}
      style={
        {
          "--card-gap": "1.5rem",
          // One screen, less the header and a gap above and below.
          "--card-h": "calc(100svh - var(--header-h) - var(--card-gap) * 2)",
          height: `calc(${capabilities.length} * var(--card-h))`,
          // The card floats clear of the header, both sides and the foot of the
          // window; without this the section below it would meet its bottom edge
          // as the stack ends, closing the one gap the visitor can see closing.
          marginBottom: "var(--card-gap)",
        } as React.CSSProperties
      }
    >
      <div
        ref={card}
        className="sticky mx-auto h-(--card-h) w-[min(100rem,calc(100%-3rem))] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]"
        style={{ top: "calc(var(--header-h) + var(--card-gap))" }}
      >
        <div ref={strip} className="will-change-transform">
          {panels}
        </div>
      </div>
    </div>
  );
}
