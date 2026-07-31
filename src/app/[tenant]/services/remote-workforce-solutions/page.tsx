import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { serviceImages } from "@/lib/images";
import { getServiceContent } from "@/lib/services";

const PATH = "remote-workforce-solutions";
const TITLE = "Remote Workforce Solutions";
const STANDFIRST =
  "Dedicated remote professionals on a secondment model — you direct the work, we carry the payroll, admin and infrastructure.";

export const metadata: Metadata = {
  title: TITLE,
  description: getServiceContent(PATH)?.intro,
};

/** A top-level page, like the other aG Resources offers. */
export default function RemoteWorkforceSolutionsPage() {
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
