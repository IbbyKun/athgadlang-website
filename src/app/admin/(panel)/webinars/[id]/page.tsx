import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { WebinarForm } from "@/components/admin/webinar-form";
import type { WebinarFormValues } from "@/lib/admin/form";
import { getWebinarRow } from "@/lib/admin/queries";

export default async function EditWebinarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getWebinarRow(id);

  if (!row) notFound();

  const values: WebinarFormValues = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    publishedAt: row.published_at,
    duration: row.duration,
    youtubeId: row.youtube_id ?? "",
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    regions: row.regions,
    published: row.published,
  };

  return (
    <>
      <PageHeader
        title={row.title || "Untitled session"}
        back={{ href: "/admin/webinars", label: "Webinars" }}
        description={
          row.published
            ? "Live on the site. Saving republishes it immediately."
            : "A draft. Nobody can see this until you switch it to live."
        }
      />

      <WebinarForm values={values} />
    </>
  );
}
