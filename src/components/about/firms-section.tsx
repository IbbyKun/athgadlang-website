import Image from "next/image";

import { Section, SectionHeading } from "@/components/ui/section";
import { aboutFirms, aboutFirmsIntro } from "@/lib/about";

/**
 * The three specialist firms, as a logo row.
 *
 * Only Wathiq has a wordmark that carries its own name. The other two are the
 * shared aG mark with the firm's name typeset beside it — which is how the
 * design composes them, and how the brand actually works, so they are built
 * that way rather than blocked on lockup files that do not exist. If proper
 * ones arrive, drop `lockup` from the entry in `about.ts` and the name stops
 * being rendered.
 */
export function AboutFirmsSection() {
  return (
    <Section containerSize="wide" className="bg-white">
      <div className="flex flex-col items-center gap-10">
        <SectionHeading
          title={aboutFirmsIntro.title}
          description={aboutFirmsIntro.description}
        />

        <ul className="grid w-full max-w-4xl grid-cols-1 items-center justify-items-center gap-10 sm:grid-cols-3 sm:gap-8">
          {aboutFirms.map((firm) => (
            <li key={firm.name} className="flex items-center gap-3">
              <Image
                src={firm.logo}
                alt={firm.lockup ? "" : firm.name}
                width={firm.lockup ? 96 : 160}
                height={firm.lockup ? 96 : 96}
                className="h-16 w-auto object-contain sm:h-20"
              />
              {firm.lockup && (
                <span className="max-w-[9rem] text-xl leading-tight text-brand-navy sm:text-2xl">
                  {firm.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
