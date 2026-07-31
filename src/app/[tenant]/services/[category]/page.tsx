import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import {
  categoryRoutes,
  findCategory,
  getServiceContent,
  otherCategories,
  serviceHero,
} from "@/lib/services";

type PageParams = { params: Promise<{ category: string }> };

/** One page per featured practice area. */
export function generateStaticParams() {
  return categoryRoutes();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategory(slug);

  if (!category) return {};

  const content = getServiceContent(slug);

  return {
    title: category.label,
    description: content?.intro ?? category.description,
  };
}

/**
 * A practice area's own page — the one reached from the footer. It is the full
 * services layout, not a directory: the capability panels and partners for the
 * area, with its individual services listed as onward links (those also have
 * their own pages, reached from the navbar dropdown).
 */
export default async function ServiceCategoryPage({ params }: PageParams) {
  const { category: slug } = await params;
  const category = findCategory(slug);

  if (!category) notFound();

  const content = getServiceContent(slug);

  return (
    <ServiceDetailPage
      eyebrow="Services"
      title={category.label}
      description={category.description}
      image={serviceHero(category, content)}
      content={content}
      related={[
        {
          heading: `${category.label} Services`,
          services: category.items ?? [],
          layout: "cards",
        },
        {
          heading: "Other Practice Areas",
          services: otherCategories(category),
          layout: "chips",
        },
      ]}
    />
  );
}
