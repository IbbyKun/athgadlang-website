import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { serviceImages } from "@/lib/images";
import { getServiceContent } from "@/lib/services";

const PATH = "talent-acquisition";
const TITLE = "Talent Acquisition";
const STANDFIRST =
  "Your offsite recruitment partner — from junior hires to the C-suite, sourced and screened against how your business actually works.";

export const metadata: Metadata = {
  title: TITLE,
  description: getServiceContent(PATH)?.intro,
};

/** A top-level page, like the other aG Resources offers. */
export default function TalentAcquisitionPage() {
  const content = getServiceContent(PATH);

  return (
    <ServiceDetailPage
      eyebrow="Resourcing"
      title={TITLE}
      description={STANDFIRST}
      image={content?.hero ?? serviceImages.resourcing}
      content={content}
    />
  );
}
