import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { PopupForm } from "@/components/admin/popup-form";
import type { PopupFormValues } from "@/lib/admin/form";
import { getPopupRow, upcomingEventChoices } from "@/lib/admin/queries";

export default async function EditPopupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row, events] = await Promise.all([
    getPopupRow(id),
    upcomingEventChoices(),
  ]);

  if (!row) notFound();

  const values: PopupFormValues = {
    id: row.id,
    title: row.title,
    body: row.body,
    // Derived from which column is filled, since the database has no column
    // for the choice itself — there is nothing a third state could mean.
    target: row.youtube_id ? "video" : row.event_slug ? "event" : "none",
    youtubeId: row.youtube_id ?? "",
    eventSlug: row.event_slug ?? "",
    ctaLabel: row.cta_label,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    startsOn: row.starts_on ?? "",
    endsOn: row.ends_on ?? "",
    regions: row.regions,
    published: row.published,
  };

  return (
    <>
      <PageHeader
        title={row.title || "Untitled popup"}
        back={{ href: "/admin/popups", label: "Popups" }}
        description={
          row.published
            ? "Live on the site. Saving takes effect within five minutes."
            : "A draft. Nobody sees this until you switch it to live."
        }
      />

      <PopupForm values={values} events={events} />
    </>
  );
}
