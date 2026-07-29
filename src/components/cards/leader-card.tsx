import Image from "next/image";
import Link from "next/link";

import { LinkedinIcon } from "@/components/icons/linkedin";
import { leaderHref, type Leader } from "@/lib/leaders";
import { cn } from "@/lib/utils";

type LeaderCardProps = {
  leader: Leader;
  sizes?: string;
  className?: string;
};

/**
 * Face card built on the same pattern as ServiceCard: photo fills the card,
 * name sits bottom-left, and on hover the photo dims while the name slides up
 * to reveal View Profile and the LinkedIn link.
 *
 * Two tab stops here — unlike the other cards — because there are genuinely
 * two destinations. The name is the stretched card link; the LinkedIn anchor
 * sits above it on z-10.
 */
export function LeaderCard({
  leader,
  sizes = "(min-width: 1280px) 14rem, (min-width: 1024px) 15vw, (min-width: 768px) 25vw, 45vw",
  className,
}: LeaderCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900",
        "shadow-sm ring-1 ring-neutral-900/5 transition-shadow duration-500",
        "hover:shadow-2xl focus-within:shadow-2xl",
        className,
      )}
    >
      <Image
        src={leader.image.src}
        alt={leader.image.alt}
        fill
        sizes={sizes}
        className={cn(
          // object-top keeps faces in frame as the square crop tightens.
          "-z-10 object-cover object-top transition-transform duration-700 ease-out",
          "group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none",
        )}
      />

      {/* Resting scrim for name legibility. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent"
      />
      {/* Hover scrim so the revealed controls read cleanly. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-neutral-950/55 opacity-0 transition-opacity duration-500",
          "group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
        )}
      />

      <div className="mt-auto flex w-full flex-col p-3">
        <h3 className="text-[0.95rem] font-bold leading-tight tracking-tight text-white">
          <Link
            href={leaderHref(leader)}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-white/80"
          >
            {leader.name}
          </Link>
        </h3>

        <p className="pt-1 text-xs leading-snug text-white/75">{leader.role}</p>

        {/* 0fr → 1fr animates the height, sliding the name upward. */}
        <div
          className={cn(
            "grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out",
            "group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] motion-reduce:transition-none",
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                "flex items-center gap-2 pt-3 opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
              )}
            >
              <span
                aria-hidden
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white"
              >
                View Profile
              </span>

              {leader.linkedin && (
                <a
                  href={leader.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${leader.name} on LinkedIn`}
                  className={cn(
                    "relative z-10 grid size-8 shrink-0 place-items-center rounded-md bg-white/15 text-white transition-colors",
                    "hover:bg-white hover:text-[#0A66C2] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none",
                  )}
                >
                  <LinkedinIcon className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
