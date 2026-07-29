import Link from "next/link";
import { BookUser } from "lucide-react";

import { LeaderCard } from "@/components/cards/leader-card";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { leaders as allLeaders, type Leader } from "@/lib/leaders";

type LeadersSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Leader[];
  limit?: number;
  fullScreen?: boolean;
};

export function LeadersSection({
  title = "Our Leaders",
  description = "We draw on our global network to assemble a team of experts.",
  items = allLeaders,
  limit = 10,
  fullScreen = true,
}: LeadersSectionProps) {
  const cards = items.slice(0, limit);

  return (
    <Section
      id="leaders"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-white"
    >
      {/* 40 / 60 split: the copy rail needs room to breathe next to the grid. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        {/* Left rail: heading at the top, consult prompt pinned to the bottom. */}
        <div className="flex flex-col gap-8">
          <SectionHeading align="left" title={title} description={description} />
          <ConsultPrompt />
        </div>

        {/* 4 across on wide screens: ten cards fill two rows, then two more. */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {cards.map((leader) => (
            <LeaderCard key={leader.slug} leader={leader} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/** Closing prompt beneath the section heading. */
function ConsultPrompt() {
  return (
    <div className="mt-auto flex flex-col items-start gap-4">
      <p className="text-base leading-relaxed text-neutral-700">
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
        className="rounded-lg bg-brand-navy text-white hover:bg-brand-navy/90"
      >
        <Link href="/contact">
          <BookUser className="size-4 text-brand" />
          Consult Today
        </Link>
      </Button>
    </div>
  );
}
