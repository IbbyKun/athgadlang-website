"use client";

import { Field } from "@/components/admin/field";
import { cn } from "@/lib/utils";

/**
 * A small set of mutually exclusive options, as a segmented control.
 *
 * Radios rather than a `<select>`: there are only ever two or three choices and
 * one of them reveals another field, so seeing all the options at once — and how
 * far the form still has to go — beats hiding them behind a menu.
 */
export function ChoiceField<T extends string>({
  name,
  label,
  hint,
  error,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  options: { value: T; label: string; description?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <Field name={name} label={label} hint={hint} error={error} required>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <label
              key={option.value}
              title={option.description}
              className={cn(
                "cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium ring-1 transition-colors",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                active
                  ? "bg-brand/10 text-brand ring-brand/30"
                  : "bg-white text-neutral-500 ring-neutral-200 hover:bg-neutral-50",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </Field>
  );
}
