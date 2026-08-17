"use client";

import * as React from "react";
import { useActionState } from "react";

import { saveEvent } from "@/app/admin/actions";
import { ChoiceField } from "@/components/admin/choice-field";
import {
  AgendaField,
  SpeakersField,
} from "@/components/admin/event-list-fields";
import { Field, FormBanner, FormCard, fieldProps } from "@/components/admin/field";
import { ImageField } from "@/components/admin/image-field";
import { PublishBar } from "@/components/admin/publish-bar";
import { RegionField } from "@/components/admin/region-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SlugField } from "@/components/admin/slug-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyFormState, type EventFormValues } from "@/lib/admin/form";

/**
 * Create or edit an event.
 *
 * Two fields appear only when they apply: the venue when the event is held
 * somewhere, and the price when it is not free. They are conditional in the
 * markup rather than merely disabled, so an event that is online genuinely
 * cannot carry a venue — and the action clears the stored value to match, in
 * case the mode is changed after the fact.
 *
 * Timezone is asked for rather than inferred. The group runs sessions across
 * five regions and the times on an invitation are stated in one of them; the
 * page shows exactly what is entered here and converts nothing.
 */
export function EventForm({
  values,
  timezones,
  leaders,
}: {
  values: EventFormValues;
  /** Suggested timezone labels; the field stays free text. */
  timezones: string[];
  /**
   * The leadership roster, narrowed to what the presenter picker needs. Passed
   * in rather than imported: `lib/leaders` pulls in the portrait map, and this
   * is a Client Component that only needs eleven names and slugs.
   */
  leaders: { slug: string; name: string }[];
}) {
  const [state, action] = useActionState(saveEvent, emptyFormState);
  const errors = state.errors ?? {};

  // Controlled throughout — React resets uncontrolled fields once a form action
  // completes, which on a failed save would empty the form being corrected.
  const [draft, setDraft] = React.useState(values);
  const set = <K extends keyof EventFormValues>(
    key: K,
    value: EventFormValues[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  // Free vs paid is a radio in the UI but not a column: an empty price *is*
  // free, so this only decides whether the price field is shown and read.
  const [paid, setPaid] = React.useState(values.price.trim().length > 0);

  return (
    <form action={action} className="flex flex-col gap-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <FormBanner message={state.message} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <FormCard title="Event">
            <Field name="title" label="Event name" error={errors.title} required>
              <Input
                {...fieldProps("title", errors.title)}
                value={draft.title}
                onChange={(event) => set("title", event.target.value)}
                placeholder="UAE Corporate Tax, Year Two: What Changes"
                autoFocus={!values.id}
              />
            </Field>

            <Field
              name="excerpt"
              label="Summary"
              hint="One or two sentences. Shown on the card and as the page description in search results."
              error={errors.excerpt}
              required
            >
              <Textarea
                {...fieldProps("excerpt", errors.excerpt)}
                value={draft.excerpt}
                onChange={(event) => set("excerpt", event.target.value)}
                rows={3}
                maxLength={320}
              />
            </Field>
          </FormCard>

          <FormCard
            title="When"
            description="Times are shown exactly as entered, nothing is converted into the reader's timezone, so state the timezone they are in."
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                name="event_date"
                label="Date"
                error={errors.event_date}
                required
              >
                <Input
                  {...fieldProps("event_date", errors.event_date)}
                  type="date"
                  value={draft.date}
                  onChange={(event) => set("date", event.target.value)}
                />
              </Field>

              <Field
                name="start_time"
                label="Timings"
                hint="Start and finish, e.g. 12:00 – 13:00."
                error={errors.start_time}
                required
              >
                <Input
                  {...fieldProps("start_time", errors.start_time)}
                  value={draft.time}
                  onChange={(event) => set("time", event.target.value)}
                  placeholder="12:00 – 13:00"
                />
              </Field>
            </div>

            <Field
              name="timezone"
              label="Time zone"
              hint="Shown next to the time on the page."
              error={errors.timezone}
              required
            >
              <Input
                {...fieldProps("timezone", errors.timezone)}
                value={draft.timezone}
                onChange={(event) => set("timezone", event.target.value)}
                placeholder="GST (UTC+4)"
                list="event-timezones"
              />
              {/* A datalist, not a select: these cover the group's regions but
                  a session can be run from anywhere. */}
              <datalist id="event-timezones">
                {timezones.map((zone) => (
                  <option key={zone} value={zone} />
                ))}
              </datalist>
            </Field>
          </FormCard>

          <FormCard title="Where">
            <ChoiceField
              name="mode"
              label="Format"
              hint="Whether people attend from their desk or travel to you."
              options={[
                { value: "online", label: "Online" },
                { value: "venue", label: "At a venue" },
              ]}
              value={draft.mode}
              onChange={(mode) => set("mode", mode)}
            />

            {draft.mode === "venue" && (
              <Field
                name="venue"
                label="Venue"
                hint="Where it is held, as it should read on the page."
                error={errors.venue}
                required
              >
                <Input
                  {...fieldProps("venue", errors.venue)}
                  value={draft.venue}
                  onChange={(event) => set("venue", event.target.value)}
                  placeholder="athGADLANG offices, Dubai"
                />
              </Field>
            )}
          </FormCard>

          <FormCard title="Details">
            <RichTextEditor
              value={values.body}
              error={errors.body}
              folder="events"
            />
          </FormCard>

          {/* Both sections are omitted from the page when empty, so neither is
              required — an event can be announced before the line-up is fixed
              and have presenters added later. */}
          <FormCard
            title="Who is presenting"
            description="Anyone on the leadership team can be linked to their profile, which gives them their photograph. Everyone else appears with their initials."
          >
            <SpeakersField
              value={values.speakers}
              leaders={leaders}
              error={errors.speakers}
            />
          </FormCard>

          <FormCard
            title="Running order"
            description="Optional. Left empty, the page shows no agenda rather than an empty one."
          >
            <AgendaField
              value={values.agenda}
              timezone={draft.timezone}
              error={errors.agenda}
            />
          </FormCard>
        </div>

        <div className="flex flex-col gap-6">
          <FormCard title="Publishing">
            <SlugField
              defaultValue={values.slug}
              title={draft.title}
              error={errors.slug}
              // A published event's URL is already out there; changing it breaks
              // every link to it, so it stops following the title once saved.
              followTitle={!values.id}
              prefix="/events/"
            />

            <ChoiceField
              name="kind"
              label="Type"
              hint="The label on the card."
              options={[
                { value: "webinar", label: "Webinar" },
                { value: "seminar", label: "Seminar" },
                { value: "networking", label: "Networking" },
              ]}
              value={draft.kind}
              onChange={(kind) => set("kind", kind)}
            />

            {/*
              Both free text, and both filled in by the events tracker import.
              The tracker's vocabulary is not the site's — it says "Tax & Audit"
              where the services list has seven slugs and none of them is that —
              so these record what the business writes down rather than forcing a
              choice from a list that does not fit yet.

              Nothing on the public site shows either one so far. They are here so
              that what was imported can be corrected, rather than being data
              nobody can reach.
            */}
            <Field
              name="partner"
              label="Co-host"
              hint="Who it was run with, e.g. IFA. Leave empty for an aG-led event."
              error={errors.partner}
            >
              <Input
                {...fieldProps("partner", errors.partner)}
                value={draft.partner}
                onChange={(event) => set("partner", event.target.value)}
                placeholder="MECA CFO Academy"
              />
            </Field>

            <Field
              name="service_line"
              label="Service line"
              hint="The practice it belongs to, as the events tracker words it."
              error={errors.service_line}
            >
              <Input
                {...fieldProps("service_line", errors.service_line)}
                value={draft.serviceLine}
                onChange={(event) => set("serviceLine", event.target.value)}
                placeholder="Advisory"
              />
            </Field>

            <RegionField selected={values.regions} error={errors.regions} />
          </FormCard>

          <FormCard title="Attending">
            <ChoiceField
              name="pricing"
              label="Cost"
              options={[
                { value: "free", label: "Free" },
                { value: "paid", label: "Paid" },
              ]}
              value={paid ? "paid" : "free"}
              onChange={(value) => setPaid(value === "paid")}
            />

            {paid && (
              <Field
                name="price"
                label="Price"
                hint="Including the currency, and whether it is per person."
                error={errors.price}
                required
              >
                <Input
                  {...fieldProps("price", errors.price)}
                  value={draft.price}
                  onChange={(event) => set("price", event.target.value)}
                  placeholder="AED 750 per attendee"
                />
              </Field>
            )}

            <Field
              name="register_url"
              label="Registration form link"
              hint="Where the Register button goes. Leave blank while registration is not open, the page says so instead of showing a dead button."
              error={errors.register_url}
            >
              <Input
                {...fieldProps("register_url", errors.register_url)}
                value={draft.registerUrl}
                onChange={(event) => set("registerUrl", event.target.value)}
                placeholder="https://…"
              />
            </Field>

            <Field
              name="access"
              label="Who can attend"
              hint="Optional. Anything the cost and the link do not already say, e.g. “By invitation only”."
              error={errors.access}
            >
              <Input
                {...fieldProps("access", errors.access)}
                value={draft.access}
                onChange={(event) => set("access", event.target.value)}
                placeholder="Open to all, registration required"
              />
            </Field>

            <Field
              name="recording_url"
              label="Recording link"
              hint="Added after the event has run. Offered to visitors once the date has passed."
              error={errors.recording_url}
            >
              <Input
                {...fieldProps("recording_url", errors.recording_url)}
                value={draft.recordingUrl}
                onChange={(event) => set("recordingUrl", event.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
              />
            </Field>
          </FormCard>

          <FormCard title="Artwork">
            <ImageField
              folder="events"
              url={values.imageUrl}
              alt={values.imageAlt}
              error={errors.image_url}
              altError={errors.image_alt}
            />
          </FormCard>
        </div>
      </div>

      <PublishBar published={values.published} cancelHref="/admin/events" />
    </form>
  );
}
