"use client";

import * as React from "react";
import { ImageUp, Loader2, Trash2 } from "lucide-react";

import { uploadImage } from "@/app/admin/actions";
import { Field, fieldProps } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}: {
  /** Storage prefix — keeps article and session artwork apart in the bucket. */
  folder: "insights" | "webinars";
  url: string;
  alt: string;
  error?: string;
  altError?: string;
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

    const payload = new FormData();
    payload.set("file", file);
    payload.set("folder", folder);

    try {
      const result = await uploadImage(payload);

      if (result.error) setFailure(result.error);
      else if (result.url) setValue(result.url);
    } catch {
      // The action rejects when the session has expired mid-edit. Say so here
      // rather than letting it take the whole form down with it.
      setFailure("Upload failed. Your session may have expired — sign in again.");
    }

    setUploading(false);
    // Let the same file be chosen again after a failure.
    if (input.current) input.current.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      <Field
        name="image_url"
        label="Cover image"
        hint="Shown on the card and across the top of the page. Landscape, at least 1400px wide."
        error={failure ?? error}
        required
      >
        <input type="hidden" name="image_url" value={value} readOnly />

        <div
          className={cn(
            "flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 p-3",
            (failure ?? error) && "border-destructive/50",
          )}
        >
          {value ? (
            // A plain <img>: this is an admin preview of a URL that has just
            // been created, and routing it through the image optimiser adds a
            // round trip and a config dependency for no benefit here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="aspect-[2/1] w-full rounded-lg bg-neutral-100 object-cover"
            />
          ) : (
            <div className="flex aspect-[2/1] w-full items-center justify-center rounded-lg bg-neutral-100 text-sm text-neutral-400">
              No image yet
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
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

            <span className="text-xs text-neutral-400">
              JPEG, PNG, WebP or AVIF, up to 5 MB
            </span>
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
