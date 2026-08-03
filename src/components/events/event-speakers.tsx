import Image from "next/image";
import Link from "next/link";

import type { EventSpeaker } from "@/lib/events";
import { getLeader, leaderHref } from "@/lib/leaders";
import { cn } from "@/lib/utils";

/**
 * Who is presenting.
 *
 * A speaker who is on the leadership team gets their photograph and a link
 * through to their profile; anybody else gets their initials. That keeps the
 * list complete without needing a portrait for every presenter, which is the
 * usual reason a speaker list ends up incomplete.
 */
export function EventSpeakers({ speakers }: { speakers: EventSpeaker[] }) {
  if (speakers.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-brand">
        {speakers.length === 1 ? "Presenter" : `Presenters (${speakers.length})`}
      </h2>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {speakers.map((speaker) => (
          <li key={speaker.name}>
            <SpeakerRow speaker={speaker} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SpeakerRow({ speaker }: { speaker: EventSpeaker }) {
  const leader = speaker.leader ? getLeader(speaker.leader) : undefined;

  const body = (
    <>
      {leader ? (
        /*
         * Contained on white, not cropped into a circle: the portraits are the
         * person inside the red aG chevron on a transparent background, and a
         * circular `object-cover` clip slices the chevron and shrinks the face.
         * Same reasoning as <KeyTeam>.
         */
        <span className="relative size-14 shrink-0 bg-white">
          <Image
            src={leader.image.src}
            alt=""
            fill
            sizes="56px"
            className="object-contain"
          />
        </span>
      ) : (
        <span
          aria-hidden
          className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-navy/10 text-sm font-bold text-brand-navy"
        >
          {initials(speaker.name)}
        </span>
      )}

      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate text-sm font-bold text-brand-navy",
            leader && "transition-colors group-hover/speaker:text-brand",
          )}
        >
          {speaker.name}
        </span>
        <span className="truncate text-xs text-neutral-500">{speaker.role}</span>
      </span>
    </>
  );

  const shell =
    "flex items-center gap-3 rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200";

  if (!leader) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <Link
      href={leaderHref(leader)}
      className={cn(
        shell,
        "group/speaker transition-colors hover:bg-white hover:ring-brand/40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      {body}
    </Link>
  );
}

/** First and last initial — "Usman Hussain Khan" becomes "UK". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
