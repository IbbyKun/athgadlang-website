import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { getTenant, tenants, type TenantCode } from "@/lib/tenants";
import { cn } from "@/lib/utils";

/**
 * One row in the insights or webinars list: thumbnail, title, where and when
 * it publishes, and the two things you can do to it.
 *
 * The whole row is a link to the editor via a stretched overlay, with the view
 * and delete controls raised above it — the same pattern the public cards use.
 */
export function ContentRow({
  href,
  title,
  meta,
  date,
  imageUrl,
  regions,
  published,
  viewHref,
  deleteAction,
  id,
  label,
}: {
  href: string;
  title: string;
  /** Category, runtime — whatever distinguishes this kind of item. */
  meta?: string;
  date: string;
  imageUrl: string;
  regions: TenantCode[];
  published: boolean;
  /** Absent for a draft, which has nothing live to look at. */
  viewHref?: string;
  deleteAction: (formData: FormData) => void;
  id: string;
  label: string;
}) {
  return (
    <div className="group relative flex items-center gap-4 rounded-xl bg-white p-3 ring-1 ring-neutral-200 transition-shadow hover:shadow-md focus-within:shadow-md">
      <div className="relative hidden aspect-[2/1] w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:block">
        {imageUrl && (
          // A plain <img>: this list is behind a sign-in and can show dozens of
          // thumbnails, none of which is worth an optimiser round trip.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="size-full object-cover" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill published={published} />
          {meta && (
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              {meta}
            </span>
          )}
          <time
            dateTime={date}
            className="text-xs font-medium text-neutral-500"
          >
            {formatDate(date)}
          </time>
        </div>

        <h3 className="truncate text-sm font-bold text-brand-navy transition-colors group-hover:text-brand">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {title}
          </Link>
        </h3>

        <RegionList regions={regions} />
      </div>

      {/* Above the stretched link, so these stay clickable. */}
      <div className="relative z-10 flex shrink-0 items-center gap-1">
        {viewHref && (
          <Button asChild variant="ghost" size="sm">
            <a href={viewHref} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden />
              <span className="sr-only">View on the site</span>
            </a>
          </Button>
        )}

        <DeleteButton id={id} action={deleteAction} label={label} />
      </div>
    </div>
  );
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-bold",
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-neutral-100 text-neutral-500",
      )}
    >
      {published ? "Live" : "Draft"}
    </span>
  );
}

/** Which regional sites carry this. Collapsed to a word when it is all of them. */
function RegionList({ regions }: { regions: TenantCode[] }) {
  const labels =
    regions.length === tenants.length
      ? ["All regions"]
      : regions.map((code) => getTenant(code).label);

  return (
    <p className="truncate text-xs text-neutral-500">{labels.join(" · ")}</p>
  );
}
