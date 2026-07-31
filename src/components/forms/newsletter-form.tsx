"use client";

import * as React from "react";
import { ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "sent" | "error";

/** Inline newsletter sign-up: a single glass pill with the send button inset. */
export function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [notice, setNotice] = React.useState<string | null>(null);

  const submitting = status === "submitting";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setStatus("submitting");
    setNotice(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setNotice(result.message ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      form.reset();
      setNotice(result.message);
      setStatus("sent");
    } catch {
      setNotice("Could not subscribe. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 rounded-full bg-white/[0.06] p-1.5 pl-5 ring-1 ring-white/15 transition-colors focus-within:bg-white/10 focus-within:ring-brand">
        <label htmlFor="newsletter-email" className="sr-only">
          Your email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="Your email address"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="sr-only"
        />

        <button
          type="submit"
          disabled={submitting}
          aria-label="Subscribe to the newsletter"
          className="group grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </div>

      {notice && (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "px-5 text-xs font-medium",
            status === "sent" ? "text-emerald-300" : "text-amber-300",
          )}
        >
          {notice}
        </p>
      )}
    </form>
  );
}
