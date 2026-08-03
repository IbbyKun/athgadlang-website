"use client";

import * as React from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The bar that ends every admin form: the draft/live switch and the save
 * button, pinned to the bottom of the viewport so a long article can be
 * published without scrolling back.
 *
 * `useFormStatus` only reports on the form above it in the tree, which is why
 * this is a component rather than part of the form body.
 */
export function PublishBar({
  published,
  cancelHref,
}: {
  published: boolean;
  cancelHref: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-2 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <PublishToggle defaultChecked={published} />

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="lg">
            <Link href={cancelHref}>Cancel</Link>
          </Button>

          <Button type="submit" size="lg" disabled={pending}>
            {pending && <Loader2 aria-hidden className="animate-spin" />}
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Draft or live. A checkbox rather than two buttons, so the state is visible
 * before saving and the form has one submit path.
 */
function PublishToggle({ defaultChecked }: { defaultChecked: boolean }) {
  // Controlled, so a failed save does not silently flip a live item back to
  // draft when React resets the form.
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <label className="group flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        name="published"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        className="peer sr-only"
      />

      <span
        aria-hidden
        className={cn(
          "relative h-5 w-9 rounded-full bg-neutral-300 transition-colors",
          "peer-checked:bg-brand",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
          "after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform",
          "peer-checked:after:translate-x-4",
        )}
      />

      {/* Both labels are siblings of the checkbox, so `peer-checked` can show
          one and hide the other without any state in React. */}
      <span className="font-semibold text-neutral-500 peer-checked:hidden">
        Draft
      </span>
      <span className="hidden font-semibold text-brand peer-checked:inline">
        Live on the site
      </span>
    </label>
  );
}
