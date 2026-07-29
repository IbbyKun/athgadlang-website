"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { Stat } from "@/lib/stats";

const DURATION = 1600;

/** Ring geometry, in the SVG's own coordinate space. */
const SIZE = 128;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const numberFormat = new Intl.NumberFormat("en-GB");

function label(value: number, suffix = "") {
  return `${numberFormat.format(value)}${suffix}`;
}

/**
 * The figures panel. Rings fill and numbers count up from zero the first time
 * the grid scrolls into view, then stay put.
 */
export function StatsGrid({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        // Runs once — the figures should not replay on every pass.
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 md:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat) => (
        <StatRing key={stat.id} stat={stat} active={active} />
      ))}
    </div>
  );
}

function StatRing({ stat, active }: { stat: Stat; active: boolean }) {
  const numberRef = React.useRef<HTMLSpanElement>(null);

  /**
   * The number is written straight to the DOM rather than held in state:
   * eight counters at 60fps would otherwise re-render this tree ~480 times a
   * second. The server renders the final figure, so no-JS visitors and
   * crawlers see the real number.
   */
  React.useEffect(() => {
    const node = numberRef.current;
    if (!node) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = label(stat.value, stat.suffix);

    if (calm) {
      node.textContent = target;
      return;
    }

    if (!active) {
      // Park at zero while the panel is still below the fold.
      node.textContent = label(0, stat.suffix);
      return;
    }

    let frame = 0;
    let started = 0;

    const step = (now: number) => {
      started ||= now;
      const t = Math.min(1, (now - started) / DURATION);
      // easeOutCubic: fast start, gentle settle onto the final figure.
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = label(Math.round(stat.value * eased), stat.suffix);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, stat.suffix, stat.value]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden
          className="size-28 -rotate-90 sm:size-32"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-brand-hover"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={
              active ? CIRCUMFERENCE * (1 - stat.progress) : CIRCUMFERENCE
            }
            className="stroke-white transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none"
          />
        </svg>

        <span className="absolute inset-0 grid place-items-center">
          <span
            ref={numberRef}
            className="text-xl font-bold tabular-nums text-white sm:text-2xl"
          >
            {label(stat.value, stat.suffix)}
          </span>
        </span>
      </div>

      <p className="text-sm font-semibold leading-snug text-white sm:text-[0.95rem]">
        {stat.label}
      </p>
    </div>
  );
}
