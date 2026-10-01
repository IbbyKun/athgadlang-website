import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { Container } from "@/components/ui/container";
import { aboutListen } from "@/lib/about";

/**
 * "Hear It, Not Just Read It".
 *
 * The design draws this as a full-bleed photograph with a heading over it and
 * no affordance of any kind — no play control, no link, no video named
 * anywhere. A band that promises three minutes of something and cannot be
 * pressed reads as broken, so it is built as a link through to aG Studio, which
 * is where the firm's recorded material already lives.
 *
 * If a real film turns up, `WebinarPlayer` is the piece to reach for: it mounts
 * the YouTube iframe only once the dialog opens, and takes a bare video id.
 */
export function AboutListenBand() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-900">
      <Image
        src={aboutListen.image.src}
        alt={aboutListen.image.alt}
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-neutral-950/65" />

      <Container size="wide" className="py-24 sm:py-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 className="flex items-center gap-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
            {aboutListen.title}
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
          </h2>

          <p className="text-pretty text-base leading-relaxed text-white/75">
            {aboutListen.description}
          </p>

          <Link
            href={aboutListen.href}
            className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Play aria-hidden className="size-4 fill-current" />
            {aboutListen.cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
