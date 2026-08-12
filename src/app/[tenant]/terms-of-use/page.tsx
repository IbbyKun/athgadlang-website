import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { termsOfUse } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { getTenant } from "@/lib/tenants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const tenant = getTenant((await params).tenant);
  const document = termsOfUse(tenant.code);

  return pageMetadata({
    tenant,
    path: "/terms-of-use",
    title: document.title,
    description: document.summary,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const tenant = getTenant((await params).tenant);

  return <LegalPage document={termsOfUse(tenant.code)} />;
}
