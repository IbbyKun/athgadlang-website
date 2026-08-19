import Link from "next/link";
import { Check, Mail, Phone, RotateCcw, Search } from "lucide-react";

import { deleteEnquiry, toggleEnquiryHandled } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  EmptyState,
  PageHeader,
  SetupNotice,
} from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import {
  countOpenEnquiries,
  enquiriesPerPage,
  listEnquiries,
  type ContactEnquiryRow,
} from "@/lib/enquiries";
import { formatDateTime } from "@/lib/format";
import { getTenant } from "@/lib/tenants";
import { cn } from "@/lib/utils";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

/** Reads a single-valued search param, ignoring repeats. */
function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/**
 * Enquiries taken by the contact form.
 *
 * Paged and searched on the server, unlike the content lists — see
 * lib/enquiries.ts for why this one cannot filter in the browser.
 *
 * State lives in the URL rather than in component state, which is what makes
 * a particular page of results something you can bookmark, reload without
 * losing, and send to a colleague. It also means the search box and the tabs
 * are plain forms and links: no client component is involved in this page at
 * all beyond the delete confirmation.
 */
export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const params = await searchParams;
  const query = one(params.q).trim();
  const status = one(params.status) === "open" ? "open" : "all";

  const [{ rows, total, page, pageCount, error }, open] = await Promise.all([
    listEnquiries({ page: Number(one(params.page)) || 1, query, status }),
    countOpenEnquiries(),
  ]);

  const first = total === 0 ? 0 : (page - 1) * enquiriesPerPage + 1;
  const last = Math.min(page * enquiriesPerPage, total);

  /** A URL for this list with some of its state changed. */
  const href = (next: { status?: string; q?: string; page?: number }) => {
    const search = new URLSearchParams();
    const withStatus = next.status ?? status;
    const withQuery = next.q ?? query;

    if (withStatus === "open") search.set("status", "open");
    if (withQuery) search.set("q", withQuery);
    // Page 1 is the default, and a bare URL reads better than one ending ?page=1.
    if (next.page && next.page > 1) search.set("page", String(next.page));

    const suffix = search.toString();
    return suffix ? `/admin/enquiries?${suffix}` : "/admin/enquiries";
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Everything sent through the contact form, newest first. Nothing here is visible on the public site."
      />

      <SetupNotice message={error} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* A GET form, so submitting it is a navigation: the results are a
              real URL, the back button works, and a reload does not re-post. */}
          <form method="get" action="/admin/enquiries" className="flex gap-2">
            {status === "open" && (
              <input type="hidden" name="status" value="open" />
            )}

            <div className="relative min-w-0 flex-1 sm:w-72">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-500"
              />
              <label htmlFor="enquiry-search" className="sr-only">
                Search enquiries by name, email, phone or message
              </label>
              <input
                id="enquiry-search"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search name, email, phone or message"
                className={cn(
                  "h-9 w-full rounded-sm border border-input bg-transparent pl-8 pr-3 text-sm outline-none transition-colors",
                  "focus-visible:border-ring placeholder:text-muted-foreground",
                  "[&::-webkit-search-cancel-button]:appearance-none",
                )}
              />
            </div>

            <Button type="submit" size="sm" variant="outline">
              Search
            </Button>

            {query && (
              <Button asChild size="sm" variant="ghost">
                <Link href={href({ q: "", page: 1 })}>Clear</Link>
              </Button>
            )}
          </form>

          <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-1">
            <Tab href={href({ status: "all", page: 1 })} active={status === "all"}>
              All
            </Tab>
            <Tab
              href={href({ status: "open", page: 1 })}
              active={status === "open"}
            >
              Awaiting reply ({open})
            </Tab>
          </div>
        </div>

        {rows.length === 0 && !error ? (
          <EmptyState
            title={query ? "Nothing matches that search" : "No enquiries yet"}
            description={
              query
                ? "Try a name, part of an email address, or a phone number."
                : "Anything sent through the contact form on any regional site lands here."
            }
            action={
              query ? (
                <Button asChild size="sm" variant="outline" className="mt-1">
                  <Link href={href({ q: "", page: 1 })}>Clear search</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {rows.map((row) => (
                <li key={row.id}>
                  <EnquiryCard row={row} />
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-neutral-500">
                Showing {first}–{last} of {total}
              </p>

              {pageCount > 1 && (
                <div className="flex items-center gap-2">
                  <PageLink
                    href={href({ page: page - 1 })}
                    disabled={page === 1}
                  >
                    Previous
                  </PageLink>

                  <span className="text-xs font-medium text-neutral-500">
                    Page {page} of {pageCount}
                  </span>

                  <PageLink
                    href={href({ page: page + 1 })}
                    disabled={page === pageCount}
                  >
                    Next
                  </PageLink>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/**
 * One enquiry.
 *
 * A card rather than a table row: the message is the point of the enquiry and
 * it is prose, which a table column either truncates into uselessness or lets
 * blow the layout apart. The contact details are links — a lead you can call
 * by clicking is a lead somebody actually calls.
 */
function EnquiryCard({ row }: { row: ContactEnquiryRow }) {
  const handled = Boolean(row.handled_at);
  const name = `${row.first_name} ${row.last_name}`.trim();

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 transition-shadow hover:shadow-md",
        // Replied-to enquiries stay in the list but stop competing for
        // attention: the queue is what the page is for.
        handled ? "opacity-70 ring-neutral-200" : "ring-neutral-300",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-brand-navy">{name}</h2>

            {handled ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-emerald-700">
                Replied
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-amber-700">
                Awaiting reply
              </span>
            )}

            {row.region && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-neutral-600">
                {getTenant(row.region).label}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <a
              href={`mailto:${row.email}`}
              className="inline-flex items-center gap-1.5 font-medium text-brand-navy transition-colors hover:text-brand"
            >
              <Mail aria-hidden className="size-3.5" />
              {row.email}
            </a>

            <a
              href={`tel:${row.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-1.5 font-medium text-brand-navy transition-colors hover:text-brand"
            >
              <Phone aria-hidden className="size-3.5" />
              {row.phone}
            </a>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <form action={toggleEnquiryHandled}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="handled" value={String(handled)} />
            <Button type="submit" variant="ghost" size="sm">
              {handled ? (
                <>
                  <RotateCcw aria-hidden />
                  <span className="hidden sm:inline">Reopen</span>
                </>
              ) : (
                <>
                  <Check aria-hidden />
                  <span className="hidden sm:inline">Mark replied</span>
                </>
              )}
            </Button>
          </form>

          <DeleteButton
            id={row.id}
            action={deleteEnquiry}
            label="enquiry"
          />
        </div>
      </div>

      {row.message && (
        <p className="whitespace-pre-line text-pretty text-sm leading-relaxed text-neutral-700">
          {row.message}
        </p>
      )}

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
        <time dateTime={row.created_at}>{formatDateTime(row.created_at)}</time>
        {/* Which page they were reading when they asked — usually the service
            they want, which is the most useful thing here after the number. */}
        {row.source_path && row.source_path !== "/" && (
          <span className="font-mono">{row.source_path}</span>
        )}
      </p>
    </article>
  );
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "bg-white text-brand-navy shadow-sm"
          : "text-neutral-600 hover:text-brand-navy",
      )}
    >
      {children}
    </Link>
  );
}

/** Previous/Next. Rendered as text, not a dead link, at either end. */
function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-sm border border-neutral-200 px-2.5 py-1 text-xs font-semibold text-neutral-400">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-sm border border-neutral-300 px-2.5 py-1 text-xs font-semibold text-brand-navy transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </Link>
  );
}
