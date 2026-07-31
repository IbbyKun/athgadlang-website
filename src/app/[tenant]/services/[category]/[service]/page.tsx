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

type PageParams = { params: Promise<{ category: string; service: string }> };

/** One page per service in the five featured practice areas. */
export function generateStaticParams() {
  return serviceRoutes();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { category, service } = await params;
  const found = findService(category, service);

  if (!found) return {};

  const content = getServiceContent(`${category}/${service}`);

  return {
    title: found.service.label,
    description: content?.intro ?? found.category.description,
  };
}

/** A single service within a practice area, reached from the navbar dropdown. */
export default async function ServicePage({ params }: PageParams) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const found = findService(categorySlug, serviceSlug);

  if (!found) notFound();

  const { category, service } = found;
  const content = getServiceContent(`${categorySlug}/${serviceSlug}`);

  return (
    <ServiceDetailPage
      eyebrow={category.label}
      title={service.label}
      description={category.description}
      image={serviceHero(category, content)}
      content={content}
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
