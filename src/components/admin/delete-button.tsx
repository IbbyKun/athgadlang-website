"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Deletes an item, behind a confirmation step.
 *
 * The confirmation is inline rather than a `window.confirm`: it keeps the
 * warning next to the thing being deleted, and it cannot be suppressed by a
 * browser that has decided the page shows too many dialogs.
 */
export function DeleteButton({
  id,
  action,
  label,
}: {
  id: string;
  action: (formData: FormData) => void;
  /** What is being deleted, e.g. "article". */
  label: string;
}) {
  const [confirming, setConfirming] = React.useState(false);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
      >
        <Trash2 aria-hidden />
        <span className="sr-only">Delete {label}</span>
      </Button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />

      <span className="text-xs font-medium text-neutral-500">Delete?</span>

      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={() => setConfirming(false)}
      >
        No
      </Button>

      <ConfirmButton />
    </form>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" size="xs" disabled={pending}>
      {pending && <Loader2 aria-hidden className="animate-spin" />}
      Yes, delete
    </Button>
  );
}
