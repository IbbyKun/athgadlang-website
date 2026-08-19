"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";

import { Field, fieldProps } from "@/components/admin/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * A date, picked from a calendar.
 *
 * Replaces `<input type="date">`, which is rendered entirely by the browser:
 * its calendar is the operating system's, it ignores every style on the page,
 * and its text format follows the machine's locale rather than the site's. An
 * editor in Karachi and one in London were reading the same field differently.
 *
 * The value is still an ISO `yyyy-mm-dd` string in a hidden input, because that
 * is what the action and the database want. Only the display changes: the
 * button shows the date the way the rest of the site writes it.
 *
 * Optional by default — a date field on this form usually means "no bound",
 * so the trigger says so and carries its own clear control rather than making
 * an editor select-all-and-delete to unset it.
 */
export function DateField({
  name,
  label,
  hint,
  error,
  value,
  onChange,
  required,
  placeholder = "No date",
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  /** ISO `yyyy-mm-dd`, or empty. */
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const selected = value ? fromIso(value) : undefined;

  return (
    <Field name={name} label={label} hint={hint} error={error} required={required}>
      {/* The trigger is a button, so this is what the form submits. */}
      <input type="hidden" {...fieldProps(name, error)} value={value} />

      <div className="flex items-center gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className={cn(
              "flex h-8 min-w-0 flex-1 items-center justify-between gap-2 rounded-sm border border-input bg-transparent px-2.5 py-1 text-left text-sm transition-colors outline-none",
              "focus-visible:border-ring aria-expanded:border-ring",
              error && "border-destructive",
            )}
          >
            <span
              className={cn("truncate", !value && "text-muted-foreground")}
            >
              {value ? formatDate(value) : placeholder}
            </span>
            <CalendarIcon aria-hidden className="size-4 shrink-0 opacity-60" />
          </PopoverTrigger>

          <PopoverContent
            align="start"
            /*
              As wide as the field it drops out of, so the calendar reads as
              that field opening rather than as a panel that happens to be
              nearby. A floor as well, because the trigger is only this wide in
              the sidebar column — in a narrower slot the grid would be squashed
              rather than merely narrow.
            */
            className="w-(--radix-popover-trigger-width) min-w-64 p-0"
          >
            <Calendar
              mode="single"
              selected={selected}
              defaultMonth={selected}
              // The year and month become menus rather than something you page
              // to one month at a time — a popup scheduled for next spring is
              // eight clicks away otherwise.
              captionLayout="dropdown"
              onSelect={(date) => {
                onChange(date ? toIso(date) : "");
                setOpen(false);
              }}
              autoFocus
              className="w-full"
              classNames={{
                // Fills the width it has been given rather than sitting at its
                // natural size in the corner of it.
                root: "w-full",
                /*
                  Today as a solid brand block with white text.

                  The default is a pale grey fill, which against this theme read
                  as an outline rather than a highlight — and next to the focus
                  ring it looked like the cell was merely selected-ish. Filled,
                  it matches how the chosen day is drawn, which is the point:
                  both are "this date", stated the same way.

                  The hover rule is not decoration. The day is a ghost-variant
                  button, so without it hovering paints the neutral accent over
                  the brand fill and the block turns grey under the pointer.
                */
                today:
                  "rounded-(--cell-radius) bg-brand [&>button]:bg-transparent [&>button]:text-white [&>button:hover]:bg-brand-hover [&>button:hover]:text-white",
              }}
            />
          </PopoverContent>
        </Popover>

        {value && !required && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="grid size-8 shrink-0 place-items-center rounded-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>
    </Field>
  );
}

/*
  Both conversions are deliberately local rather than going through UTC.

  `new Date("2026-08-19")` parses as UTC midnight, which in a negative-offset
  timezone is the 18th — so a date picked from the calendar could be stored as
  the day before it was clicked. Building the Date from its parts, and reading
  it back from its local parts, keeps the string and the calendar agreeing
  wherever the editor happens to be.
*/

function fromIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function toIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}
