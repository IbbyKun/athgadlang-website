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
    title: "aG Studio",
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
        eyebrow="aG Studio"
        title="Conversations Worth Your While"
        /* As supplied, with the doubled full stop after "whenever you are"
           closed up to one. */
        description="aG Studio brings athGADLANG's expertise to screen: webinars on the regulations, trends, and decisions that are practical, straight to the point, and available whenever you are. Watch on your own time, at your own pace, whenever you need clarity."
        image={images.hero.webinars}
        fullScreen={false}
      />

      <Section containerSize="wide" className="bg-neutral-50">
        <div className="flex flex-col gap-10">
          <SectionHeading
            title="Latest Webinars"
            description="Recorded sessions with our specialists"
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

      {/* One action, deliberately. This band carried a second, outline button
          to the insights index; the single call to action is the intended
          shape. */}
      <CtaBand
        title="Have a Question About Our Webinars?"
        description="Whether you'd like more detail on a topic we've covered or want to suggest one for a future session, our people are ready to help."
        actions={[{ label: "Get in Touch", href: "/#contact" }]}
      />
    </>
  );
}
