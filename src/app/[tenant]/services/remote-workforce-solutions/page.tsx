import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { serviceImages } from "@/lib/images";
import { getServiceContent } from "@/lib/services";
import { getTenant } from "@/lib/tenants";

const PATH = "remote-workforce-solutions";
const TITLE = "Remote Workforce Solutions";
const STANDFIRST =
  "Dedicated remote professionals on a secondment model — you direct the work, we carry the payroll, admin and infrastructure.";

export const metadata: Metadata = {
  title: TITLE,
  description: getServiceContent(PATH)?.intro,
};

/** The closing rails show published articles and sessions; see the insights index. */
export const revalidate = 300;

/** A top-level page, like the other aG Resources offers. */
export default async function RemoteWorkforceSolutionsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const content = getServiceContent(PATH);

  return (
    <ServiceDetailPage
      eyebrow="Resourcing"
      title={TITLE}
      description={STANDFIRST}
      image={content?.hero ?? serviceImages.resourcing}
      content={content}
      tenant={getTenant(tenant).code}
    />
  );
}
