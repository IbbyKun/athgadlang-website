import Image from "next/image";

import { Section } from "@/components/ui/section";
import { aboutPillars } from "@/lib/about";

/**
 * "What We Stand On" — the heading at the left, Mission / Vision / Values as
 * three photo cards at the right.
 *
 * The cards are deliberately bottom-weighted: each is a photograph washed to
 * near-navy with its label at the top and its copy sitting on the floor of the
 * card. That keeps three paragraphs of markedly different lengths aligned along
 * one edge instead of three ragged ones.
 */
export function AboutPillarsSection() {
  return (
    <Section containerSize="wide" className="relative isolate bg-neutral-50">
      {/* The pale lobe the design sweeps behind the heading. Decorative, and
          hidden below lg where the heading sits above the cards instead. */}
      <span
        aria-hidden
        className="absolute left-0 top-1/2 -z-10 hidden h-[34rem] w-[34rem] -translate-x-1/3 -translate-y-1/2 rounded-[46%_54%_52%_48%/_48%_42%_58%_52%] bg-neutral-200/70 lg:block"
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] lg:items-center lg:gap-14">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-brand-navy sm:text-3xl lg:text-balance">
          What We Stand On
        </h2>

        <ul className="grid gap-5 sm:grid-cols-3">
          {aboutPillars.map((pillar) => (
            <li
              key={pillar.title}
              className="relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white sm:rounded-[1.75rem]"
            >
              <Image
                src={pillar.image}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="-z-20 object-cover"
              />
              {/* Two layers, not one: a flat wash to carry the navy and a
                  gradient to keep the copy legible where the photo is busiest. */}
              <span
                aria-hidden
                className="absolute inset-0 -z-10 bg-brand-navy/80"
              />
              <span
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent"
              />

              <h3 className="text-sm font-bold uppercase tracking-[0.18em]">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/85 lg:text-justify">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
