import { PageHeader } from "@/components/admin/page-header";
import { WebinarForm } from "@/components/admin/webinar-form";
import { todayIso, type WebinarFormValues } from "@/lib/admin/form";
import { tenantCodes } from "@/lib/tenants";

/** A blank session: today's date, every region, not yet live. */
const blank: WebinarFormValues = {
  slug: "",
  title: "",
  publishedAt: "",
  duration: "",
  youtubeId: "",
  imageUrl: "",
  imageAlt: "",
  regions: tenantCodes,
  published: false,
};

export default function NewWebinarPage() {
  return (
    <>
      <PageHeader
        title="New session"
        back={{ href: "/admin/webinars", label: "aG Studio" }}
        description="Save as a draft while you work; switch to live when it is ready."
      />

      <WebinarForm values={{ ...blank, publishedAt: todayIso() }} />
    </>
  );
}
