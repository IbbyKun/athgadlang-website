"use client";

import * as React from "react";
import { useActionState } from "react";

import { saveInsight } from "@/app/admin/actions";
import { Field, FormBanner, FormCard, fieldProps } from "@/components/admin/field";
import { ImageField } from "@/components/admin/image-field";
import { PublishBar } from "@/components/admin/publish-bar";
import { RegionField } from "@/components/admin/region-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SlugField } from "@/components/admin/slug-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { emptyFormState, type InsightFormValues } from "@/lib/admin/form";

/**
 * Write or edit an article.
 *
 * One `<form>` around everything, submitting to the `saveInsight` action —
 * there is no client-side save. The action is the only validator; errors come
 * back through `useActionState` and land on their fields by name.
 */
export function InsightForm({
  values,
  categories,
}: {
  values: InsightFormValues;
  categories: string[];
}) {
  const [state, action] = useActionState(saveInsight, emptyFormState);
  const errors = state.errors ?? {};

  // Every field is controlled. React resets uncontrolled fields once a form
  // action completes, so on a failed save the editor would be asked to correct
  // a form that had just been emptied. One state object rather than a state
  // per field, so adding a field is a single line here.
  const [draft, setDraft] = React.useState(values);
  const set = <K extends keyof InsightFormValues>(
    key: K,
    value: InsightFormValues[K],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <form action={action} className="flex flex-col gap-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <FormBanner message={state.message} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <FormCard title="Article">
            <Field name="title" label="Title" error={errors.title} required>
              <Input
                {...fieldProps("title", errors.title)}
                value={draft.title}
                onChange={(event) => set("title", event.target.value)}
                placeholder="UAE Corporate Tax: what changes this year"
                autoFocus={!values.id}
              />
            </Field>

            <Field
              name="excerpt"
              label="Excerpt"
              hint="One or two sentences. Shown on the card and used as the page description in search results."
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

          <FormCard title="Body">
            <RichTextEditor value={values.body} error={errors.body} />
          </FormCard>
        </div>

        <div className="flex flex-col gap-6">
          <FormCard title="Publishing">
            <SlugField
              defaultValue={values.slug}
              title={draft.title}
              error={errors.slug}
              // An existing article's URL is already out there; changing it
              // breaks every link to it, so it does not follow the title.
              followTitle={!values.id}
              prefix="/insights/"
            />

            <Field
              name="category"
              label="Category"
              error={errors.category}
              required
            >
              <select
                {...fieldProps("category", errors.category)}
                value={draft.category}
                onChange={(event) => set("category", event.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring aria-invalid:border-destructive"
              >
                <option value="">Choose…</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              name="published_at"
              label="Publication date"
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
              name="author"
              label="Author"
              hint="Leave blank to use the house byline."
              error={errors.author}
            >
              <Input
                {...fieldProps("author", errors.author)}
                value={draft.author}
                onChange={(event) => set("author", event.target.value)}
                placeholder="athGADLANG Insights Team"
              />
            </Field>

            <RegionField selected={values.regions} error={errors.regions} />
          </FormCard>

          <FormCard title="Artwork">
            <ImageField
              folder="insights"
              url={values.imageUrl}
              alt={values.imageAlt}
              error={errors.image_url}
              altError={errors.image_alt}
            />
          </FormCard>
        </div>
      </div>

      <PublishBar published={values.published} cancelHref="/admin/insights" />
    </form>
  );
}
