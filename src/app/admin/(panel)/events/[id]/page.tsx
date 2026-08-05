import { notFound } from "next/navigation";

import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/page-header";
import type { EventFormValues } from "@/lib/admin/form";
import { eventTimezones, getEventRow } from "@/lib/admin/queries";
import { isUpcomingDate, parseAgenda, parseSpeakers } from "@/lib/events";
import { leaderOptions } from "@/lib/leaders";
import type { RichDoc } from "@/lib/rich-text";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getEventRow(id);

  if (!row) notFound();

  // Mapped explicitly rather than passed through: the form is a Client
  // Component and the row type is server-only, and this is where a column
  // rename surfaces as a type error instead of an empty field.
  const values: EventFormValues = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kind: row.kind,
    date: row.event_date,
    time: row.start_time,
    timezone: row.timezone,
    mode: row.mode,
    venue: row.venue,
    price: row.price,
    access: row.access,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    registerUrl: row.register_url,
    recordingUrl: row.recording_url,
    body: (row.body as RichDoc | null) ?? null,
    /*
      Narrowed through the same parsers the public page uses, then widened back
      into form drafts: `leader` is optional on an EventSpeaker but the form's
      select needs a string to be controlled, so an absent one becomes "".
    */
    speakers: parseSpeakers(row.speakers).map((speaker) => ({
      name: speaker.name,
      role: speaker.role,
      leader: speaker.leader ?? "",
    })),
    agenda: parseAgenda(row.agenda),
    regions: row.regions,
    published: row.published,
  };

  const upcoming = isUpcomingDate(row.event_date);

  return (
    <>
      <PageHeader
        title={row.title || "Untitled event"}
        back={{ href: "/admin/events", label: "Events" }}
        description={
          row.published
            ? upcoming
              ? "Live on the site and open for registration. Saving republishes it immediately."
              : "Live on the site, in the previous-events shelf. Add a recording link and visitors can watch it back."
            : "A draft. Nobody can see this until you switch it to live."
        }
      />

      <EventForm
        values={values}
        timezones={eventTimezones}
        leaders={leaderOptions}
      />
    </>
  );
}
