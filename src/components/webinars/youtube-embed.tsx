"use client";

import * as React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { BrandSpinner } from "@/components/ui/brand-spinner";
import {
  youtubeEmbedUrl,
  youtubePlayerAllow,
  youtubeThumbnail,
} from "@/lib/youtube";
import { cn } from "@/lib/utils";

/**
 * A YouTube video played in place, on the page itself.
 *
 * A facade, for the same reason `WebinarPlayer` is one: the iframe brings
 * roughly a megabyte of YouTube's JavaScript, which would make a section that
 * most readers scroll past the heaviest thing on the page. Until someone
 * presses play this is the video's own still and a button, and the player is
 * only created on that press, which is also what makes autoplay honest.
 *
 * Inline rather than in a dialog: here the video is the section, not one item
 * picked from a list, so it plays where it was found.
 */
export function YoutubeEmbed({
  videoId,
  title,
  className,
}: {
  videoId: string;
  /** The video's own title. Names the iframe and the play button. */
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = React.useState(false);
  // The iframe says nothing until it has loaded, so the spinner sits behind it
  // and is covered when the player paints.
  const [ready, setReady] = React.useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10",
        className,
      )}
    >
      {playing ? (
        <>
          {!ready && (
            <span className="absolute inset-0 grid place-items-center">
              <BrandSpinner className="scale-150" label="Loading the video" />
            </span>
          )}
          <iframe
            src={youtubeEmbedUrl(videoId)}
            title={title}
            allow={youtubePlayerAllow}
            allowFullScreen
            onLoad={() => setReady(true)}
            className="absolute inset-0 size-full"
          />
        </>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src={youtubeThumbnail(videoId, "max")}
            alt=""
            fill
            sizes="(min-width: 1024px) 56rem, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span aria-hidden className="absolute inset-0 bg-neutral-950/25" />
          {/* White with a red glyph rather than the reverse: the firm's own
              stills are often brand red, and a red disc vanishes into them. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-lg transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:size-20"
          >
            <Play className="ml-1 size-7 fill-current sm:size-8" />
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
