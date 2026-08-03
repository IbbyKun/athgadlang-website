import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The admin forms' shared furniture: a labelled field, a card to group fields
 * in, and the banner that reports a failed save.
 *
 * Errors are wired by convention — a field named `title` reads
 * `state.errors.title` — so adding a field to a form and a check to its action
 * is all it takes for the message to appear in the right place.
 */

type FieldProps = {
  /** Must match the input's `id`, and the key used in `state.errors`. */
  name: string;
  label: string;
  /** Guidance shown under the label, before anything has gone wrong. */
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Field({
  name,
  label,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={name}
        className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy"
      >
        {label}
        {required && (
          <span aria-hidden className="text-brand">
            *
          </span>
        )}
      </label>

      {hint && <p className="text-xs leading-relaxed text-neutral-500">{hint}</p>}

      {children}

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Props every input needs so the browser and screen readers agree with the
 * visible error state. Spread onto the control inside a <Field>.
 */
export function fieldProps(name: string, error?: string) {
  return {
    id: name,
    name,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${name}-error` : undefined,
  };
}

/** A titled group of fields. */
export function FormCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed text-neutral-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

/** Whole-form failure, shown above the fields. */
export function FormBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive ring-1 ring-destructive/20"
    >
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
