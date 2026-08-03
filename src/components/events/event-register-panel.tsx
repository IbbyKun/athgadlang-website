import { ArrowUpRight, PlayCircle } from "lucide-react";

import { EventFacts } from "@/components/events/event-meta";
import { Button } from "@/components/ui/button";
import { isUpcoming, type EventItem } from "@/lib/events";

/**
 * The panel beside an event: what you can do about it, then when and where it
 * is. Sticky on wide screens, so the action stays reachable however long the
 * write-up runs.
 *
 * Four states, because an event is only sometimes something you can act on:
 * open for registration, not open yet, ended with a recording, ended without
 * one. Each says so plainly instead of showing a button that does nothing.
 */
export function EventRegisterPanel({ event }: { event: EventItem }) {
  const upcoming = isUpcoming(event);

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
      <Action event={event} upcoming={upcoming} />

      <hr className="border-neutral-200" />

      <EventFacts event={event} />
    </div>
  );
}

function Action({
  event,
  upcoming,
}: {
  event: EventItem;
  upcoming: boolean;
}) {
  if (upcoming) {
    return event.registerUrl ? (
      <div className="flex flex-col gap-2">
        <Button asChild size="lg" className="h-11 w-full text-base">
          <a href={event.registerUrl} target="_blank" rel="noreferrer">
            Register now
            <ArrowUpRight aria-hidden />
          </a>
        </Button>
        <p className="text-center text-xs text-neutral-500">
          Registration takes a minute. We will email you the joining details.
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        <p className="rounded-lg bg-neutral-100 px-3 py-2.5 text-center text-sm font-semibold text-neutral-600">
          Registration is not open yet
        </p>
        <p className="text-center text-xs text-neutral-500">
          Speak to your usual contact and we will hold you a place.
        </p>
      </div>
    );
  }

  return event.recordingUrl ? (
    <div className="flex flex-col gap-2">
      <p className="rounded-lg bg-neutral-100 px-3 py-2.5 text-center text-sm font-semibold text-neutral-600">
        This event has ended
      </p>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-11 w-full text-base"
      >
        <a href={event.recordingUrl} target="_blank" rel="noreferrer">
          <PlayCircle aria-hidden />
          Watch the recording
        </a>
      </Button>
    </div>
  ) : (
    <p className="rounded-lg bg-neutral-100 px-3 py-2.5 text-center text-sm font-semibold text-neutral-600">
      This event has ended
    </p>
  );
}
