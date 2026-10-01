import { Section } from "@/components/ui/section";
import { aboutFigures, aboutStory } from "@/lib/about";
import { cn } from "@/lib/utils";

/**
 * "Our Story" — justified prose on the left, four figure tiles on the right.
 *
 * The tiles are a 2x2 block from `lg` up, which is what makes the pairing work:
 * three paragraphs and four tiles come to roughly the same height, so neither
 * column leaves a hole under it. Below `lg` the tiles move under the prose and
 * stay two-up, because a single column of four would push the timeline an
 * entire screen further down a phone for no gain.
 */
export function AboutStorySection() {
  return (
    <Section containerSize="wide" className="bg-white">
      <div className="flex flex-col gap-12">
        <h2 className="flex items-center gap-4 text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
          <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
          {aboutStory.title}
          <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
        </h2>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-5 text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg lg:text-justify">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:gap-5">
            {aboutFigures.map((figure) => (
              <li
                key={figure.value}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 rounded-2xl px-5 py-8 text-center text-white sm:rounded-[1.75rem] sm:px-6 sm:py-10",
                  figure.tone === "brand" ? "bg-brand" : "bg-brand-navy",
                )}
              >
                <span className="text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                  {figure.value}
                </span>
                <span className="text-sm leading-relaxed text-white/85">
                  {figure.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
