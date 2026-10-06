import Image from "next/image";

import { Container } from "@/components/ui/container";
import { YoutubeEmbed } from "@/components/webinars/youtube-embed";
import { aboutListen } from "@/lib/about";

/**
 * "Hear It, Not Just Read It": the design's photographic band, with the firm's
 * film playing in it.
 *
 * The photograph stays as the backdrop, washed dark, so the band still reads
 * as the design's full-bleed break between the firms row and the newsletters.
 * The player sits under the copy rather than replacing it: the line above it
 * is what tells a reader the three minutes are worth pressing play for.
 */
export function AboutListenBand() {
  const { title, description, video, image } = aboutListen;

  return (
    <section className="relative isolate overflow-hidden bg-neutral-900">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-neutral-950/70" />

      <Container size="wide" className="py-20 sm:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <h2 className="flex items-center gap-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
            {title}
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand" />
          </h2>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/75">
            {description}
          </p>

          <YoutubeEmbed
            videoId={video.id}
            title={video.title}
            className="mt-5 w-full"
          />
        </div>
      </Container>
    </section>
  );
}
