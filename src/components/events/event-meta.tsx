import {
  CalendarDays,
  Clock,
  Coffee,
  Globe,
  MapPin,
  Radio,
  Ticket,
  Users,
} from "lucide-react";

import {
  eventKindLabel,
  eventKindShortLabel,
  eventLocation,
  eventPrice,
  type EventItem,
  type EventKind,
} from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The small pieces that describe an event, shared by its cards and its page so
 * a webinar reads the same wherever it appears.
 */

/**
 * Webinars are broadcast, seminars are somewhere you go, and networking is
 * somewhere you go to talk to people rather than be presented at.
 */
const kindIcon: Record<EventKind, typeof Radio> = {
  webinar: Radio,
  seminar: Users,
  networking: Coffee,
};

/** Brand red for broadcast, navy for in-person. */
const kindTone: Record<EventKind, string> = {
  webinar: "bg-brand/10 text-brand",
  seminar: "bg-brand-navy/10 text-brand-navy",
  networking: "bg-brand-navy/10 text-brand-navy",
};

/**
 * What kind of session this is. Brand red for a webinar and navy for a
 * seminar, so the two are separable at a glance in a mixed grid — the icon
 * carries the same distinction for anyone who cannot rely on the colour.
 */
export function EventKindPill({
  kind,
  short = false,
  className,
}: {
  kind: EventKind;
  short?: boolean;
  className?: string;
}) {
  const Icon = kindIcon[kind];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
        kindTone[kind],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {short ? eventKindShortLabel[kind] : eventKindLabel[kind]}
    </span>
  );
}

/**
 * Whether it has happened yet. Only rendered where both states occur in the
 * same view — a card in the "previous" grid does not need telling twice.
 */
export function EventStatusPill({
  upcoming,
  className,
}: {
  upcoming: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        upcoming
          ? "bg-emerald-50 text-emerald-700"
          // 600, not 500: on the neutral-100 fill 500 measured 4.34:1, just
          // under the threshold. This pill is the only thing saying an event has
          // already happened, so it has to be legible.
          : "bg-neutral-100 text-neutral-600",
        className,
      )}
    >
      {upcoming ? "Upcoming" : "Ended"}
    </span>
  );
}

/**
 * The when, where and who-can-come, as an icon list.
 *
 * One component for the card and the page, because these three facts are the
 * ones a reader checks before anything else and they should not be phrased or
 * ordered differently in the two places.
 */
export function EventFacts({
  event,
  className,
}: {
  event: EventItem;
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-col gap-3", className)}>
      <Fact icon={CalendarDays} label="Date">
        <time dateTime={event.date}>{formatEventDate(event.date)}</time>
      </Fact>

      <Fact icon={Clock} label="Time">
        {event.time}
        <span className="text-neutral-500"> {event.timezone}</span>
      </Fact>

      <Fact icon={MapPin} label="Location">
        {eventLocation(event)}
      </Fact>

      <Fact icon={Ticket} label="Cost">
        {eventPrice(event)}
      </Fact>

      {/* Only where the event has something to add beyond the cost and the
          registration link, which between them answer most of it. */}
      {event.access && (
        <Fact icon={Globe} label="Who can attend">
          {event.access}
        </Fact>
      )}
    </dl>
  );
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Radio;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
      {/* The label is for screen readers: the icon carries it visually, and
          repeating "Date:" in front of a date reads as noise. */}
      <dt className="sr-only">{label}</dt>
      <dd className="text-neutral-700">{children}</dd>
    </div>
  );
}

/** Compact inline version for a card, where a stacked list is too tall. */
export function EventFactLine({
  event,
  className,
}: {
  event: EventItem;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500",
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <Clock aria-hidden className="size-3.5 text-brand" />
        {event.time}
      </span>
      <span className="flex items-center gap-1.5">
        <MapPin aria-hidden className="size-3.5 text-brand" />
        {eventLocation(event)}
      </span>
    </p>
  );
}
