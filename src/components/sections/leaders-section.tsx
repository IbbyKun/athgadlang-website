import { SectionLink } from "@/components/ui/section-link";
import { BookUser } from "lucide-react";

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
          Wrapped flex, not a grid. Same five-across rhythm, but a grid pins a
          short last row to the left edge — with eleven leaders that left one
          portrait alone against four empty columns, and the section read as
          broken rather than as full. Flex centres whatever is left over, so
          the block closes symmetrically however many people are in it.

          The widths are the column widths a grid would have computed: the row
          minus its gaps, divided by the column count.
        */}
        <div className="flex flex-wrap justify-center gap-4">
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
        </div>

        <ConsultPrompt />
      </div>
    </Section>
  );
}

/**
 * Closing prompt beneath the grid. Centred, and no `mt-auto`: it used to be
 * pushed to the foot of a left rail, and now it simply follows the cards.
 */
function ConsultPrompt() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="max-w-2xl text-base leading-relaxed text-neutral-700">
        Your business deserves expert solutions. With a global network of
        seasoned professionals, we provide tailored solutions to elevate your
        business.
      </p>

      <p className="text-xl font-bold tracking-tight text-brand">
        Let&rsquo;s build the future together.
      </p>

      {/* Icon in amber rather than brand red: red on this navy is the pairing
          that reads as muddy, and the glyph is the one thing here that can
          carry a second colour without competing with the label. */}
      <Button asChild size="lg" className={actionButtonClass("navy")}>
        <SectionLink href="/#contact">
          <BookUser className="size-4 text-amber-300" />
          Consult Today
        </SectionLink>
      </Button>
    </div>
  );
}
