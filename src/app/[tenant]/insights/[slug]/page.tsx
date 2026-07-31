import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, UserRound } from "lucide-react";

import { InsightCard } from "@/components/cards/insight-card";
import { ArticleNav } from "@/components/insights/article-nav";
import { InsightBody } from "@/components/insights/insight-body";
import { ShareRow } from "@/components/insights/share-row";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { formatDate } from "@/lib/format";
import {
  adjacentInsights,
  getInsight,
  insightByline,
  insightSlugs,
  relatedInsights,
} from "@/lib/insights";

/** One page for every article; unknown slugs 404 rather than render. */
export function generateStaticParams() {
  return insightSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) return {};

  return {
    title: insight.title,
    description: insight.excerpt,
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) notFound();

  const { previous, next } = adjacentInsights(insight);
  const related = relatedInsights(insight, 4);

  return (
    <>
      <Hero
        eyebrow={insight.category}
        title={insight.title}
        image={insight.image}
        fullScreen={false}
      />

      <Section className="bg-neutral-50">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-navy transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ChevronLeft aria-hidden className="size-4" />
            All Insights
          </Link>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-10">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-500">
                <span className="flex items-center gap-2">
                  <CalendarDays aria-hidden className="size-4 text-brand" />
                  <time dateTime={insight.date}>{formatDate(insight.date)}</time>
                </span>
                <span aria-hidden className="text-neutral-300">
                  /
                </span>
                <span className="flex items-center gap-2">
                  <UserRound aria-hidden className="size-4 text-brand" />
                  {insight.author ?? insightByline}
                </span>
              </div>

              {/* Short brand rule under the meta line, as on the article
                  layout this page replaces. */}
              <span aria-hidden className="block h-0.5 w-14 bg-brand" />
            </header>

            <div className="mt-8">
              <InsightBody blocks={insight.body} />
            </div>
          </article>

          <ShareRow title={insight.title} />

          <ArticleNav previous={previous} next={next} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section containerSize="wide" className="bg-white">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="More Insights"
              description="Related reading from the same practice areas."
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((item) => (
                <InsightCard key={item.slug} insight={item} layout="grid" />
              ))}
            </div>
          </div>
        </Section>
      )}

      <CtaBand
        title="Have a question about this?"
        description="Bring it to the specialists who wrote the guidance — we will tell you what it means for your business, not in general."
        actions={[
          { label: "Talk to an Expert", href: "/contact" },
          { label: "Watch Our Webinars", href: "/webinars", variant: "outline" },
        ]}
      />
    </>
  );
}
