import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { serviceImages } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { getServiceContent } from "@/lib/services";
import { getTenant } from "@/lib/tenants";

const PATH = "remote-workforce-solutions";
const TITLE = "Remote Workforce Solutions";
const STANDFIRST =
  "Dedicated remote professionals on a secondment model, you direct the work, we carry the payroll, admin and infrastructure.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const tenant = getTenant((await params).tenant);

  return pageMetadata({
    tenant,
    path: `/services/${PATH}`,
    title: TITLE,
    description: getServiceContent(PATH, tenant.code)?.intro ?? STANDFIRST,
  });
}

/** The closing rails show published articles and sessions; see the insights index. */
export const revalidate = 86400;

/** A top-level page, like the other aG Resources offers. */
export default async function RemoteWorkforceSolutionsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const tenant = getTenant((await params).tenant);
  const content = getServiceContent(PATH, tenant.code);

  return (
    <ServiceDetailPage
      eyebrow="Resourcing"
      title={TITLE}
      description={STANDFIRST}
      image={content?.hero ?? serviceImages.resourcing}
      content={content}
      tenant={tenant.code}
    />
  );
}
