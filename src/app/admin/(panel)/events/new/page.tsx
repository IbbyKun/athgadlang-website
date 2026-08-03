import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/page-header";
import { todayIso, type EventFormValues } from "@/lib/admin/form";
import { eventTimezones } from "@/lib/admin/queries";
import { tenantCodes } from "@/lib/tenants";

/** A blank event: online, free, today's date, every region, not yet live. */
const blank: EventFormValues = {
  slug: "",
  title: "",
  kind: "webinar",
  date: "",
  time: "",
  // The group's home timezone, and the one most sessions are run in.
  timezone: eventTimezones[0],
  mode: "online",
  venue: "",
  price: "",
  access: "",
  excerpt: "",
  imageUrl: "",
  imageAlt: "",
  registerUrl: "",
  recordingUrl: "",
  body: null,
  regions: tenantCodes,
  published: false,
};

export default function NewEventPage() {
  return (
    <>
      <PageHeader
        title="New event"
        back={{ href: "/admin/events", label: "Events" }}
        description="Save as a draft while you work; switch to live when it is ready."
      />

      <EventForm
        values={{ ...blank, date: todayIso() }}
        timezones={eventTimezones}
      />
    </>
  );
}
