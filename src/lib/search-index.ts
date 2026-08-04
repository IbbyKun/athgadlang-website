import {
  eventHref,
  eventKindShortLabel,
  eventLocation,
  type EventItem,
} from "@/lib/events";
import { insightHref, type Insight } from "@/lib/insights";
import { leaderHref, leaders } from "@/lib/leaders";
import type { SearchItem } from "@/lib/search";
import { serviceCategories } from "@/lib/services";
import { webinarLink, type Webinar } from "@/lib/webinars";

/**
 * Builds the navbar search index.
 *
 * Runs on the server, once per rendered page, and the finished array is passed
 * to the search box as a prop. That is the whole reason this is a function
 * taking content rather than a constant: articles, sessions and events come from
 * the database now, so the index cannot be assembled at build time from the
 * modules in src/lib and still be right.
 *
 * Services and people are not passed in because they are not in the database —
 * they are code, the same for every region, so they are read directly here.
 */

/** The regional content to index, as `src/lib/content.ts` returns it. */
export type SearchContent = {
  insights: Insight[];
  webinars: Webinar[];
  events: EventItem[];
};

export function buildSearchIndex({
  insights,
  webinars,
  events,
}: SearchContent): SearchItem[] {
  return (
    [
      ...serviceCategories.flatMap((category) => [
        {
          kind: "Service" as const,
          title: category.label,
          subtitle: "Practice area",
          href: category.href,
          keywords: category.description ? [category.description] : undefined,
        },
        ...(category.items ?? []).map((service) => ({
          kind: "Service" as const,
          title: service.label,
          subtitle: category.label,
          href: service.href,
        })),
      ]),
      ...leaders.map((leader) => ({
        kind: "Person" as const,
        title: leader.name,
        subtitle: leader.role,
        href: leaderHref(leader),
        keywords: leader.profile?.focus,
      })),
      ...events.map((event) => ({
        kind: "Event" as const,
        title: event.title,
        subtitle: eventKindShortLabel[event.kind],
        href: eventHref(event),
        keywords: [event.excerpt, eventLocation(event)],
      })),
      ...insights.map((insight) => ({
        kind: "Insight" as const,
        title: insight.title,
        subtitle: insight.category,
        href: insightHref(insight),
        keywords: [insight.excerpt],
      })),
      ...webinars.map((webinar) => {
        const link = webinarLink(webinar);
        return {
          kind: "Webinar" as const,
          title: webinar.title,
          subtitle: link.external ? "Recording" : "Webinars",
          href: link.href,
          external: link.external,
        };
      }),
    ]
      // The same service can be listed under two practices; keep the first.
      // Webinars are deduplicated by this too: a session with no video id falls
      // back to /webinars, and two of those would collide on href.
      .filter(
        (item, index, all) =>
          all.findIndex((other) => other.href === item.href) === index,
      )
  );
}
