import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/ui/section";
import { formatDate } from "@/lib/format";
import { images } from "@/lib/images";
import { legalUpdated, type LegalDocument } from "@/lib/legal";

/**
 * Renders one of the three legal documents.
 *
 * Set in a single measured column rather than the site's wider content grid:
 * these are read start to finish, and prose at 65-ish characters a line is the
 * only thing that makes that bearable. No cards, no accordions — a reader
 * looking for the liability clause should be able to find it with ⌘F, which
 * means every clause is open and in the page.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <Hero
        eyebrow="Legal"
        title={document.title}
        description={document.summary}
        image={images.hero.home}
        fullScreen={false}
      />

      <Section className="bg-white">
        <article className="mx-auto flex max-w-2xl flex-col gap-8">
          <p className="text-pretty text-lg leading-relaxed text-neutral-700">
            {document.preamble}
          </p>

          <hr className="border-neutral-200" />

          {document.clauses.map((clause) => (
            <section key={clause.heading} className="flex flex-col gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-brand-navy">
                {clause.heading}
              </h2>
              {clause.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-pretty text-base leading-relaxed text-neutral-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {document.closing && (
            <>
              <hr className="border-neutral-200" />
              <p className="text-pretty text-base leading-relaxed text-neutral-700">
                {document.closing}
              </p>
            </>
          )}

          {/* A legal document with no date is hard to rely on. */}
          <p className="text-sm text-neutral-500">
            Last updated{" "}
            <time dateTime={legalUpdated}>{formatDate(legalUpdated)}</time>.
          </p>
        </article>
      </Section>

      {/* Ends on a next step rather than dropping the reader into the footer,
          the same as the other inner pages. */}
      <CtaBand
        title="Questions about any of this?"
        description="Speak to the team that operates this site and holds the records behind it."
      />
    </>
  );
}
