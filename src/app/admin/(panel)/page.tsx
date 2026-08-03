import Link from "next/link";
import { CalendarDays, FileText, PlusCircle, Video } from "lucide-react";

import { PageHeader, SetupNotice } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import {
  listAllEvents,
  listAllInsights,
  listAllWebinars,
} from "@/lib/admin/queries";
import { events as builtInEvents } from "@/lib/events";
import { insights as builtInInsights } from "@/lib/insights";
import { webinars as builtInWebinars } from "@/lib/webinars";

export default async function AdminOverviewPage() {
  const [events, insights, webinars] = await Promise.all([
    listAllEvents(),
    listAllInsights(),
    listAllWebinars(),
  ]);

  const live = (rows: { published: boolean }[]) =>
    rows.filter((row) => row.published).length;

  return (
    <>
      <PageHeader
        title="Overview"
        description="Publish articles and recorded sessions to every regional site."
      />

      <SetupNotice message={events.error ?? insights.error ?? webinars.error} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          href="/admin/events"
          newHref="/admin/events/new"
          icon={CalendarDays}
          title="Events"
          live={live(events.rows)}
          drafts={events.rows.length - live(events.rows)}
        />

        <SectionCard
          href="/admin/insights"
          newHref="/admin/insights/new"
          icon={FileText}
          title="Insights"
          live={live(insights.rows)}
          drafts={insights.rows.length - live(insights.rows)}
        />

        <SectionCard
          href="/admin/webinars"
          newHref="/admin/webinars/new"
          icon={Video}
          title="Webinars"
          live={live(webinars.rows)}
          drafts={webinars.rows.length - live(webinars.rows)}
        />
      </div>

      {/* The two content sources are worth naming here rather than leaving an
          editor to wonder why the site shows articles this panel does not. */}
      <p className="mt-6 rounded-xl bg-white p-4 text-sm leading-relaxed text-neutral-500 ring-1 ring-neutral-200">
        The site also carries {builtInEvents.length} events,{" "}
        {builtInInsights.length} articles and {builtInWebinars.length} sessions
        written directly into the codebase. They appear on the public site but
        not in the lists here, and they are not editable from this panel.
        Publishing something with the same URL slug replaces the built-in
        version.
      </p>
    </>
  );
}

function SectionCard({
  href,
  newHref,
  icon: Icon,
  title,
  live,
  drafts,
}: {
  href: string;
  newHref: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  live: number;
  drafts: number;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon aria-hidden className="size-4.5" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-brand-navy">
          {title}
        </h2>
      </div>

      <dl className="flex gap-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Live
          </dt>
          <dd className="text-2xl font-bold text-brand-navy">{live}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Drafts
          </dt>
          <dd className="text-2xl font-bold text-neutral-400">{drafts}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={newHref}>
            <PlusCircle aria-hidden />
            New
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>Manage</Link>
        </Button>
      </div>
    </section>
  );
}
