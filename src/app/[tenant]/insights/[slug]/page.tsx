import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, UserRound } from "lucide-react";

import { InsightCard } from "@/components/cards/insight-card";
import { ArticleNav } from "@/components/insights/article-nav";
import { InsightBody } from "@/components/insights/insight-body";
import { RichBody } from "@/components/insights/rich-body";
import { ShareRow } from "@/components/insights/share-row";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { allInsightSlugs, listInsights, withInsightBody } from "@/lib/content";
import { formatDate } from "@/lib/format";
import {
  adjacentInsights,
  getInsight,
  insightByline,
  insightHref,
  relatedInsights,
} from "@/lib/insights";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getTenant } from "@/lib/tenants";

type PageParams = { tenant: string; slug: string };

/**
 * One page per article, prerendered for the slugs that exist at build time.
 *
 * Unlike the rest of the site this segment allows params it did not generate:
 * an article published from the admin panel after the last deploy has to work
 * without a rebuild. The page still 404s on a slug that resolves to nothing,
 * so nothing unknown renders.
 */
export async function generateStaticParams() {
  const slugs = await allInsightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

/** Refreshed when the admin panel publishes; see the insights index. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { tenant: code, slug } = await params;
  const insights = await listInsights(getTenant(code).code);
  const insight = getInsight(slug, insights);

  if (!insight) return {};

  return pageMetadata({
    tenant: getTenant(code),
    path: insightHref(insight),
    title: insight.title,
    description: insight.excerpt,
    image: insight.image.src,
    type: "article",
    publishedTime: insight.date,
    authors: [insight.author ?? insightByline],
    regions: insight.regions,
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { tenant: code, slug } = await params;
  const insights = await listInsights(getTenant(code).code);
  const found = getInsight(slug, insights);

  if (!found) notFound();

  // The listing carries no bodies; this is the one read that fetches one.
  const insight = await withInsightBody(found);

  const { previous, next } = adjacentInsights(insight, insights);
  const related = relatedInsights(insight, 4, insights);

  const tenant = getTenant(code);
  const url = absoluteUrl(tenant, insightHref(insight));

  return (
    <>
      {/*
        Article structured data. What earns a headline, a date and an image in a
        search result rather than a bare blue link — and the breadcrumb that puts
        "Insights" above it instead of a bare URL.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "Article",
          headline: insight.title,
          description: insight.excerpt,
          image: [absoluteUrl(tenant, insight.image.src)],
          datePublished: insight.date,
          dateModified: insight.date,
          author: {
            "@type": insight.author ? "Person" : "Organization",
            name: insight.author ?? insightByline,
          },
          publisher: {
            "@type": "Organization",
            name: tenant.brandName ?? siteConfig.name,
            url: absoluteUrl(tenant, "/"),
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          articleSection: insight.category,
          inLanguage: "en",
        })}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Insights",
              item: absoluteUrl(tenant, "/insights"),
            },
            { "@type": "ListItem", position: 2, name: insight.title, item: url },
          ],
        })}
      />

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

            {/* Two body formats: rich text from the admin panel, or the block
                structure the built-in articles carry. Both render identically. */}
            <div className="mt-8">
              {insight.richBody ? (
                <RichBody doc={insight.richBody} />
              ) : (
                <InsightBody blocks={insight.body ?? []} />
              )}
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
          { label: "Talk to an Expert", href: "/#contact" },
          { label: "Watch Our Webinars", href: "/webinars", variant: "outline" },
        ]}
      />
    </>
  );
}
