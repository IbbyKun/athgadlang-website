import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** Title, one line of context, and whatever action belongs at the top right. */
export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: string;
  description?: string;
  /** Shown above the title, for pages reached from a list. */
  back?: { href: string; label: string };
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-neutral-500 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronLeft aria-hidden className="size-4" />
          {back.label}
        </Link>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-brand-navy">
            {title}
          </h1>
          {description && (
            <p className="text-sm leading-relaxed text-neutral-500">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>
    </div>
  );
}

/** Shown in place of a list when there is nothing in it yet. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white/50 px-6 py-14 text-center">
      <p className="text-sm font-bold text-brand-navy">{title}</p>
      <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
        {description}
      </p>
      {action}
    </div>
  );
}

/**
 * A setup problem the editor can fix — missing environment variables, missing
 * tables. Distinct from a form error: it is about the installation, not the
 * content, so it says which file to run rather than which field to correct.
 */
export function SetupNotice({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mb-6 rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
      {message}
    </p>
  );
}
