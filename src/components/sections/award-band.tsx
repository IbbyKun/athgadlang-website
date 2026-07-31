import Image from "next/image";

import { Section } from "@/components/ui/section";
import { type Award } from "@/lib/site-config";

/**
 * Recognition band: the claim on the left, the badge on the right, on navy.
 *
 * The badge falls back to a typographic plaque. The awarding body's shield is
 * their artwork — set `award.image` once the file is in `public/images/` and it
 * takes over.
 */
export function AwardBand({ award }: { award: Award }) {
  return (
    <Section
      containerSize="wide"
      className="isolate overflow-hidden bg-brand-navy"
    >
      {/* Warm wash behind the badge, so the gold does not sit on flat navy. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_28rem_at_82%_25%,rgba(251,191,36,0.18),transparent_70%)]"
      />

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/85">
            <span aria-hidden className="h-0.5 w-8 bg-amber-300" />
            Recognition
          </p>

          <h2 className="text-balance text-3xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {award.headline}{" "}
            {/* Italic amber stands in for the script setting on the original
                artwork — the site loads one typeface, and a display face for a
                single phrase is not worth the weight. */}
            <span className="font-semibold normal-case italic text-amber-300">
              {award.accent}
            </span>
          </h2>

          {award.note && (
            <p className="max-w-xl text-pretty text-base italic leading-relaxed text-white/75 sm:text-lg">
              {award.note}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-5">
          {award.tier && (
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              {award.tier}
            </p>
          )}

          {award.image ? (
            <Image
              src={award.image.src}
              alt={award.image.alt}
              width={award.image.width}
              height={award.image.height}
              className="h-auto w-full max-w-[16rem] drop-shadow-2xl"
            />
          ) : (
            <Plaque badge={award.badge} />
          )}
        </div>
      </div>
    </Section>
  );
}

/** Stand-in for the award badge: a gold-edged plaque set in type. */
function Plaque({ badge }: { badge: Award["badge"] }) {
  return (
    <div className="w-full max-w-[16rem] rounded-[1.75rem] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 p-1.5 shadow-2xl">
      <div className="flex flex-col items-center gap-1 rounded-[1.4rem] bg-white px-6 py-8 text-center">
        <p className="text-balance text-lg font-bold uppercase leading-tight tracking-tight text-brand-navy">
          {badge.primary}
        </p>
        <p className="text-4xl font-bold leading-none tracking-tight text-brand-navy">
          {badge.year}
        </p>
        {badge.scope && (
          <p className="mt-1 text-sm font-medium text-neutral-500">
            {badge.scope}
          </p>
        )}
        <span
          aria-hidden
          className="mt-3 h-0.5 w-10 rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
        />
      </div>
    </div>
  );
}
