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
  metaTitle: string;
  metaDescription: string;
  publishedAt: string;
  imageUrl: string;
  imageAlt: string;
  body: RichDoc | null;
  regions: TenantCode[];
  published: boolean;
};

export type EventFormValues = {
  id?: string;
  slug: string;
  title: string;
  kind: "webinar" | "seminar" | "networking";
  date: string;
  time: string;
  timezone: string;
  mode: "online" | "venue";
  venue: string;
  /** Empty means free. */
  price: string;
  access: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  registerUrl: string;
  recordingUrl: string;
  partner: string;
  serviceLine: string;
  body: RichDoc | null;
  /**
   * Presenters and running order, in the order they should appear. Both are
   * plain arrays of strings rather than the `EventSpeaker`/`EventAgendaItem`
   * types: a half-filled row is a normal state in a form and those types
   * require a name and a title, so the form holds drafts and the action drops
   * the blanks on the way to the database.
   */
  speakers: SpeakerDraft[];
  agenda: AgendaDraft[];
  regions: TenantCode[];
  published: boolean;
};

export type SpeakerDraft = { name: string; role: string; leader: string };
export type AgendaDraft = { time: string; title: string };

export const emptySpeaker: SpeakerDraft = { name: "", role: "", leader: "" };
export const emptyAgendaItem: AgendaDraft = { time: "", title: "" };

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

export type PopupFormValues = {
  id?: string;
  title: string;
  body: string;
  /**
   * What the popup is about. "none" is an announcement with no button, and is
   * why this is a choice rather than inferred from which field is filled in —
   * clearing a YouTube link should not silently turn the popup into something
   * else.
   */
  target: "none" | "video" | "event";
  youtubeId: string;
  eventSlug: string;
  ctaLabel: string;
  startsOn: string;
  endsOn: string;
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
