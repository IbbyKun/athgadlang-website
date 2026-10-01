import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { Section } from "@/components/ui/section";
import {
  aboutTimeline,
  aboutTimelineCoda,
  type AboutChapter,
} from "@/lib/about";
import { cn } from "@/lib/utils";

/**
 * "A Firm Written in Chapters" — the office-by-office history.
 *
 * Two layouts, and they are genuinely different rather than one squeezed.
 *
 * From `lg` the chapters zigzag either side of a centred spine: prose on one
 * flank, that office's three photographs on the other, swapping every row. The
 * copy takes the alignment of its flank — right-aligned when it sits left of
 * the spine — so both columns read against the centre line rather than away
 * from it, which is what makes the spine look like it is holding the page
 * together instead of merely passing through it.
 *
 * Below `lg` the spine moves to the left margin and every chapter stacks behind
 * it in one column. The zigzag cannot survive a phone: halving it leaves two
 * columns of roughly 150px, and alternating the side a chapter starts on makes
 * a reader hunt for where each one begins. A single rail with the dots down the
 * left edge keeps the one thing the layout is actually for — that these are
 * ordered chapters of a single story.
 *
 * The photographs become a snap-scrolling row at that width for the same
 * reason: three stacked images per chapter, six offices, is eighteen photos
 * stacked end to end before the reader reaches the next section.
 *
 * The spine stops at the last chapter. "Today" sits below its end, centred,
 * because it is the point the line has reached rather than a stop along it.
 */
export function AboutTimelineSection() {
  return (
    <Section containerSize="wide" className="bg-brand-navy">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
            Timeline - Our Story
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            A Firm Written in Chapters
          </h2>
        </div>

        <ol className="relative flex flex-col gap-14 lg:gap-20">
          {/* The spine. Inset on a phone so the dots clear the text column;
              dead centre from lg, where the chapters straddle it. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-[7px] w-px bg-brand/70 lg:left-1/2"
          />

          {aboutTimeline.map((chapter, index) => (
            <Chapter
              key={chapter.slug}
              chapter={chapter}
              /* The design opens with the prose right of the spine, then
                 alternates. */
              proseOnRight={index % 2 === 0}
            />
          ))}
        </ol>

        <Coda />
      </div>
    </Section>
  );
}

function Coda() {
  const { place, headline, body } = aboutTimelineCoda;

  return (
    <div className="relative -mt-4 flex flex-col gap-4 pl-10 pt-8 lg:-mt-8 lg:items-center lg:pl-0 lg:text-center">
      <Dot />
      <h3 className="text-base font-bold leading-snug tracking-tight text-white">
        {place}
        <span className="block text-white/90">{headline}</span>
      </h3>
      <p className="max-w-xl text-sm leading-relaxed text-white/75">{body}</p>
    </div>
  );
}

function Chapter({
  chapter,
  proseOnRight,
}: {
  chapter: AboutChapter;
  proseOnRight: boolean;
}) {
  const { flag, photos, place, headline, body } = chapter;

  return (
    <li className="relative pl-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 lg:pl-0">
      <Dot />

      <div
        className={cn(
          "flex flex-col gap-4",
          proseOnRight
            ? "lg:col-start-2"
            : "lg:col-start-1 lg:row-start-1 lg:text-right",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            !proseOnRight && "lg:flex-row-reverse",
          )}
        >
          {flag ? (
            <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25">
              <Image src={flag} alt="" fill sizes="36px" className="object-cover" />
            </span>
          ) : (
            <ChevronRight
              aria-hidden
              className="size-8 shrink-0 stroke-[3] text-brand"
            />
          )}

          <h3 className="text-base font-bold leading-snug tracking-tight text-white">
            {place}
            <span className="block font-bold text-white/90">{headline}</span>
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-white/75">{body}</p>
      </div>

      {photos && (
        <ul
          className={cn(
            // Scroll-snapped on a phone, an even three-up from sm.
            "-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2",
            "sm:mx-0 sm:mt-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0",
            "lg:row-start-1",
            proseOnRight ? "lg:col-start-1" : "lg:col-start-2",
          )}
        >
          {photos.map((photo) => (
            <li
              key={photo}
              className="relative aspect-4/3 w-[72%] shrink-0 snap-start overflow-hidden rounded-xl bg-white/5 sm:w-auto"
            >
              <Image
                src={photo}
                alt=""
                fill
                sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 72vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** The marker where a chapter meets the spine. */
function Dot() {
  return (
    <span
      aria-hidden
      className="absolute left-0 top-1 size-[15px] rounded-full bg-brand ring-4 ring-brand-navy lg:left-1/2 lg:-translate-x-1/2"
    />
  );
}
