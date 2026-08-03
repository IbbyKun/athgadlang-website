"use client";

import * as React from "react";
import { ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FieldName = "firstName" | "lastName" | "email" | "phone" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "sent" | "error";

const fieldClass = cn(
  // Border is transparent at rest, so turning it red on focus shifts nothing.
  "w-full rounded-sm border-2 border-transparent bg-white px-4 text-[0.95rem] text-neutral-900 shadow-sm outline-none",
  "placeholder:text-neutral-400 transition-colors",
  "focus-visible:border-brand",
  "aria-invalid:border-amber-400",
);

/**
 * Contact enquiry form. Validation runs on the server too — see
 * app/api/contact/route.ts — so this handles presentation and error display.
 */
export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [notice, setNotice] = React.useState<string | null>(null);

  const submitting = status === "submitting";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setStatus("submitting");
    setErrors({});
    setNotice(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setErrors(result.errors ?? {});
        setNotice(result.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setNotice(result.message);
      setStatus("sent");
    } catch {
      setNotice("Could not send your message. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-3", className)}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          name="firstName"
          label="First name"
          placeholder="First name *"
          autoComplete="given-name"
          error={errors.firstName}
        />
        <Field
          name="lastName"
          label="Last name"
          placeholder="Last name *"
          autoComplete="family-name"
          error={errors.lastName}
        />
        <Field
          name="email"
          type="email"
          label="Your email"
          placeholder="Your mail *"
          autoComplete="email"
          error={errors.email}
        />
        <Field
          name="phone"
          type="tel"
          label="Phone number"
          placeholder="Phone number *"
          autoComplete="tel"
          error={errors.phone}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Message..."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(fieldClass, "min-h-32 resize-y py-3.5 leading-relaxed")}
        />
        {errors.message && (
          <FieldError id="contact-message-error">{errors.message}</FieldError>
        )}
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="sr-only"
      />

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full text-[0.95rem] font-bold"
      >
        {submitting ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <ChevronRight className="size-5" />
        )}
        {submitting ? "Sending..." : "Send now"}
      </Button>

      {notice && (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-sm font-medium",
            status === "sent" ? "text-emerald-300" : "text-amber-300",
          )}
        >
          {notice}
        </p>
      )}
    </form>
  );
}

type FieldProps = {
  name: FieldName;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  error?: string;
};

function Field({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  error,
}: FieldProps) {
  const id = `contact-${name}`;

  return (
    <div className="flex flex-col gap-1.5">
      {/* The design uses placeholders only, so labels stay visually hidden. */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClass, "h-12")}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function FieldError({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="px-1 text-xs font-medium text-amber-300">
      {children}
    </p>
  );
}
