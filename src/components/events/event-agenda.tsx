import type { EventAgendaItem } from "@/lib/events";

/**
 * The running order, as a timeline.
 *
 * Times are shown as written — they are in the event's own timezone, which the
 * fact panel states once. Converting them per reader would need a real
 * timestamp and would make the page's output depend on where it is rendered.
 */
export function EventAgenda({
  items,
  timezone,
}: {
  items: EventAgendaItem[];
  timezone: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand">
          Running order
        </h2>
        <p className="text-xs text-neutral-400">All times {timezone}</p>
      </div>

      <ol className="flex flex-col">
        {items.map((item, index) => (
          <li key={`${item.time}-${item.title}`} className="flex gap-4">
            {/* The rule is drawn by the marker column so it connects the dots
                and stops at the last one, rather than running past it. */}
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className="mt-1.5 size-2.5 shrink-0 rounded-full bg-brand"
              />
              {index < items.length - 1 && (
                <span aria-hidden className="w-px flex-1 bg-neutral-200" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-0.5 pb-5">
              <span className="font-mono text-xs font-semibold text-brand">
                {item.time}
              </span>
              <span className="text-sm font-semibold text-brand-navy">
                {item.title}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
