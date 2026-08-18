import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/admin/login/login-form";
import { hasSession, isAdminConfigured } from "@/lib/admin/session";
import { brand } from "@/lib/images";

/** Reads the session cookie, so it can never be prerendered. */
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await hasSession()) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
          <Image
            src={brand.logo.src}
            width={brand.logo.width}
            height={brand.logo.height}
            alt={brand.logo.alt}
            priority
            className="h-9 w-auto"
          />

          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-lg font-bold tracking-tight text-brand-navy">
              Content admin
            </h1>
            <p className="text-sm text-neutral-500">
              Sign in to publish insights and aG Studio sessions.
            </p>
          </div>

          {isAdminConfigured() ? (
            <LoginForm />
          ) : (
            <p className="rounded-lg bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
              The panel is not configured yet. Set{" "}
              <code className="font-mono text-xs">ADMIN_PASSWORD</code> and{" "}
              <code className="font-mono text-xs">ADMIN_SESSION_SECRET</code> in{" "}
              <code className="font-mono text-xs">.env.local</code>, then
              restart the dev server.
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          This password is shared. Anything published here goes live on the
          public site.
        </p>
      </div>
    </main>
  );
}
