import { LogoMarquee } from "@/components/portfolio/logo-marquee";
import { Section, SectionHeading } from "@/components/ui/section";
import { clients as allClients, splitIntoRows, type Client } from "@/lib/clients";

/** Per-row direction and pace. Differing speeds stop the rows marching in step. */
const rowMotion = [
  { direction: "left", duration: "38s" },
  { direction: "right", duration: "48s" },
  { direction: "left", duration: "42s" },
] as const;

type PortfolioSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: Client[];
  fullScreen?: boolean;
};

export function PortfolioSection({
  title = "Our Portfolio",
  description = "Trusted across the region by listed groups, global brands and fast-growing challengers.",
  items = allClients,
  fullScreen = true,
}: PortfolioSectionProps) {
  const rows = splitIntoRows(items, rowMotion.length);

  return (
    <Section
      id="portfolio"
      fullScreen={fullScreen}
      contained={false}
      className="overflow-hidden bg-brand-navy"
    >
      <div className="flex flex-col gap-10">
        <SectionHeading
          tone="inverted"
          title={title}
          description={description}
          className="px-4 sm:px-6 lg:px-8"
        />

        {/* Full-bleed rows: the gallery should run off both edges. */}
        <div className="flex flex-col gap-4">
          {rows.map((row, index) => (
            <LogoMarquee
              key={index}
              clients={row}
              direction={rowMotion[index].direction}
              duration={rowMotion[index].duration}
              label={`Client logos, row ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
