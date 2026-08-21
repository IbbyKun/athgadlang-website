import { ServiceCard } from "@/components/cards/service-card";
import { Section, SectionHeading } from "@/components/ui/section";
import { SwipeRow } from "@/components/ui/swipe-row";
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

        {/*
          A swipe row on a phone, the grid it always was from `sm` up.

          Stacked, these five cards were the longest thing on the mobile
          homepage — five full-bleed images at `min-h-96` is over 1900px of
          scrolling to learn that the firm has five practice areas. As a row
          they read as a set, which is what the desktop grid says and the stack
          did not.

          The grid classes are unchanged and still live here: they describe this
          section's content, not the scrolling, and <SwipeRow> takes over only
          below `sm`. The heading keeps its own place above — only the cards
          scroll, so the section title never slides out of view.
        */}
        <SwipeRow
          label="Services"
          stretch
          gridClassName="gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:max-h-[40rem] xl:grid-cols-5"
        >
          {items.map((service) => (
            <ServiceCard
              key={service.href}
              service={service}
              brand={brand}
              /*
                82% of a container that is itself the viewport less its gutter,
                so the card asks for about three quarters of the screen rather
                than all of it. The wider breakpoints are the cell widths the
                grid above computes.
              */
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw"
              className="w-[82%] shrink-0 snap-center sm:w-auto sm:shrink"
            />
          ))}
        </SwipeRow>
      </div>
    </Section>
  );
}
