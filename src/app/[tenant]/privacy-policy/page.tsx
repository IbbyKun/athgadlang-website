import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { privacyPolicy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: code } = await params;

  return pageMetadata({
    tenant: getTenant(code),
    path: "/privacy-policy",
    title: privacyPolicy.title,
    description: privacyPolicy.summary,
  });
}

export default function Page() {
  return <LegalPage document={privacyPolicy} />;
}
