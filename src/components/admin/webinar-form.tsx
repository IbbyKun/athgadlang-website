"use client";

import * as React from "react";
import { useActionState } from "react";

import { saveWebinar } from "@/app/admin/actions";
import { Field, FormBanner, FormCard, fieldProps } from "@/components/admin/field";
import { ImageField } from "@/components/admin/image-field";
import { PublishBar } from "@/components/admin/publish-bar";
import { RegionField } from "@/components/admin/region-field";
import { SlugField } from "@/components/admin/slug-field";
import { Input } from "@/components/ui/input";
import { emptyFormState, type WebinarFormValues } from "@/lib/admin/form";

/**
 * Add or edit a recorded session.
 *
 * Shorter than the article form because a webinar is a card pointing at
 * YouTube — there is no body to write. The card opens the recording in a new
 * tab, so the YouTube link is what makes a session usable, and publishing
 * without one is refused by the action.
 */
export function WebinarForm({ values }: { values: WebinarFormValues }) {
  const [state, action] = useActionState(saveWebinar, emptyFormState);
  const errors = state.errors ?? {};

  // Controlled for the same reason as the article form — see the note there.
  const [draft, setDraft] = React.useState(values);
  const set = <K extends keyof WebinarFormValues>(
    key: K,
    value: WebinarFormValues[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form action={action} className="flex flex-col gap-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <FormBanner message={state.message} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <FormCard title="Session">
            <Field name="title" label="Title" error={errors.title} required>
              <Input
                {...fieldProps("title", errors.title)}
                value={draft.title}
                onChange={(event) => set("title", event.target.value)}
                placeholder="UAE Corporate Tax | How to Get Prepared"
                autoFocus={!values.id}
              />
            </Field>

            <Field
              name="youtube_id"
              label="YouTube link"
              hint="Paste the address from the browser, or the 11-character video id."
              error={errors.youtube_id}
              required
            >
              <Input
                {...fieldProps("youtube_id", errors.youtube_id)}
                value={draft.youtubeId}
                onChange={(event) => set("youtubeId", event.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                name="published_at"
                label="Date aired"
                error={errors.published_at}
                required
              >
                <Input
                  {...fieldProps("published_at", errors.published_at)}
                  type="date"
                  value={draft.publishedAt}
                  onChange={(event) => set("publishedAt", event.target.value)}
                />
              </Field>

              <Field
                name="duration"
                label="Runtime"
                hint="As shown on the card."
                error={errors.duration}
              >
                <Input
                  {...fieldProps("duration", errors.duration)}
                  value={draft.duration}
                  onChange={(event) => set("duration", event.target.value)}
                  placeholder="42 min"
                />
              </Field>
            </div>
          </FormCard>

          <FormCard
            title="Thumbnail"
            description="A still from the session, or the episode artwork. Landscape, at least 1400px wide."
          >
            <ImageField
              folder="webinars"
              url={values.imageUrl}
              alt={values.imageAlt}
              error={errors.image_url}
              altError={errors.image_alt}
            />
          </FormCard>
        </div>

        <div className="flex flex-col gap-6">
          <FormCard title="Publishing">
            <SlugField
              defaultValue={values.slug}
              title={draft.title}
              error={errors.slug}
              followTitle={!values.id}
              label="Identifier"
              hint="Used as the card's key. Not part of any address — the card opens YouTube."
            />

            <RegionField selected={values.regions} error={errors.regions} />
          </FormCard>
        </div>
      </div>

      <PublishBar published={values.published} cancelHref="/admin/webinars" />
    </form>
  );
}
