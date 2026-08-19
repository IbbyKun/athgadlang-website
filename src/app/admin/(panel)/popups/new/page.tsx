import { PageHeader } from "@/components/admin/page-header";
import { PopupForm } from "@/components/admin/popup-form";
import { type PopupFormValues } from "@/lib/admin/form";
import { upcomingEventChoices } from "@/lib/admin/queries";
import { tenantCodes } from "@/lib/tenants";

/** A blank popup: no dates, every region, not yet live. */
const blank: PopupFormValues = {
  title: "",
  body: "",
  target: "none",
  youtubeId: "",
  eventSlug: "",
  ctaLabel: "",
  startsOn: "",
  endsOn: "",
  regions: tenantCodes,
  published: false,
};

export default async function NewPopupPage() {
  const events = await upcomingEventChoices();

  return (
    <>
      <PageHeader
        title="New popup"
        back={{ href: "/admin/popups", label: "Popups" }}
        description="Save as a draft while you work; switch to live when it is ready."
      />

      <PopupForm values={blank} events={events} />
    </>
  );
}
