import { SectionLink } from "@/components/ui/section-link";

import { LeaderCard } from "@/components/cards/leader-card";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { SwipeRow } from "@/components/ui/swipe-row";
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
        {/*
          Below `sm` the same two columns scroll sideways instead of wrapping.

          Eleven portraits two abreast is six rows and most of a phone screen
          each — the section stopped reading as a team and became a directory to
          scroll past. Two at a time is what the supplied design asks for and it
          is also the width the cards already had here, so nothing about them
          changes: the row simply stops wrapping.

          `sm:flex sm:flex-wrap` because this one is not a grid and never was —
          the wrap is what lets ConsultPrompt take whatever the final row has
          left. <SwipeRow> restores a grid by default, so that has to be
          overridden rather than inherited. `px-0` likewise: the centred peek
          the other rows use would show a third of a card, and here two cards
          fill the width exactly.
        */}
        <SwipeRow
          label="our leaders"
          perView={2}
          gridClassName="gap-4 px-0 sm:flex sm:flex-wrap"
        >
          {cards.map((leader) => (
            <LeaderCard
              key={leader.slug}
              leader={leader}
              className={cn(
                "w-[calc((100%-1rem)/2)] shrink-0 snap-start sm:shrink",
                "md:w-[calc((100%-2rem)/3)]",
                "lg:w-[calc((100%-3rem)/4)]",
                "xl:w-[calc((100%-4rem)/5)]",
              )}
            />
          ))}

          {/* Desktop only — the copy below the row is the phone's version of
              this. See the note there. */}
          <ConsultPrompt className="hidden min-w-72 flex-1 sm:flex" />
        </SwipeRow>

        {/*
          The same prompt, under the row, on a phone only.

          Two copies of it, and one of them is always `display: none`, so it is
          never read out twice and never in the layout twice. That is the price
          of it having to be in two places: from `sm` up it must be the wrap's
          last item or it cannot sit beside the leftover portrait, and on a
          phone it must be outside the row or it becomes a slide — which is what
          it was, and it read badly. A card-width slide clipped the sentence
          mid-word; a window-width one left the last portrait sharing the screen
          with a wall of text.

          Under the dots rather than above them: the dots belong to the row and
          reading them as this block's controls would be worse than the gap.
        */}
        <ConsultPrompt className="w-full sm:hidden" />
      </div>
    </Section>
  );
}

/**
 * Closing prompt: the wrap's last item from `sm` up, sitting in the final row
 * beside the leftover portrait, and a block under the row on a phone.
 *
 * Left-aligned and vertically centred against the card next to it, so on the
 * wider layouts the two read as one row rather than as a caption under a
 * photograph.
 *
 * Carries no width or flex behaviour of its own — the two call sites supply it,
 * because they need opposite things and each knows which.
 */
function ConsultPrompt({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center gap-4 text-left",
        className,
      )}
    >
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
