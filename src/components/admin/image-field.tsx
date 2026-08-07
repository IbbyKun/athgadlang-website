"use client";

import * as React from "react";
import { ImageUp, Loader2, Trash2 } from "lucide-react";

import { Field, fieldProps } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGE_ACCEPT, IMAGE_HINT, uploadImage } from "@/lib/admin/upload";
import { cn } from "@/lib/utils";

/**
 * Cover image: pick a file, it uploads, the form carries the resulting URL.
 *
 * The upload happens on selection rather than on submit, so the editor sees
 * the picture before committing and a failed upload is reported next to the
 * field instead of losing a whole form. The URL lives in a hidden input, which
 * is the only part the server action reads.
 */
export function ImageField({
  folder,
  url,
  alt,
  error,
  altError,
  hint = "Shown on the card and across the top of the page. Landscape, at least 1400px wide.",
  fallback,
  fallbackNote,
}: {
  /** Storage prefix — keeps each kind of artwork apart in the bucket. */
  folder: "insights" | "webinars" | "events";
  url: string;
  alt: string;
  error?: string;
  altError?: string;
  hint?: string;
  /**
   * What the site will show if nothing is uploaded. Previewed in place of the
   * empty state, and makes the upload optional rather than required.
   */
  fallback?: string;
  /** Says where `fallback` came from, so the preview is not mistaken for an upload. */
  fallbackNote?: string;
}) {
  // Controlled, all of it. React resets uncontrolled fields once a form action
  // completes, which on a failed save would clear the form the editor is being
  // asked to correct.
  const [value, setValue] = React.useState(url);
  const [description, setDescription] = React.useState(alt);
  const [uploading, setUploading] = React.useState(false);
  const [failure, setFailure] = React.useState<string>();
  const input = React.useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setFailure(undefined);

    // Every failure comes back as a message rather than a rejection, so a bad
    // upload is reported beside the field instead of taking the form down with
    // it. What went wrong is decided in one place — see src/lib/admin/upload.ts.
    const result = await uploadImage(file, folder);

    if (result.error) setFailure(result.error);
    else if (result.url) setValue(result.url);

    setUploading(false);
    // Let the same file be chosen again after a failure.
    if (input.current) input.current.value = "";
  }

  // What the site would show as things stand: the upload if there is one, else
  // whatever the form offered as a fallback.
  const preview = value || fallback;

  return (
    <div className="flex flex-col gap-4">
      <Field
        name="image_url"
        label="Cover image"
        hint={hint}
        error={failure ?? error}
        required={!fallback}
      >
        <input type="hidden" name="image_url" value={value} readOnly />

        <div
          className={cn(
            "flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 p-3",
            (failure ?? error) && "border-destructive/50",
          )}
        >
          {preview ? (
            // A plain <img>: this is an admin preview of a URL that has just
            // been created, and routing it through the image optimiser adds a
            // round trip and a config dependency for no benefit here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="aspect-[2/1] w-full rounded-lg bg-neutral-100 object-cover"
            />
          ) : (
            <div className="flex aspect-[2/1] w-full items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-500">
              No image yet
            </div>
          )}

          {!value && fallback && fallbackNote && (
            <p className="text-xs font-medium text-neutral-500">{fallbackNote}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={input}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => input.current?.click()}
            >
              {uploading ? (
                <Loader2 aria-hidden className="animate-spin" />
              ) : (
                <ImageUp aria-hidden />
              )}
              {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
            </Button>

            {value && !uploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setValue("")}
              >
                <Trash2 aria-hidden />
                Remove
              </Button>
            )}

            <span className="text-xs text-neutral-500">{IMAGE_HINT}</span>
          </div>
        </div>
      </Field>

      <Field
        name="image_alt"
        label="Image description"
        hint="What the picture shows, for screen readers and for when it fails to load. Defaults to the title."
        error={altError}
      >
        <Input
          {...fieldProps("image_alt", altError)}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Accountant reviewing figures at a desk"
        />
      </Field>
    </div>
  );
}
