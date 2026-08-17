import { InsightForm } from "@/components/admin/insight-form";
import { PageHeader } from "@/components/admin/page-header";
import { todayIso, type InsightFormValues } from "@/lib/admin/form";
import { insightCategories } from "@/lib/insight-categories";
import { tenantCodes } from "@/lib/tenants";

/** A blank article: today's date, every region, not yet live. */
const blank: InsightFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  author: "",
  metaTitle: "",
  metaDescription: "",
  publishedAt: "",
  imageUrl: "",
  imageAlt: "",
  body: null,
  regions: tenantCodes,
  published: false,
};

export default function NewInsightPage() {
  return (
    <>
      <PageHeader
        title="New article"
        back={{ href: "/admin/insights", label: "Insights" }}
        description="Save as a draft while you work; switch to live when it is ready."
      />

      <InsightForm
        values={{ ...blank, publishedAt: todayIso() }}
        categories={insightCategories}
      />
    </>
  );
}
