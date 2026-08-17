import { IndustryCard } from "@/components/cards/industry-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { industries as allIndustries, type Industry } from "@/lib/industries";

type IndustriesSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Industry[];
  fullScreen?: boolean;
};

export function IndustriesSection({
  title = "Industries",
  description = "Sector specialists who already speak your language, from first audit to cross-border expansion.",
  items = allIndustries,
  fullScreen = true,
}: IndustriesSectionProps) {
  return (
    <Section
      id="industries"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-white"
    >
      <div className="flex flex-col gap-8">
        <SectionHeading title={title} description={description} />

        {/* 6 × 2 at the widest breakpoint; `columns` keeps the colour
            checkerboard in step with the layout. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((industry, index) => (
            <IndustryCard
              key={industry.slug}
              industry={industry}
              index={index}
              columns={6}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
