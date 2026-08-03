import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { LeaderGallery } from "@/components/services/leader-gallery";
import { teamImages } from "@/lib/images";
import { type Leader } from "@/lib/leaders";
import { cn } from "@/lib/utils";

/**
 * The partners accountable for a service: a portrait tile with the name and
 * role over the photograph, which slides open sideways to reveal the biography.
 *
 * One or two partners get this treatment. Three or more cannot — there is no
 * room for four open panels in a row — so they hand off to <LeaderGallery>,
 * which keeps the tiles in one row and shares a panel beneath them.
 *
 * The first card opens to its left and the second to its right, so the pair
 * opens outward from the centre of the row.
 *
 * Three widths, because a portrait tile plus an open panel needs about 70rem:
 * stacked under the portrait on small screens, portrait-beside-copy from `lg`
 * where the pair sits one card per row, and only from `xl` — where two open
 * cards fit the container — does it collapse to a tile that slides open.
 *
 * The animation is a `width` transition on the biography panel — a length to a
 * length, which browsers interpolate. (A `grid-template-columns` reveal from
 * `0fr` to a `rem` value, as used vertically on ServiceCard, cannot be
 * interpolated and snaps open instead.) The copy stays in the DOM throughout,
 * so it is in the accessibility tree whether or not the card is open, and the
 * card is focusable so it opens on keyboard focus and on tap. Below `lg` there
 * is no hover to rely on and the biography simply sits under the portrait.
 *
 * Portraits use `object-top` rather than centre: these are head-and-shoulders
 * photographs, and centring a tall crop cuts the face.
 */
export function ServiceLeaders({ leaders }: { leaders: Leader[] }) {
  if (leaders.length > 2) return <LeaderGallery leaders={leaders} />;

  return (
    <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-stretch xl:justify-center">
      {leaders.map((leader, index) => {
        /**
         * A pair opens outward from the centre — even cards leftward, odd
         * cards rightward. A lone card is centred with nothing to open away
         * from, so it opens rightward, with the reading direction.
         */
        const opensLeft = leaders.length > 1 && index % 2 === 0;
        const HintIcon = opensLeft ? ChevronLeft : ChevronRight;

        return (
          <article
            key={leader.slug}
            tabIndex={0}
            className={cn(
              "group relative w-full max-w-sm overflow-hidden rounded-2xl bg-white outline-none",
              "shadow-sm ring-1 ring-neutral-200 transition-shadow duration-500 ease-out",
              "hover:shadow-2xl hover:ring-2 hover:ring-brand",
              "focus-visible:shadow-2xl focus-visible:ring-2 focus-visible:ring-brand",
              // w-auto from lg up: the card hugs the portrait and the panel,
              // rather than stretching to a max width and leaving a void. The
              // height, portrait and panel widths match <LeaderGallery>, so a
              // profile card is the same size wherever it appears.
              "lg:flex lg:h-[32rem] lg:w-auto lg:max-w-none xl:w-auto",
              // Reversed on the left card, so its panel opens on the far side.
              opensLeft ? "xl:flex-row-reverse" : "xl:flex-row",
            )}
          >
            <div
              className={cn(
                "relative aspect-[3/4] w-full lg:aspect-auto lg:h-full lg:w-52 lg:shrink-0",
                // A closed tile rests wide — 13rem is the width it gives way to
                // once the panel opens, which as a resting portrait is a sliver.
                "xl:w-80 xl:transition-[width] xl:duration-500 xl:ease-out",
                "xl:group-hover:w-52 xl:group-focus-within:w-52",
                "xl:motion-reduce:transition-none",
              )}
            >
              <Image
                src={leader.image.src}
                alt={leader.image.alt}
                fill
                sizes="(min-width: 1280px) 20rem, (min-width: 1024px) 13rem, (min-width: 640px) 24rem, 100vw"
                className="object-cover object-top"
              />

              {/* Scrim, so the name stays legible on any photograph. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/25 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="text-lg font-bold leading-tight tracking-tight text-white">
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/80">
                    {leader.role}
                  </p>
                </div>

                {/* Points the way the panel will open; retreats once it is. */}
                {leader.bio && (
                  <span
                    aria-hidden
                    className={cn(
                      "hidden size-7 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30",
                      // Only meaningful where the panel is closed to begin with.
                      "transition-opacity duration-300 xl:grid",
                      "group-hover:opacity-0 group-focus-within:opacity-0",
                    )}
                  >
                    <HintIcon className="size-4" />
                  </span>
                )}
              </div>
            </div>

            {leader.bio && (
              <div
                className={cn(
                  "overflow-hidden lg:shrink-0 xl:w-0",
                  "xl:transition-[width] xl:duration-500 xl:ease-out",
                  "xl:group-hover:w-[33rem] xl:group-focus-within:w-[33rem]",
                  "xl:motion-reduce:transition-none",
                )}
              >
                {/* Fixed width, matching the panel exactly: the text must not
                    reflow as it opens, and the panel must not outrun the text.
                    Same measure and padding as <LeaderGallery>, so the copy
                    sets identically on both; a longer biography scrolls here
                    rather than stretching the card past the viewport. */}
                <div className="flex h-full flex-col justify-center gap-3 overflow-y-auto p-6 lg:w-[33rem] lg:py-6 lg:pl-6 lg:pr-7">
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
  );
}

/**
 * Named team members without a full profile.
 *
 * Shows the supplied photograph where there is one — see `teamImages`, keyed by
 * the name as `keyTeam` writes it — and a monogram where there is not. Mixed
 * rows are expected and fine: a monogram is honest about a missing photograph,
 * whereas a stock portrait of an unrelated person would not be, and these are
 * real colleagues.
 */
export function KeyTeam({ names }: { names: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {names.map((name) => {
        const portrait = teamImages[name];

        return (
          <li
            key={name}
            className={cn(
              "flex items-center gap-4 rounded-xl bg-white p-5 ring-1 ring-neutral-200 transition",
              "hover:ring-2 hover:ring-brand",
            )}
          >
            {portrait ? (
              /*
               * Shown whole, on white, and larger than a monogram needs to be.
               *
               * The supplied artwork is the person cut out inside the red aG
               * chevron on a transparent background, with wide margins — so it
               * is `object-contain` (cover would slice the chevron), carries no
               * circular clip (which would cut its tips), and needs a bigger box
               * than a headshot would: those margins mean the face occupies only
               * the middle of the frame.
               */
              <span className="relative size-20 shrink-0 bg-white">
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </span>
            ) : (
              <span
                aria-hidden
                className="grid size-20 shrink-0 place-items-center rounded-full bg-brand/10 text-base font-bold tracking-wide text-brand"
              >
                {initials(name)}
              </span>
            )}

            <p className="font-semibold tracking-tight text-brand-navy">{name}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** First letter of the first and last name, e.g. "Awais Ranjha" -> "AR". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts.at(0)?.at(0) ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.at(0) ?? "") : "";

  return `${first}${last}`.toUpperCase();
}
