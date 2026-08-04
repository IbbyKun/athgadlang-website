"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { ExternalLink, X } from "lucide-react";

import { BrandSpinner } from "@/components/ui/brand-spinner";
import { formatDate } from "@/lib/format";
import { externalLinkProps } from "@/lib/links";
import { youtubeWatchUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

/**
 * Plays a recording without leaving the site.
 *
 * A facade, not an embed: the player is only created when someone asks for it.
 * A YouTube iframe pulls roughly a megabyte of its own JavaScript, and a
 * listing of twenty-seven cards that each embedded one would be slower than the
 * whole rest of the site put together. Radix mounts dialog content on open, so
 * the card costs nothing until it is clicked — the thumbnail on the card is the
 * poster frame, and it is already there.
 *
 * `youtube-nocookie.com` rather than `youtube.com`: it is the same player
 * without the advertising cookies, which is the right default on a firm's own
 * site and one less thing for a cookie notice to have to declare.
 */
export function WebinarPlayer({
  open,
  onOpenChange,
  videoId,
  title,
  date,
  duration,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  title: string;
  date: string;
  duration?: string;
}) {
  // The iframe reports nothing useful until it has loaded, so the spinner sits
  // behind it and is covered when the player paints.
  const [ready, setReady] = React.useState(false);

  // Closing unmounts the iframe, so opening always means a fresh load and a
  // fresh wait. Reset here rather than in an effect: this is the event that
  // causes it.
  function change(next: boolean) {
    if (next) setReady(false);
    onOpenChange(next);
  }

  return (
    <Dialog.Root open={open} onOpenChange={change}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-neutral-950/80",
            "data-open:animate-in data-open:fade-in-0",
            "data-closed:animate-out data-closed:fade-out-0",
          )}
        />

        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[min(64rem,calc(100vw-2rem))]",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-xl bg-brand-navy p-2 shadow-2xl outline-none",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0",
          )}
        >
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            {!ready && (
              <span className="absolute inset-0 grid place-items-center">
                <BrandSpinner className="scale-150" label="Loading the recording" />
              </span>
            )}

            <iframe
              // autoplay is honest here: the reader pressed play to get here.
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setReady(true)}
              className="absolute inset-0 size-full"
            />
          </div>

          <div className="flex items-start justify-between gap-4 px-2 py-2.5">
            <div className="min-w-0">
              <Dialog.Title className="truncate text-sm font-bold text-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-white/60">
                {formatDate(date)}
                {duration ? ` · ${duration}` : ""}
              </Dialog.Description>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {/* Some people would rather watch it where they can subscribe. */}
              <a
                href={youtubeWatchUrl(videoId)}
                {...externalLinkProps}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-md text-white/70",
                  "transition-colors hover:bg-white/10 hover:text-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                )}
              >
                <ExternalLink aria-hidden className="size-4" />
                <span className="sr-only">Watch on YouTube</span>
              </a>

              <Dialog.Close
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-md text-white/70",
                  "transition-colors hover:bg-white/10 hover:text-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                )}
              >
                <X aria-hidden className="size-4" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
