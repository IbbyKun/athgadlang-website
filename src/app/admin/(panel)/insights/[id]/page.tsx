import { notFound } from "next/navigation";

import { InsightForm } from "@/components/admin/insight-form";
import { PageHeader } from "@/components/admin/page-header";
import { getInsightRow } from "@/lib/admin/queries";
import { insightCategories } from "@/lib/insight-categories";
import type { InsightFormValues } from "@/lib/admin/form";
import type { RichDoc } from "@/lib/rich-text";

export default async function EditInsightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getInsightRow(id);

  if (!row) notFound();

  // Mapped explicitly rather than passed through: the form is a Client
  // Component and the row type is server-only, and this is where a column
  // rename surfaces as a type error instead of an empty field.
  const values: InsightFormValues = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author ?? "",
    publishedAt: row.published_at,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    body: (row.body as RichDoc | null) ?? null,
    regions: row.regions,
    published: row.published,
  };

  return (
    <>
      <PageHeader
        title={row.title || "Untitled article"}
        back={{ href: "/admin/insights", label: "Insights" }}
        description={
          row.published
            ? "Live on the site. Saving republishes it immediately."
            : "A draft. Nobody can see this until you switch it to live."
        }
      />

      <InsightForm values={values} categories={insightCategories} />
    </>
  );
}
