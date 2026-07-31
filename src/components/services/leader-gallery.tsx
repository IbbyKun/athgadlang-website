"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { type Leader } from "@/lib/leaders";
import { cn } from "@/lib/utils";

/**
 * Width of the portrait and the biography panel on an open card.
 *
 * The panel is wide on purpose: at a narrower measure the longest biography ran
 * past the height of the row and had to scroll. Widening the column trades
 * horizontal room — which the row has — for vertical room, which it does not.
 */
const PORTRAIT_OPEN = "13rem";
const PANEL_OPEN = "33rem";
/** Portrait + panel. The open card is capped here, so it never outruns its copy. */
const CARD_OPEN = "46rem";

/**
 * Widths the row divides between the cards, as flex-grow factors. Tuned so an
 * open card lands on `CARD_OPEN`; the cap absorbs the rest on a wide screen,
 * where the leftover width goes back to the collapsed cards.
 */
const GROW_ACTIVE = 3;
const GROW_COLLAPSED = 0.6;

/**
 * Three or more partners, as one row of portrait tiles that open in place.
 *
 * The card under the pointer widens and reveals its biography beside the
 * portrait; the others give up width to make room rather than being pushed off
 * the row. Same reveal as the one- and two-partner cards, but the room comes
 * from the siblings, since four open panels cannot fit a container.
 *
 * Below `xl` there is no room for that at all, so the tiles keep a grid and
 * share a panel underneath — and no hover to depend on, so the first partner is
 * shown by default.
 *
 * Portraits use `object-top`: centring a tall crop cuts the face.
 */
export function LeaderGallery({ leaders }: { leaders: Leader[] }) {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  /** Clears only when focus leaves the row entirely, not between cards. */
  const onBlurRow = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActiveSlug(null);
  };

  return (
    <>
      {/* One row, cards open in place. */}
      <div
        className="hidden h-[32rem] gap-3 xl:flex"
        onMouseLeave={() => setActiveSlug(null)}
        onBlur={onBlurRow}
      >
        {leaders.map((leader) => {
          const isActive = leader.slug === activeSlug;

          return (
            <article
              key={leader.slug}
              tabIndex={0}
              onMouseEnter={() => setActiveSlug(leader.slug)}
              onFocus={() => setActiveSlug(leader.slug)}
              style={{
                flexBasis: 0,
                flexGrow: !activeSlug
                  ? 1
                  : isActive
                    ? GROW_ACTIVE
                    : GROW_COLLAPSED,
                maxWidth: isActive ? CARD_OPEN : undefined,
              }}
              className={cn(
                "group relative flex min-w-0 overflow-hidden rounded-2xl bg-white outline-none",
                "transition-[flex-grow,box-shadow] duration-500 ease-out motion-reduce:transition-none",
                isActive
                  ? "shadow-2xl ring-2 ring-brand"
                  : "shadow-sm ring-1 ring-neutral-200",
              )}
            >
              <div
                style={{ width: isActive ? PORTRAIT_OPEN : "100%" }}
                className="relative h-full shrink-0 transition-[width] duration-500 ease-out motion-reduce:transition-none"
              >
                <Image
                  src={leader.image.src}
                  alt={leader.image.alt}
                  fill
                  sizes="(min-width: 1280px) 20rem, 50vw"
                  className="object-cover object-top"
                />

                {/* Scrim, so the name stays legible on any photograph. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/25 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold leading-tight tracking-tight text-white">
                      {leader.name}
                    </h3>
                    <p className="mt-1 truncate text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/80">
                      {leader.role}
                    </p>
                  </div>

                  {/* Hints there is more to read; retreats once it is open. */}
                  {leader.bio && (
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30",
                        "transition-opacity duration-300",
                        isActive && "opacity-0",
                      )}
                    >
                      <ChevronRight className="size-4" />
                    </span>
                  )}
                </div>
              </div>

              {leader.bio && (
                <div
                  style={{ flexBasis: 0, flexGrow: isActive ? 1 : 0 }}
                  className="flex min-w-0 overflow-hidden"
                >
                  {/* Fixed width, flush to the portrait: the copy sits at the
                      left of the panel with its own padding, so the panel is
                      never wider than the text it holds. */}
                  <div
                    style={{ width: PANEL_OPEN }}
                    className="flex h-full shrink-0 flex-col justify-center gap-3 overflow-y-auto py-6 pl-6 pr-7"
                  >
                    {leader.bio.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-relaxed text-neutral-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Narrower screens: tiles over a shared panel. */}
      <SharedPanelGallery
        leaders={leaders}
        activeSlug={activeSlug ?? leaders[0]?.slug}
        onSelect={setActiveSlug}
      />
    </>
  );
}

function SharedPanelGallery({
  leaders,
  activeSlug,
  onSelect,
}: {
  leaders: Leader[];
  activeSlug?: string;
  onSelect: (slug: string) => void;
}) {
  const active = leaders.find((l) => l.slug === activeSlug) ?? leaders[0];

  return (
    <div className="flex flex-col gap-6 xl:hidden">
      <ul
        className={cn(
          "grid grid-cols-2 gap-4",
          leaders.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4",
        )}
      >
        {leaders.map((leader) => {
          const isActive = leader.slug === active?.slug;

          return (
            <li key={leader.slug}>
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => onSelect(leader.slug)}
                onFocus={() => onSelect(leader.slug)}
                onClick={() => onSelect(leader.slug)}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-2xl bg-white text-left",
                  "transition duration-300 ease-out motion-reduce:transition-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive
                    ? "-translate-y-1 shadow-xl ring-2 ring-brand"
                    : "shadow-sm ring-1 ring-neutral-200",
                )}
              >
                <span className="relative block aspect-[4/5]">
                  <Image
                    src={leader.image.src}
                    alt={leader.image.alt}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover object-top"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 block p-4">
                    <span className="block text-balance text-sm font-bold leading-tight tracking-tight text-white sm:text-base">
                      {leader.name}
                    </span>
                    <span className="mt-1 block text-[0.65rem] font-semibold uppercase leading-snug tracking-[0.14em] text-white/80">
                      {leader.role}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {active?.bio && (
        <div
          // Keyed on the partner, so switching replays the fade rather than
          // swapping the text in place.
          key={active.slug}
          className={cn(
            "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8",
            "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {active.name}
            <span className="text-neutral-400"> — {active.role}</span>
          </p>

          <div className="mt-4 flex max-w-4xl flex-col gap-3">
            {active.bio.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed text-neutral-600"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
