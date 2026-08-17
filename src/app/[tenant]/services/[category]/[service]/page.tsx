import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import {
  findService,
  getServiceContent,
  serviceHero,
  serviceRoutes,
  siblingServices,
} from "@/lib/services";
import { getTenant } from "@/lib/tenants";

type PageParams = {
  params: Promise<{ tenant: string; category: string; service: string }>;
};

/** One page per service in the five featured practice areas. */
export function generateStaticParams() {
  return serviceRoutes();
}

export const dynamicParams = false;

/** The closing rails show published articles and sessions; see the insights index. */
export const revalidate = 86400;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { tenant, category, service } = await params;
  const found = findService(category, service);

  if (!found) return {};

  const content = getServiceContent(
    `${category}/${service}`,
    getTenant(tenant).code,
  );

  return {
    title: found.service.label,
    description: content?.intro ?? found.category.description,
  };
}

/** A single service within a practice area, reached from the navbar dropdown. */
export default async function ServicePage({ params }: PageParams) {
  const { tenant, category: categorySlug, service: serviceSlug } = await params;
  const region = getTenant(tenant).code;
  const found = findService(categorySlug, serviceSlug);

  if (!found) notFound();

  const { category, service } = found;
  const content = getServiceContent(`${categorySlug}/${serviceSlug}`, region);

  return (
    <ServiceDetailPage
      eyebrow={category.label}
      title={service.label}
      description={category.description}
      image={serviceHero(category, content)}
      content={content}
      tenant={region}
      related={[
        {
          heading: `More in ${category.label}`,
          services: siblingServices(category, service),
          layout: "chips",
        },
      ]}
    />
  );
}
