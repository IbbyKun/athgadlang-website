import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { deletePopup } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  EmptyState,
  PageHeader,
  SetupNotice,
} from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { listAllPopups } from "@/lib/admin/queries";
import { formatDate } from "@/lib/format";
import type { SitePopupRow } from "@/lib/popup";
import { getTenant } from "@/lib/tenants";
import { cn } from "@/lib/utils";

/**
 * Announcement popups.
 *
 * No search box, unlike the content lists: a site runs one popup at a time and
 * this is a handful of rows, most of them expired. Anything that needed
 * searching would mean something had gone wrong with how they are being used.
 */
export default async function AdminPopupsPage() {
  const { rows, error } = await listAllPopups();

  const today = new Date().toISOString().slice(0, 10);
  const live = rows.filter((row) => isLive(row, today));
  const rest = rows.filter((row) => !isLive(row, today));

  return (
    <>
      <PageHeader
        title="Popups"
        description="The overlay shown to visitors on arrival. One shows at a time, and closing it hides it for 24 hours."
        action={
          <Button asChild>
            <Link href="/admin/popups/new">
              <PlusCircle aria-hidden />
              New popup
            </Link>
          </Button>
        }
      />

      <SetupNotice message={error} />

      {rows.length === 0 && !error ? (
        <EmptyState
          title="No popups yet"
          description="Announce an upcoming event or a recording worth watching. Set an expiry date and it takes itself down."
          action={
            <Button asChild size="sm" className="mt-1">
              <Link href="/admin/popups/new">
                <PlusCircle aria-hidden />
                New popup
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-8">
          {live.length > 1 && (
            <p className="rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
              {live.length} popups are live at once. Visitors see only the most
              recently created one — the others are doing nothing.
            </p>
          )}

          <Group title="Showing now" rows={live} today={today} />
          <Group title="Not showing" rows={rest} today={today} />
        </div>
      )}
    </>
  );
}

/** Published, and today falls inside whatever window it was given. */
function isLive(row: SitePopupRow, today: string) {
  if (!row.published) return false;
  if (row.starts_on && row.starts_on > today) return false;
  if (row.ends_on && row.ends_on < today) return false;
  return true;
}

function Group({
  title,
  rows,
  today,
}: {
  title: string;
  rows: SitePopupRow[];
  today: string;
}) {
  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
        {title} ({rows.length})
      </h2>

      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.id}>
            <PopupRow row={row} today={today} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PopupRow({ row, today }: { row: SitePopupRow; today: string }) {
  const expired = Boolean(row.ends_on && row.ends_on < today);
  const scheduled = Boolean(row.starts_on && row.starts_on > today);

  return (
    <div className="group relative flex items-center gap-4 rounded-xl bg-white p-3 ring-1 ring-neutral-200 transition-shadow hover:shadow-md focus-within:shadow-md">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Status
            label={
              !row.published
                ? "Draft"
                : expired
                  ? "Expired"
                  : scheduled
                    ? "Scheduled"
                    : "Live"
            }
            tone={
              !row.published || expired
                ? "muted"
                : scheduled
                  ? "amber"
                  : "green"
            }
          />

          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            {row.youtube_id ? "Video" : row.event_slug ? "Event" : "No link"}
          </span>
        </div>

        <Link
          href={`/admin/popups/${row.id}`}
          className="text-sm font-bold text-brand-navy after:absolute after:inset-0 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {row.title || "Untitled popup"}
        </Link>

        <p className="text-xs text-neutral-500">
          {describeWindow(row)}
          {" · "}
          {row.regions.map((code) => getTenant(code).label).join(", ")}
        </p>
      </div>

      {/* Raised above the row-wide link overlay, or it could not be clicked. */}
      <div className="relative z-10 shrink-0">
        <DeleteButton id={row.id} action={deletePopup} label="popup" />
      </div>
    </div>
  );
}

/** "Until 30 Aug 2026", "From 1 Sep 2026", "1–30 Sep 2026", or "No end date". */
function describeWindow(row: SitePopupRow) {
  if (row.starts_on && row.ends_on) {
    return `${formatDate(row.starts_on)} to ${formatDate(row.ends_on)}`;
  }
  if (row.ends_on) return `Until ${formatDate(row.ends_on)}`;
  if (row.starts_on) return `From ${formatDate(row.starts_on)}`;
  return "No end date";
}

function Status({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "amber" | "muted";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider",
        tone === "green" && "bg-emerald-50 text-emerald-700",
        tone === "amber" && "bg-amber-50 text-amber-700",
        tone === "muted" && "bg-neutral-100 text-neutral-600",
      )}
    >
      {label}
    </span>
  );
}
