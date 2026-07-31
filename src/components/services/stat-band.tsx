import { SectionHeading } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { type ServiceStat } from "@/lib/services";

/**
 * The figures a practice is judged on. Type-only rather than the homepage's
 * ring panel: these are counts, not proportions, and the rings there are set by
 * design rather than computed.
 */
export function StatBand({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: ServiceStat[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading align="left" title={title} description={description} />

      {/*
        Columns follow the count so the last figure is never left orphaned on a
        row of its own: four figures sit four-up, anything else three-up.
      */}
      <dl
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          items.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {items.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8"
          >
            <dt className="order-2 text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {stat.label}
            </dt>
            <dd className="order-1 text-4xl font-bold leading-none tracking-tight text-brand sm:text-5xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
