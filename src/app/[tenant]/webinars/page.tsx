import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { WebinarGrid } from "@/components/webinars/webinar-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { listWebinars } from "@/lib/content";
import { images } from "@/lib/images";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenants";
import { youtubeThumbnail, youtubeWatchUrl } from "@/lib/youtube";

/**
 * Per region, so each host names itself as canonical and the other four as
 * regional alternates — see src/lib/seo.ts for why that matters on a site
 * served from five domains.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: code } = await params;

  return pageMetadata({
    tenant: getTenant(code),
    path: "/webinars",
    title: "Webinars",
    description:
      "On-demand sessions on tax, audit, compliance and business setup, hosted by the athGADLANG specialists who advise on them day to day.",
    image: images.hero.webinars.src,
  });
}

/** Refreshed when the admin panel publishes; see the insights index. */
export const revalidate = 86400;

/**
 * The webinar library. Deliberately the same page as the insights index —
 * image hero, ruled heading, paged card grid, navy closing band — so the two
 * resource sections read as one library with two shelves.
 */
export default async function WebinarsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: code } = await params;
  const tenant = getTenant(code);
  const pageSize = 8;
  const webinars = await listWebinars(tenant.code);

  // Narrowed rather than asserted, so the id below is known to exist.
  const playable = webinars.flatMap((webinar) =>
    webinar.youtubeId ? [{ ...webinar, youtubeId: webinar.youtubeId }] : [],
  );

  return (
    <>
      {/*
        One VideoObject per recording. Recordings play in a dialog rather than at
        an address of their own, so without this a crawler sees a page of images
        and no video at all — this is what makes them eligible for video results,
        and it names the listing as where each one plays.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@type": "ItemList",
          name: "athGADLANG webinars",
          itemListElement: playable.map((webinar, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "VideoObject",
              name: webinar.title,
              description: webinar.title,
              uploadDate: webinar.date,
              thumbnailUrl: [youtubeThumbnail(webinar.youtubeId, "max")],
              embedUrl: `https://www.youtube-nocookie.com/embed/${webinar.youtubeId}`,
              contentUrl: youtubeWatchUrl(webinar.youtubeId),
              url: absoluteUrl(tenant, "/webinars"),
            },
          })),
        })}
      />

      <Hero
        eyebrow="Webinars"
        title="Sit in on the sessions our clients ask for."
        description="Recorded walkthroughs of the changes that affect how you file, report and operate, presented by the people who do the work."
        image={images.hero.webinars}
        fullScreen={false}
      />

      <Section containerSize="wide" className="bg-neutral-50">
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="On-Demand Sessions"
            description="Watch at your own pace, from our most recent session back."
          />

          {/* Only the first page is sent; the rest is fetched when asked for. */}
          <WebinarGrid
            items={webinars.slice(0, pageSize)}
            total={webinars.length}
            region={tenant.code}
            pageSize={pageSize}
          />
        </div>
      </Section>

      <CtaBand
        title="Want this covered for your team?"
        description="We run the same sessions privately, shaped around your industry, your systems and the questions your finance team is actually asking."
        actions={[
          { label: "Request a Session", href: "/#contact" },
          { label: "Read Our Insights", href: "/insights", variant: "outline" },
        ]}
      />
    </>
  );
}
