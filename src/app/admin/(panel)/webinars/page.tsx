import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { deleteWebinar } from "@/app/admin/actions";
import { ContentRow } from "@/components/admin/content-row";
import {
  EmptyState,
  PageHeader,
  SetupNotice,
} from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { listAllWebinars } from "@/lib/admin/queries";
import { youtubeThumbnail, youtubeWatchUrl } from "@/lib/youtube";

export default async function AdminWebinarsPage() {
  const { rows, error } = await listAllWebinars();

  return (
    <>
      <PageHeader
        title="Webinars"
        description="Recorded sessions. Each card opens its recording on YouTube."
        action={
          <Button asChild>
            <Link href="/admin/webinars/new">
              <PlusCircle aria-hidden />
              New session
            </Link>
          </Button>
        }
      />

      <SetupNotice message={error} />

      {rows.length === 0 && !error ? (
        <EmptyState
          title="No sessions yet"
          description="Add a recording by pasting its YouTube link, the thumbnail comes with it."
          action={
            <Button asChild size="sm" className="mt-1">
              <Link href="/admin/webinars/new">
                <PlusCircle aria-hidden />
                New session
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li key={row.id}>
              <ContentRow
                href={`/admin/webinars/${row.id}`}
                title={row.title}
                meta={row.duration || undefined}
                date={row.published_at}
                imageUrl={
                  row.image_url ||
                  // Same fallback the public card uses.
                  (row.youtube_id ? youtubeThumbnail(row.youtube_id) : "")
                }
                regions={row.regions}
                published={row.published}
                viewHref={
                  row.youtube_id ? youtubeWatchUrl(row.youtube_id) : undefined
                }
                deleteAction={deleteWebinar}
                id={row.id}
                label="session"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
