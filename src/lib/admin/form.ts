import type { RichDoc } from "@/lib/rich-text";
import { tenantCodes, type TenantCode } from "@/lib/tenants";

/**
 * Shapes and helpers shared between the admin forms and the server actions
 * behind them. Imported by client components, so nothing here may touch the
 * database or read a secret.
 */

/** What every admin form action returns, and what `useActionState` renders. */
export type FormState = {
  /** Set after a failed submit; shown at the top of the form. */
  message?: string;
  /** Field name -> message, for inline errors. */
  errors?: Record<string, string>;
  /** Set after a successful save that stays on the page. */
  saved?: boolean;
};

export const emptyFormState: FormState = {};

/**
 * Turns a title into a URL segment: lowercase, words joined by hyphens,
 * accents flattened, everything else dropped.
 *
 * Used to prefill the slug field as the title is typed, and again on the
 * server for anyone who clears it — the same function in both places, so what
 * the editor previews is what gets saved.
 */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    // Combining marks, left behind by the decomposition above.
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * What the forms are given to render.
 *
 * Deliberately not the database row type: that lives behind `server-only`, and
 * these are the props of a Client Component. The edit pages map one to the
 * other, which is also where a column rename would show up as a type error
 * rather than as a silently empty field.
 */
export type InsightFormValues = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  imageAlt: string;
  body: RichDoc | null;
  regions: TenantCode[];
  published: boolean;
};

export type WebinarFormValues = {
  id?: string;
  slug: string;
  title: string;
  publishedAt: string;
  duration: string;
  youtubeId: string;
  imageUrl: string;
  imageAlt: string;
  regions: TenantCode[];
  published: boolean;
};

/** Today as `yyyy-mm-dd`, for prefilling a date input. */
export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Keeps only recognised region codes, so a tampered form cannot widen reach. */
export function parseRegions(values: (string | File)[]): TenantCode[] {
  const codes = new Set(tenantCodes);

  return values.filter(
    (value): value is TenantCode =>
      typeof value === "string" && codes.has(value as TenantCode),
  );
}
