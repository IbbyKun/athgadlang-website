import type { Metadata } from "next";

/**
 * The admin panel's own shell.
 *
 * It sits beside `[tenant]` rather than inside it, so it inherits the document
 * from the root layout but none of the site chrome — no header, no footer, no
 * region. It edits the content every region shares.
 */
export const metadata: Metadata = {
  title: "athGADLANG Admin",
  // Belt and braces alongside the session gate: a private URL should never
  // turn up in a search index even if it is briefly reachable.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `min-h-dvh`, not `min-h-full`: the body's own height is content-driven, so
  // a percentage minimum here would resolve to auto and the sign-in card would
  // sit against the top of a short grey box rather than centred in the page.
  return <div className="flex min-h-dvh flex-col bg-neutral-100">{children}</div>;
}
