"use client";

import * as React from "react";

import { Field, fieldProps } from "@/components/admin/field";
import { slugify } from "@/lib/admin/form";

/**
 * The URL segment, kept in step with the title until somebody edits it.
 *
 * Following the title is a convenience when creating something and a hazard
 * when editing it — a published article's URL is already linked to and
 * indexed — so the edit pages pass `followTitle: false`. Typing in the field
 * detaches it either way, and it never re-attaches: an editor who set a slug
 * by hand meant it.
 */
export function SlugField({
  defaultValue,
  title,
  error,
  followTitle,
  prefix,
  label = "URL slug",
  hint,
}: {
  defaultValue: string;
  /** The current title, so a new item's slug can track it as it is typed. */
  title: string;
  error?: string;
  followTitle: boolean;
  /** Shown in the hint before the slug, e.g. "/insights/". */
  prefix?: string;
  label?: string;
  hint?: string;
}) {
  const [edited, setEdited] = React.useState<string>();

  const detached = !followTitle || edited !== undefined;
  const slug = detached ? (edited ?? defaultValue) : slugify(title);

  return (
    <Field
      name="slug"
      label={label}
      hint={hint ?? (prefix ? `Address: ${prefix}${slug || "…"}` : undefined)}
      error={error}
      required
    >
      <input
        {...fieldProps("slug", error)}
        value={slug}
        onChange={(event) => setEdited(event.target.value)}
        onBlur={(event) => {
          if (detached) setEdited(slugify(event.target.value));
        }}
        className="h-8 w-full rounded-sm border border-input bg-transparent px-2.5 py-1 font-mono text-sm outline-none transition-colors focus-visible:border-ring aria-invalid:border-destructive"
      />
    </Field>
  );
}
