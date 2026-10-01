import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/ui/section";
import { aboutNewsletters } from "@/lib/about";

/**
 * The three publications.
 *
 * Every SUBSCRIBE goes to the one sign-up the site has, in the footer. The
 * design gives each publication its own button, but the backend has a single
 * list: `subscribeToNewsletter` stores an address and a region and pushes it to
 * one Zoho list, with nothing to say which publication was wanted. Making the
 * three buttons appear to do different things while they do the same thing
 * would be a worse lie than sending all three to the same form.
 *
 * Three separate publications need a `publication` column on
 * `newsletter_subscribers` and three lists in Zoho — real work, worth doing
 * once the design is signed off rather than faked before it.
 */
export function AboutNewslettersSection() {
  return (
    <Section containerSize="wide" className="bg-white">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
            {aboutNewsletters.eyebrow}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
            {aboutNewsletters.title}
          </h2>
          <p className="text-base leading-relaxed text-neutral-600">
            {aboutNewsletters.description}
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {aboutNewsletters.publications.map((publication) => (
            <li
              key={publication.name}
              className="flex flex-col gap-4 rounded-2xl bg-neutral-50 p-5 ring-1 ring-neutral-200"
            >
              <div className="relative aspect-16/9 overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={publication.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold uppercase tracking-tight text-brand-navy">
                  {publication.name}
                </h3>
                <p className="text-sm italic text-neutral-500">
                  ({publication.cadence})
                </p>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-neutral-600">
                {publication.body}
              </p>

              <Link
                href="#newsletter"
                className="inline-flex w-fit items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Subscribe
                <span className="sr-only"> to {publication.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
