"use client";

import * as React from "react";
import { useActionState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { savePopup } from "@/app/admin/actions";
import { ChoiceField } from "@/components/admin/choice-field";
import { DateField } from "@/components/admin/date-field";
import { Field, FormBanner, FormCard, fieldProps } from "@/components/admin/field";
import { ImageField } from "@/components/admin/image-field";
import { PublishBar } from "@/components/admin/publish-bar";
import { RegionField } from "@/components/admin/region-field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { emptyFormState, type PopupFormValues } from "@/lib/admin/form";
import { formatDate } from "@/lib/format";
import { parseYoutubeId, youtubeThumbnail } from "@/lib/youtube";

/**
 * What to upload, in the terms somebody preparing the artwork needs.
 *
 * The number is not a suggestion: the card is `max-w-4xl` at `aspect-video`,
 * so it renders 896x504 and wants twice that for a retina screen. 1920x1080 is
 * the nearest round 16:9 size above it, and is what a design tool offers by
 * default.
 *
 * The two warnings are the two ways an upload actually goes wrong. A picture
 * in another shape is not letterboxed, it is filled and trimmed from the
 * centre — so a square poster loses its top and bottom, and a tall one loses
 * its sides. And the foot of the card is spoken for: the headline and the
 * button sit there over a scrim, so whatever the artwork put in that strip is
 * covered whether or not it is cropped.
 */
const coverHint =
  "1920 x 1080 (16:9) — the card's own shape, so nothing is cropped. " +
  "Other proportions are filled and trimmed from the centre. " +
  "The headline and button sit across the bottom third, so keep dates, QR codes and logos above it.";

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
            description="Shown along the foot of the artwork. Keep it to the one thing you want a visitor to know."
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
              <EventField
                value={draft.eventSlug}
                onChange={(slug) => set("eventSlug", slug)}
                events={events}
                error={errors.event_slug}
              />
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

          {/*
            Optional, and last, because it should be: leaving it empty is the
            normal way to make a popup, not a step that was skipped.
          */}
          <FormCard
            title="Artwork"
            description="Optional, and 1920 x 1080. Left empty, the popup borrows the event's cover or the video's thumbnail — which were drawn for somewhere else, so they may be trimmed."
          >
            <ImageField
              folder="popups"
              url={values.imageUrl}
              alt={values.imageAlt}
              error={errors.image_url}
              altError={errors.image_alt}
              hint={
                draft.target === "video"
                  ? `${coverHint} Uploading one also stops the video playing on the card — the still is shown instead, and the button still opens it.`
                  : coverHint
              }
              // Never required: the whole point of it is that a popup works
              // without one.
              required={false}
            />
          </FormCard>
        </div>

        <div className="flex flex-col gap-6">
          <FormCard
            title="How long it runs"
            description="Both optional. No start means from the moment it is published; no end means until you unpublish it."
          >
            <DateField
              name="starts_on"
              label="Starts"
              error={errors.starts_on}
              value={draft.startsOn}
              onChange={(value) => set("startsOn", value)}
              placeholder="As soon as it is live"
            />

            <DateField
              name="ends_on"
              label="Expires after"
              hint="The last day it shows. It stops by itself — nobody has to remember to take it down."
              error={errors.ends_on}
              value={draft.endsOn}
              onChange={(value) => set("endsOn", value)}
              placeholder="No end date"
            />
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

/**
 * Which event the popup points at.
 *
 * The same dropdown as the author field, and for the same reason: a native
 * `<select>` renders as whatever the operating system decides, which on macOS
 * is a menu that looks nothing like the rest of this form. This one is styled
 * with the inputs beside it and shows the date under the title rather than
 * crammed onto one line with a dash between them.
 */
function EventField({
  value,
  onChange,
  events,
  error,
}: {
  value: string;
  onChange: (slug: string) => void;
  events: { slug: string; title: string; event_date: string }[];
  error?: string;
}) {
  const selected = events.find((event) => event.slug === value);

  return (
    <Field
      name="event_slug"
      label="Event"
      hint="Published events still to come. Past ones are left out — a popup exists to fill a room."
      error={error}
      required
    >
      {/* The trigger is a button, so this is what the form actually submits. */}
      <input type="hidden" {...fieldProps("event_slug", error)} value={value} />

      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={events.length === 0}
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2.5 py-1 text-left text-sm transition-colors outline-none",
            "focus-visible:border-ring aria-expanded:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-destructive",
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.title : "Choose an event…"}
          </span>
          <ChevronDown aria-hidden className="size-4 shrink-0 opacity-60" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="max-h-72 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto"
        >
          {events.map((event) => (
            <DropdownMenuItem
              key={event.slug}
              onSelect={() => onChange(event.slug)}
              className="justify-between gap-3"
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate">{event.title}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(event.event_date)}
                </span>
              </span>
              {event.slug === value && (
                <Check aria-hidden className="size-4 shrink-0 text-brand" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {events.length === 0 && (
        <p className="text-xs text-amber-700">
          There are no published upcoming events to point at yet.
        </p>
      )}
    </Field>
  );
}
