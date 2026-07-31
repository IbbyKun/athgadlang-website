import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { InsightCard } from "@/components/cards/insight-card";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { WebinarCard } from "@/components/cards/webinar-card";
import { AwardBand } from "@/components/sections/award-band";
import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { CapabilityPanel } from "@/components/services/capability-panel";
import { FaqSection } from "@/components/services/faq-section";
import { KeyTeam, ServiceLeaders } from "@/components/services/service-leaders";
import { ServiceList } from "@/components/services/service-list";
import { StatBand } from "@/components/services/stat-band";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { insights } from "@/lib/insights";
import { getLeaders } from "@/lib/leaders";
import { type ServiceContent } from "@/lib/services";
import { type NavItem } from "@/lib/site-config";
import { getTestimonials } from "@/lib/testimonials";
import { webinars } from "@/lib/webinars";

/** A block of onward links, e.g. the services inside a practice area. */
export type RelatedBlock = {
  heading: string;
  services: NavItem[];
  /** Cards for a primary list; chips for a secondary cross-link rail. */
  layout: "cards" | "chips";
};

type ServiceDetailPageProps = {
  eyebrow: string;
  title: string;
  /** Hero standfirst, and the fallback introduction. */
  description?: string;
  image: { src: string; alt: string };
  /** Signed-off copy for this page. Sections it omits are not rendered. */
  content?: ServiceContent;
  related?: RelatedBlock[];
};

/**
 * The shared services page: hero, introduction with an index of what is
 * covered, alternating capability panels, the partners behind the work, onward
 * links, then insights, webinars and the contact section.
 *
 * Used by both the practice-area page and an individual service page — the two
 * differ only in their copy and their onward links, so they share one layout
 * rather than drifting apart.
 */
export function ServiceDetailPage({
  eyebrow,
  title,
  description,
  image,
  content,
  related = [],
}: ServiceDetailPageProps) {
  const capabilities = content?.capabilities ?? [];
  const leaders = getLeaders(content?.leaders ?? []);
  const keyTeam = content?.keyTeam ?? [];
  const articles = relatedArticles(content?.insightCategories);
  const sessions = relatedWebinars(content?.webinarSlugs);

  const relatedBlocks = related.filter((block) => block.services.length > 0);
  const hasPeople = leaders.length > 0 || keyTeam.length > 0;
  const quotes = getTestimonials(content?.testimonials ?? []);
  const faqs = content?.faqs ?? [];
  const stats = content?.stats;

  /**
   * Grounds alternate in render order rather than being fixed per section:
   * sections here are conditional, and hard-coding them leaves two greys
   * touching whenever one drops out. The introduction above is white, so the
   * run below starts grey.
   */
  const order = [
    ...(stats ? ["stats"] : []),
    "insights",
    "webinars",
    ...(quotes.length > 0 ? ["testimonials"] : []),
    ...(hasPeople ? ["people"] : []),
    ...relatedBlocks.map((block) => `related:${block.heading}`),
    ...(faqs.length > 0 ? ["faqs"] : []),
  ];
  const ground = (key: string) =>
    order.indexOf(key) % 2 === 0 ? "bg-neutral-50" : "bg-white";

  return (
    <>
      <Hero
        eyebrow={eyebrow}
        title={title}
        description={description}
        image={image}
        fullScreen={false}
        actions={[{ label: "Talk to an Expert", href: "/contact" }]}
      />

      <Section containerSize="wide" className="bg-white">
        {/* Copy on the left, an at-a-glance index of the panels on the right. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeading
              align="left"
              title={content?.heading ?? `${title} Services`}
            />
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
                {content?.intro ?? description}
              </p>
              {content?.introMore && (
                <p className="text-pretty text-base leading-relaxed text-neutral-600">
                  {content.introMore}
                </p>
              )}
            </div>
          </div>

          {capabilities.length > 0 && (
            <nav
              aria-label="What's included"
              className="rounded-2xl bg-neutral-50 p-6 ring-1 ring-neutral-200"
            >
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                What&rsquo;s included
              </h3>
              <ul className="mt-4 flex flex-col divide-y divide-neutral-200">
                {capabilities.map((capability) => (
                  <li key={capability.slug}>
                    <a
                      href={`#${capability.slug}`}
                      className="group flex items-center justify-between gap-3 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {capability.title}
                      <ChevronRight
                        aria-hidden
                        className="size-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Section>

      {/* Full-bleed: these panels own the page width. */}
      {capabilities.map((capability, index) => (
        <CapabilityPanel
          key={capability.slug}
          capability={capability}
          index={index}
        />
      ))}

      {content?.award && <AwardBand award={content.award} />}

      {stats && (
        <Section containerSize="wide" className={ground("stats")}>
          <StatBand
            title={stats.title}
            description={stats.description}
            items={stats.items}
          />
        </Section>
      )}

      <Section containerSize="wide" className={ground("insights")}>
        <div className="flex flex-col gap-10">
          <SectionHeading
            align="left"
            title="What We Think"
            description="Analysis from the team on the changes that affect this work."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article) => (
              <InsightCard key={article.slug} insight={article} layout="grid" />
            ))}
          </div>

          <div className="flex justify-center">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/insights">
                All Insights
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section containerSize="wide" className={ground("webinars")}>
        <div className="flex flex-col gap-10">
          <SectionHeading
            align="left"
            title="Webinars"
            description="Recorded sessions on the same subjects, presented by our specialists."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sessions.map((webinar) => (
              <WebinarCard key={webinar.slug} webinar={webinar} />
            ))}
          </div>

          <div className="flex justify-center">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/webinars">
                All Webinars
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {quotes.length > 0 && (
        <Section containerSize="wide" className={ground("testimonials")}>
          <div className="flex flex-col gap-10">
            <SectionHeading
              align="left"
              title="What Our Clients Say"
              description="Named clients, in their own words."
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {quotes.map((quote) => (
                <TestimonialCard key={quote.id} testimonial={quote} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {hasPeople && (
        <Section containerSize="wide" className={ground("people")}>
          <div className="flex flex-col gap-12">
            {leaders.length > 0 && (
              <div className="flex flex-col gap-8">
                <SectionHeading
                  align="left"
                  title="Led By"
                  description="The partners accountable for this work — open a card to read their background."
                />
                <ServiceLeaders leaders={leaders} />
              </div>
            )}

            {keyTeam.length > 0 && (
              <div className="flex flex-col gap-6">
                <RuledHeading>Key Team Members</RuledHeading>
                <KeyTeam names={keyTeam} />
              </div>
            )}
          </div>
        </Section>
      )}

      {relatedBlocks.map((block) => (
        <Section
          key={block.heading}
          containerSize="wide"
          className={ground(`related:${block.heading}`)}
        >
          <div className="flex flex-col gap-6">
            <RuledHeading>{block.heading}</RuledHeading>

            {block.layout === "cards" ? (
              <ServiceList services={block.services} />
            ) : (
              <ul className="flex flex-wrap gap-3">
                {block.services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      // neutral-100, so the chip reads on a white ground and a
                      // grey one alike — the run of grounds alternates.
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-brand-navy ring-1 ring-neutral-200 transition-colors hover:bg-brand hover:text-white hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {service.label}
                      <ChevronRight aria-hidden className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      ))}

      {faqs.length > 0 && (
        <Section containerSize="wide" className={ground("faqs")}>
          <FaqSection faqs={faqs} />
        </Section>
      )}

      <ContactSection
        title="Let's Connect"
        description="Tell us where you are with this and we will tell you what we would do next — no obligation, and no generic proposal."
      />
    </>
  );
}

/** Section title with the brand rule, one step down from <SectionHeading>. */
function RuledHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-4 text-2xl font-bold tracking-tight text-brand-navy">
      <span aria-hidden className="h-0.5 w-7 bg-brand" />
      {children}
    </h2>
  );
}

/**
 * Articles in the categories this page names, most recent first, topped up
 * with the latest articles when the categories alone cannot fill the row.
 */
function relatedArticles(categories?: string[]) {
  if (!categories?.length) return insights.slice(0, 4);

  const matching = insights.filter((insight) =>
    categories.includes(insight.category),
  );
  const topUp = insights.filter((insight) => !matching.includes(insight));

  return [...matching, ...topUp].slice(0, 4);
}

/**
 * The sessions a page names, in the order it names them, topped up with the
 * latest so the row is always full. Without a list, the latest four.
 */
function relatedWebinars(slugs?: string[]) {
  if (!slugs?.length) return webinars.slice(0, 4);

  const named = slugs
    .map((slug) => webinars.find((webinar) => webinar.slug === slug))
    .filter((webinar): webinar is (typeof webinars)[number] => Boolean(webinar));
  const topUp = webinars.filter((webinar) => !named.includes(webinar));

  return [...named, ...topUp].slice(0, 4);
}
