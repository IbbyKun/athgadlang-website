"use client";

import * as React from "react";
import { useActionState } from "react";

import { savePopup } from "@/app/admin/actions";
import { ChoiceField } from "@/components/admin/choice-field";
import { Field, FormBanner, FormCard, fieldProps } from "@/components/admin/field";
import { PublishBar } from "@/components/admin/publish-bar";
import { RegionField } from "@/components/admin/region-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyFormState, type PopupFormValues } from "@/lib/admin/form";
import { formatDate } from "@/lib/format";
import { parseYoutubeId, youtubeThumbnail } from "@/lib/youtube";

/**
 * The announcement popup.
 *
 * Short by design. A popup interrupts somebody, so it earns its place with one
 * line and one button — the form offers a headline, a supporting sentence and
 * a single thing to open, and nothing else.
 */
export function PopupForm({
  values,
  events,
}: {
  values: PopupFormValues;
  /** Published events still to come, for the picker. */
  events: { slug: string; title: string; event_date: string }[];
}) {
  const [state, action] = useActionState(savePopup, emptyFormState);
  const errors = state.errors ?? {};

  // Controlled for the same reason as the other forms — see the article form.
  const [draft, setDraft] = React.useState(values);
  const set = <K extends keyof PopupFormValues>(
    key: K,
    value: PopupFormValues[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  const videoId = parseYoutubeId(draft.youtubeId);

  return (
    <form action={action} className="flex flex-col gap-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <FormBanner message={state.message} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <FormCard
            title="What it says"
            description="Shown as bright text on a dimmed page. Keep it to the one thing you want a visitor to know."
          >
            <Field name="title" label="Headline" error={errors.title} required>
              <Input
                {...fieldProps("title", errors.title)}
                value={draft.title}
                onChange={(event) => set("title", event.target.value)}
                placeholder="Join us for UAE Corporate Tax, Year Two"
                autoFocus={!values.id}
              />
            </Field>

            <Field
              name="body"
              label="Supporting line"
              hint="Optional. One sentence — a good headline usually does not need one."
              error={errors.body}
            >
              <Textarea
                {...fieldProps("body", errors.body)}
                value={draft.body}
                onChange={(event) => set("body", event.target.value)}
                rows={2}
                maxLength={200}
              />
            </Field>
          </FormCard>

          <FormCard
            title="Where the button goes"
            description="A popup points at one thing, or at nothing at all."
          >
            <ChoiceField
              name="target"
              label="Opens"
              options={[
                { value: "none", label: "Nothing" },
                { value: "event", label: "An event" },
                { value: "video", label: "A video" },
              ]}
              value={draft.target}
              onChange={(target) => set("target", target)}
            />

            {draft.target === "event" && (
              <Field
                name="event_slug"
                label="Event"
                hint="Published events still to come. Past ones are left out — a popup exists to fill a room."
                error={errors.event_slug}
                required
              >
                <select
                  {...fieldProps("event_slug", errors.event_slug)}
                  value={draft.eventSlug}
                  onChange={(event) => set("eventSlug", event.target.value)}
                  className="h-9 w-full rounded-sm border border-input bg-transparent px-2 text-sm outline-none transition-colors focus-visible:border-ring"
                >
                  <option value="">Choose an event…</option>
                  {events.map((event) => (
                    <option key={event.slug} value={event.slug}>
                      {formatDate(event.event_date)} — {event.title}
                    </option>
                  ))}
                </select>

                {events.length === 0 && (
                  <p className="text-xs text-amber-700">
                    There are no published upcoming events to point at yet.
                  </p>
                )}
              </Field>
            )}

            {draft.target === "video" && (
              <Field
                name="youtube_id"
                label="YouTube link"
                hint="The video's own thumbnail is shown on the popup."
                error={errors.youtube_id}
                required
              >
                <Input
                  {...fieldProps("youtube_id", errors.youtube_id)}
                  value={draft.youtubeId}
                  onChange={(event) => set("youtubeId", event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=…"
                />

                {videoId && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={youtubeThumbnail(videoId)}
                    alt=""
                    className="mt-1 w-48 rounded-lg ring-1 ring-neutral-200"
                  />
                )}
              </Field>
            )}

            {draft.target !== "none" && (
              <Field
                name="cta_label"
                label="Button wording"
                hint="Optional. Left blank, the site uses “See the details” or “Watch the session”."
                error={errors.cta_label}
              >
                <Input
                  {...fieldProps("cta_label", errors.cta_label)}
                  value={draft.ctaLabel}
                  onChange={(event) => set("ctaLabel", event.target.value)}
                  placeholder="Register now"
                />
              </Field>
            )}
          </FormCard>
        </div>

        <div className="flex flex-col gap-6">
          <FormCard
            title="How long it runs"
            description="Both optional. No start means from the moment it is published; no end means until you unpublish it."
          >
            <Field
              name="starts_on"
              label="Starts"
              error={errors.starts_on}
            >
              <Input
                {...fieldProps("starts_on", errors.starts_on)}
                type="date"
                value={draft.startsOn}
                onChange={(event) => set("startsOn", event.target.value)}
              />
            </Field>

            <Field
              name="ends_on"
              label="Expires after"
              hint="The last day it shows. It stops by itself — nobody has to remember to take it down."
              error={errors.ends_on}
            >
              <Input
                {...fieldProps("ends_on", errors.ends_on)}
                type="date"
                value={draft.endsOn}
                onChange={(event) => set("endsOn", event.target.value)}
              />
            </Field>
          </FormCard>

          <FormCard title="Publishing">
            <RegionField selected={values.regions} error={errors.regions} />
          </FormCard>

          <p className="rounded-xl bg-white p-4 text-xs leading-relaxed text-neutral-500 ring-1 ring-neutral-200">
            Only one popup shows at a time. If two are live and overlap, the
            most recently created one wins. A visitor who closes it is not shown
            it again for 24 hours.
          </p>
        </div>
      </div>

      <PublishBar published={values.published} cancelHref="/admin/popups" />
    </form>
  );
}
