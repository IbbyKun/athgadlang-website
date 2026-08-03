import type { Metadata } from "next";

import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { serviceImages } from "@/lib/images";
import { getServiceContent } from "@/lib/services";
import { getTenant } from "@/lib/tenants";

const PATH = "business-process-outsourcing";
const TITLE = "Business Process Outsourcing (BPO)";
const STANDFIRST =
  "Delegate the functions that do not define you — finance, support, back office — to a team that runs them to your standards.";

export const metadata: Metadata = {
  title: TITLE,
  description: getServiceContent(PATH)?.intro,
};

/** The closing rails show published articles and sessions; see the insights index. */
export const revalidate = 300;

/**
 * BPO has a top-level page rather than a nested one, because it is a practice
 * clients come looking for by name.
 *
 * No onward rail: it stands on its own rather than as part of Resourcing, so
 * the other resourcing services are not a natural next step from here.
 */
export default async function BusinessProcessOutsourcingPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const content = getServiceContent(PATH);

  return (
    <ServiceDetailPage
      eyebrow="Outsourcing"
      title={TITLE}
      description={STANDFIRST}
      image={content?.hero ?? serviceImages.resourcing}
      content={content}
      tenant={getTenant(tenant).code}
    />
  );
}
