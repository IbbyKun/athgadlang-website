import { WebinarCard } from "@/components/cards/webinar-card";
import { ViewMoreButton } from "@/components/ui/view-more-button";
import { Section, SectionHeading } from "@/components/ui/section";
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
  title = "Webinars",
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

        {/* 4 × 2 on wide screens: eight wider cards, read as one block. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((webinar) => (
            <WebinarCard key={webinar.slug} webinar={webinar} />
          ))}
        </div>

        <div className="flex justify-center">
          <ViewMoreButton href="/webinars" />
        </div>
      </div>
    </Section>
  );
}
