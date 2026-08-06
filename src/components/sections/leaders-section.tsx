import { SectionLink } from "@/components/ui/section-link";
import { BookUser } from "lucide-react";

import { LeaderCard } from "@/components/cards/leader-card";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { leaders as allLeaders, type Leader } from "@/lib/leaders";

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

        {/* 5 across at the widest — the grid now spans the whole container
            rather than 60% of it, so 4 left the portraits oversized. The last
            row carries whatever is left. */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cards.map((leader) => (
            <LeaderCard key={leader.slug} leader={leader} />
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

      <Button
        asChild
        size="lg"
        className="bg-brand-navy text-white hover:bg-brand-navy/90"
      >
        <SectionLink href="/#contact">
          <BookUser className="size-4 text-brand" />
          Consult Today
        </SectionLink>
      </Button>
    </div>
  );
}
