import { SectionLink } from "@/components/ui/section-link";

import { LeaderCard } from "@/components/cards/leader-card";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { actionButtonClass } from "@/components/ui/view-more-button";
import { leaders as allLeaders, type Leader } from "@/lib/leaders";
import { cn } from "@/lib/utils";

type LeadersSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Leader[];
  /** Cap the number of cards. Omitted shows all of them. */
  limit?: number;
  fullScreen?: boolean;
};

export function LeadersSection({
  title = "Our Leaders",
  description = "We draw on our global network to assemble a team of experts.",
  items = allLeaders,
  limit,
  fullScreen = true,
}: LeadersSectionProps) {
  // Everyone, unless a caller asks for fewer. This used to default to ten,
  // which silently dropped whoever was eleventh in the array — a leader can be
  // added to the data and never appear, with nothing to indicate why.
  const cards = limit ? items.slice(0, limit) : items;

  return (
    <Section
      id="leaders"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-white"
    >
      {/* Stacked, like every other section: centred heading, then the grid,
          then the closing prompt. This used to be a 40/60 split with the copy
          in a left rail, which read as a different kind of section to the ones
          either side of it. */}
      <div className="flex flex-col gap-10">
        <SectionHeading title={title} description={description} />

        {/*
          Wrapped flex, not a grid, and the closing prompt is the last item in
          it rather than a block underneath.

          Eleven leaders across five columns leaves one portrait on the final
          row. Centring that row was an improvement on leaving it against the
          left edge, but it still read as a row that had run out. The prompt now
          takes the space instead: the last portrait keeps its column, the copy
          and its button sit beside it, and the section closes on a full row.

          `flex-1` is what makes that work at every width — the prompt takes
          whatever the final row has left, and drops to a row of its own once
          there is less than its min-width to give it.

          The card widths are the column widths a grid would have computed: the
          row minus its gaps, divided by the column count.
        */}
        <div className="flex flex-wrap gap-4">
          {cards.map((leader) => (
            <LeaderCard
              key={leader.slug}
              leader={leader}
              className={cn(
                "w-[calc((100%-1rem)/2)]",
                "md:w-[calc((100%-2rem)/3)]",
                "lg:w-[calc((100%-3rem)/4)]",
                "xl:w-[calc((100%-4rem)/5)]",
              )}
            />
          ))}

          <ConsultPrompt />
        </div>
      </div>
    </Section>
  );
}

/**
 * Closing prompt, sitting in the grid's last row beside the leftover portrait.
 *
 * Left-aligned and vertically centred against the card next to it, so the two
 * read as one row rather than as a caption under a photograph.
 */
function ConsultPrompt() {
  return (
    <div className="flex min-w-72 flex-1 flex-col items-start justify-center gap-4 text-left">
      <p className="max-w-2xl text-base leading-relaxed text-neutral-700">
        Your business deserves expert solutions. With a global network of
        seasoned professionals, we provide tailored solutions to elevate your
        business.
      </p>

      <p className="text-xl font-bold tracking-tight text-brand">
        Let&rsquo;s build the future together.
      </p>

      {/* No icon. The label says what the button does and the glyph was the
          only thing on the page carrying a third colour. */}
      <Button asChild size="lg" className={actionButtonClass("navy")}>
        <SectionLink href="/#contact">Consult Today</SectionLink>
      </Button>
    </div>
  );
}
