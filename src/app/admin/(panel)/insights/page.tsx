import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { deleteInsight } from "@/app/admin/actions";
import { ContentRow } from "@/components/admin/content-row";
import {
  EmptyState,
  PageHeader,
  SetupNotice,
} from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { listAllInsights } from "@/lib/admin/queries";

export default async function AdminInsightsPage() {
  const { rows, error } = await listAllInsights();

  return (
    <>
      <PageHeader
        title="Insights"
        description="Articles published from this panel. Drafts are invisible to the public site."
        action={
          <Button asChild>
            <Link href="/admin/insights/new">
              <PlusCircle aria-hidden />
              New article
            </Link>
          </Button>
        }
      />

      <SetupNotice message={error} />

      {rows.length === 0 && !error ? (
        <EmptyState
          title="No articles yet"
          description="Write the first one and choose which regional sites it appears on."
          action={
            <Button asChild size="sm" className="mt-1">
              <Link href="/admin/insights/new">
                <PlusCircle aria-hidden />
                New article
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row) => (
            <li key={row.id}>
              <ContentRow
                href={`/admin/insights/${row.id}`}
                title={row.title}
                meta={row.category}
                date={row.published_at}
                imageUrl={row.image_url}
                regions={row.regions}
                published={row.published}
                viewHref={row.published ? `/insights/${row.slug}` : undefined}
                deleteAction={deleteInsight}
                id={row.id}
                label="article"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
