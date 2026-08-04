"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

import { WebinarPlayer } from "@/components/webinars/webinar-player";
import { formatDate } from "@/lib/format";
import { webinarHref, type Webinar } from "@/lib/webinars";
import { cn } from "@/lib/utils";

type WebinarCardProps = {
  webinar: Webinar;
  sizes?: string;
  className?: string;
};

/**
 * Video card: framed thumbnail with a play affordance, title underneath.
 * On hover the card lifts, the thumbnail dims and zooms, and the play button
 * fills with brand red.
 *
 * The whole card is one hit area, matching the other card components. It opens
 * the recording in a player over the page rather than sending the reader to
 * YouTube — see <WebinarPlayer> for why that is a dialog and not an embed.
 */
export function WebinarCard({
  webinar,
  sizes = "(min-width: 1280px) 24rem, (min-width: 1024px) 32vw, (min-width: 640px) 47vw, 92vw",
  className,
}: WebinarCardProps) {
  const [playing, setPlaying] = React.useState(false);

  // A session with no video id has nothing to play; it keeps the old link to
  // the listing rather than offering a button that would do nothing.
  const videoId = webinar.youtubeId;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-white p-1.5",
        "ring-1 ring-neutral-900/10 shadow-sm transition duration-300 ease-out",
        // Brand-red edge on hover, thickened so it reads as a border.
        "hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-brand",
        "focus-within:-translate-y-1.5 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-brand",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-video shrink-0 overflow-hidden rounded-md bg-neutral-200">
        <Image
          src={webinar.image.src}
          alt={webinar.image.alt}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            "group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none",
          )}
        />

        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-neutral-950/25 opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        />

        <span
          aria-hidden
          className={cn(
            "absolute inset-0 grid place-items-center transition-transform duration-300",
            "group-hover:scale-110 group-focus-within:scale-110 motion-reduce:transition-none",
          )}
        >
          <span
            className={cn(
              "grid size-12 place-items-center rounded-full bg-white/90 text-brand shadow-lg transition-colors duration-300",
              "group-hover:bg-brand group-hover:text-white group-focus-within:bg-brand group-focus-within:text-white",
            )}
          >
            <Play className="size-5 translate-x-px fill-current" />
          </span>
        </span>

        {/* Runtime is optional in the admin panel; an empty badge is worse
            than none. */}
        {webinar.duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-neutral-950/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {webinar.duration}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pb-1 pt-2.5">
        <h3
          className={cn(
            "line-clamp-2 text-[0.95rem] font-bold leading-snug tracking-tight text-brand-navy",
            "transition-colors duration-300 group-hover:text-brand",
          )}
        >
          {videoId ? (
            // Plays in place. A button, not a link: it opens a dialog on this
            // page, and a link that does not navigate is a lie to a screen
            // reader and to anyone middle-clicking it.
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="text-left outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {webinar.title}
              <span className="sr-only"> — play the recording</span>
            </button>
          ) : (
            <Link
              href={webinarHref(webinar)}
              className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {webinar.title}
            </Link>
          )}
        </h3>

        <time
          dateTime={webinar.date}
          className="mt-auto text-xs font-medium text-neutral-500"
        >
          {formatDate(webinar.date)}
        </time>
      </div>

      {videoId && (
        <WebinarPlayer
          open={playing}
          onOpenChange={setPlaying}
          videoId={videoId}
          title={webinar.title}
          date={webinar.date}
          duration={webinar.duration}
        />
      )}
    </article>
  );
}
