import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import {
  categoryRoutes,
  findCategory,
  getServiceContent,
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
 * services layout, not a directory.
 *
 * No onward rails: the capability panels already set out what the practice does,
 * so a list of the same services underneath only repeats them. The navbar
 * dropdown and the services index carry that navigation instead.
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
    />
  );
}
