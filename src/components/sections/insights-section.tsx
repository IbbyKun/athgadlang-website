import { InsightCard } from "@/components/cards/insight-card";
import { ViewMoreButton } from "@/components/ui/view-more-button";
import { ScrollRow } from "@/components/ui/scroll-row";
import { SectionHeading } from "@/components/ui/section";
import { insights as allInsights, type Insight } from "@/lib/insights";

type InsightsSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Insight[];
  /** How many cards to place in the carousel. */
  limit?: number;
  /** Hold the viewport and scroll the row sideways before releasing. */
  pinned?: boolean;
};

/**
 * The row is pinned, so this section owns its own geometry rather than using
 * <Section>: its wrapper grows by the row's horizontal overflow while the
 * visible pane stays exactly one screen tall.
 */
export function InsightsSection({
  title = "Insights",
  description = "Explore fresh perspectives and expert analysis.",
  items = allInsights,
  limit = 8,
  pinned = true,
}: InsightsSectionProps) {
  const cards = items.slice(0, limit);

  return (
    <section id="insights" className="scroll-mt-(--header-h) bg-neutral-50">
      <ScrollRow
        label="Latest insights"
        pinned={pinned}
        header={<SectionHeading title={title} description={description} />}
        footer={
          <div className="flex justify-center">
            <ViewMoreButton href="/insights" />
          </div>
        }
      >
        {cards.map((insight) => (
          <InsightCard key={insight.slug} insight={insight} />
        ))}
      </ScrollRow>
    </section>
  );
}
