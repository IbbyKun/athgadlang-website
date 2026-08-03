import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { hasSession } from "@/lib/admin/session";
import { brand } from "@/lib/images";

/**
 * Everything behind the sign-in.
 *
 * The gate is here rather than in the proxy so it can use the session helpers
 * directly, and because a rewrite-time redirect would have to duplicate them.
 * It is not the only gate: each Server Action re-checks the session, since an
 * action can be POSTed without ever rendering this layout.
 */
export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await hasSession())) redirect("/admin/login");

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="shrink-0">
            <Image
              src={brand.logo.src}
              width={brand.logo.width}
              height={brand.logo.height}
              alt={`${brand.logo.alt} admin`}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <span
            aria-hidden
            className="hidden h-5 w-px shrink-0 bg-neutral-200 sm:block"
          />

          <AdminNav />

          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <a href="/" target="_blank" rel="noreferrer">
                <span className="hidden sm:inline">View site</span>
                <ExternalLink aria-hidden />
              </a>
            </Button>

            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                <span className="hidden sm:inline">Sign out</span>
                <LogOut aria-hidden />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
