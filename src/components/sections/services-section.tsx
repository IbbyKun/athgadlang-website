import { ServiceCard } from "@/components/cards/service-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { featuredServices, siteConfig, type NavItem } from "@/lib/site-config";
import { getTenant, type TenantCode } from "@/lib/tenants";

type ServicesSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Defaults to the services flagged `featured` in site-config. */
  items?: NavItem[];
  /** Region being served, so the card copy names the right trading brand. */
  tenant?: TenantCode;
  fullScreen?: boolean;
};

export function ServicesSection({
  title = "Services",
  description,
  items = featuredServices,
  tenant,
  fullScreen = true,
}: ServicesSectionProps) {
  const brand = tenant
    ? (getTenant(tenant).brandName ?? siteConfig.name)
    : siteConfig.name;

  return (
    <Section
      id="services"
      fullScreen={fullScreen}
      containerSize="wide"
      className="bg-white"
    >
      <div className="flex flex-1 flex-col gap-10">
        <SectionHeading title={title} description={description} />

        {/* The grid takes the remaining height, so the cards — not empty
            padding — absorb whatever the viewport gives us. max-h stops them
            turning into slivers on very tall screens. */}
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:max-h-[40rem] xl:grid-cols-5">
          {items.map((service) => (
            <ServiceCard key={service.href} service={service} brand={brand} />
          ))}
        </div>
      </div>
    </Section>
  );
}
