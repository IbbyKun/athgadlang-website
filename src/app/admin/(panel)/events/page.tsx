import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { deleteEvent } from "@/app/admin/actions";
import { ContentRow } from "@/components/admin/content-row";
import { SearchableGroups } from "@/components/admin/searchable-list";
import {
  EmptyState,
  PageHeader,
  SetupNotice,
} from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { listAllEvents } from "@/lib/admin/queries";
import { eventKindShortLabel, isUpcomingDate } from "@/lib/events";

export default async function AdminEventsPage() {
  const { rows, error } = await listAllEvents();

  // Upcoming first, soonest at the top, then the archive most-recent-first.
  // Sorted here rather than in the query because "upcoming" is a comparison
  // against today, which Postgres would have to be told about on every read.
  const upcoming = rows.filter((row) => isUpcomingDate(row.event_date));
  const past = rows.filter((row) => !isUpcomingDate(row.event_date)).reverse();

  return (
    <>
      <PageHeader
        title="Events"
        description="Upcoming sessions and the archive of ones that have run. Drafts are invisible to the public site."
        action={
          <Button asChild>
            <Link href="/admin/events/new">
              <PlusCircle aria-hidden />
              New event
            </Link>
          </Button>
        }
      />

      <SetupNotice message={error} />

      {rows.length === 0 && !error ? (
        <EmptyState
          title="No events yet"
          description="Add a session with its date, timings and registration link, and choose which regional sites it appears on."
          action={
            <Button asChild size="sm" className="mt-1">
              <Link href="/admin/events/new">
                <PlusCircle aria-hidden />
                New event
              </Link>
            </Button>
          }
        />
      ) : (
        <SearchableGroups
          label="events"
          groups={[
            { title: "Upcoming", items: toItems(upcoming) },
            { title: "Already run", items: toItems(past) },
          ]}
        />
      )}
    </>
  );
}

/** Rows as search items, so both shelves share one box. */
function toItems(rows: Awaited<ReturnType<typeof listAllEvents>>["rows"]) {
  return rows.map((row) => ({
    id: row.id,
    terms: [row.title, row.slug, row.venue, eventKindShortLabel[row.kind]],
    children: (
      <ContentRow
        href={`/admin/events/${row.id}`}
        title={row.title}
        meta={eventKindShortLabel[row.kind]}
        date={row.event_date}
        imageUrl={row.image_url}
        regions={row.regions}
        published={row.published}
        viewHref={row.published ? `/events/${row.slug}` : undefined}
        deleteAction={deleteEvent}
        id={row.id}
        label="event"
      />
    ),
  }));
}
