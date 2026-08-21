import { WebinarCard } from "@/components/cards/webinar-card";
import { ViewMoreButton } from "@/components/ui/view-more-button";
import { Section, SectionHeading } from "@/components/ui/section";
import { SwipeRow } from "@/components/ui/swipe-row";
import { webinars as allWebinars, type Webinar } from "@/lib/webinars";

type WebinarsSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Webinar[];
  /** How many cards to show before the View More button. */
  limit?: number;
  fullScreen?: boolean;
};

export function WebinarsSection({
  /* The video strand is branded aG Studio. The route stays /webinars. */
  title = "aG Studio",
  description = "Stay updated on the latest market trends with videos from industry leaders.",
  items = allWebinars,
  limit = 8,
  fullScreen = true,
}: WebinarsSectionProps) {
  const cards = items.slice(0, limit);

  return (
    <Section
      id="webinars"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-neutral-100"
    >
      <div className="flex flex-col gap-6">
        <SectionHeading title={title} description={description} />

        {/*
          4 × 2 on wide screens: eight wider cards, read as one block. On a
          phone that block became eight stacked video cards, so it swipes
          instead — the same treatment the services row gets, and for the same
          reason: a column of eight thumbnails reads as a backlog to scroll
          past rather than a set to pick from.

          No `stretch` here. Unlike the services grid this one was never a
          `flex-1` child — the section's column is content-height and the View
          More button sits under it — so there is no leftover height to absorb.
        */}
        {/*
          The peek is the row's padding and the card takes everything left, so
          the width is stated once and cannot drift from it.

          Worth knowing why this is not `w-[82%]` with wider padding, which is
          what it was: a percentage width resolves against the *content* box, so
          82% inside `px-[9%]` meant 82% of the 312px left after the padding —
          256px of a 412px screen, noticeably narrower than intended and with a
          third of a card showing alongside. `w-full` of the padded box is the
          same figure the padding already implies, so the two cannot disagree.
        */}
        <SwipeRow
          label="aG Studio video"
          gridClassName="gap-3 px-[6%] sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        >
          {cards.map((webinar) => (
            <WebinarCard
              key={webinar.slug}
              webinar={webinar}
              // ~82vw on a phone. The wider breakpoints are the grid's cells.
              sizes="(min-width: 1280px) 24rem, (min-width: 1024px) 32vw, (min-width: 640px) 47vw, 82vw"
              className="w-full shrink-0 snap-center sm:w-auto sm:shrink"
            />
          ))}
        </SwipeRow>

        <div className="flex justify-center">
          <ViewMoreButton href="/webinars" />
        </div>
      </div>
    </Section>
  );
}
