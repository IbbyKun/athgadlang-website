import { StatsGrid } from "@/components/stats/stats-grid";
import { stats as allStats, type Stat } from "@/lib/stats";

type NumbersSectionProps = {
  title?: React.ReactNode;
  items?: Stat[];
};

/**
 * Full-bleed figures panel: one red card inset by an equal margin on all four
 * sides. This section sets its own geometry rather than using <Section>, whose
 * padding is asymmetric — the top padding here lives on the section so the
 * card clears the navbar while the inset itself stays even.
 */
export function NumbersSection({
  title = "aG in Numbers",
  items = allStats,
}: NumbersSectionProps) {
  return (
    <section
      id="numbers"
      className="scroll-mt-(--header-h) bg-white pt-(--header-h)"
    >
      <div className="flex min-h-[calc(100svh-var(--header-h))] flex-col p-5 sm:p-8 lg:p-10">
        <div className="flex flex-1 flex-col justify-center gap-12 rounded-[2rem] bg-brand px-6 py-14 sm:rounded-[2.75rem] sm:px-10 lg:px-16">
          <h2 className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>

          <StatsGrid stats={items} />
        </div>
      </div>
    </section>
  );
}
