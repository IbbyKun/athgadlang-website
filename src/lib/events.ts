import { eventImages } from "@/lib/images";
import type { InsightBlock } from "@/lib/insights";
import type { RichDoc } from "@/lib/rich-text";
import type { TenantCode } from "@/lib/tenants";

/**
 * Events — the sessions that have not happened yet.
 *
 * Distinct from webinars, which are recordings of sessions that already did:
 * an event has a date in the future, a place, people presenting, and something
 * to register for. Once it has been and gone it moves into the "previous"
 * shelf here rather than disappearing, because the write-up and the speaker
 * list are still worth reading.
 */

/** What the session is called — the label on its pill. */
export type EventKind = "webinar" | "seminar";

/** Whether you attend from your desk or travel to it. */
export type EventMode = "online" | "venue";

export type EventSpeaker = {
  name: string;
  role: string;
  /**
   * Leadership-team slug, where the speaker is on it. Gives the speaker their
   * photograph and a link to their profile; without it they get initials.
   */
  leader?: string;
};

/** One line of the running order. */
export type EventAgendaItem = {
  /** Clock time in the event's own timezone, e.g. "12:10". */
  time: string;
  title: string;
};

export type EventItem = {
  slug: string;
  title: string;
  kind: EventKind;
  /**
   * The day it runs, as an ISO date. Deliberately a date and not a timestamp:
   * the site never needs to convert an event into the reader's timezone, and a
   * date compares cleanly against today to decide whether it has passed.
   */
  date: string;
  /**
   * The clock time as it should be shown, e.g. "12:00 – 13:00". A string
   * rather than a pair of timestamps, because that is exactly what an
   * invitation states and it cannot drift when rendered.
   */
  time: string;
  /** The timezone that time is stated in, e.g. "GST (UTC+4)". */
  timezone: string;
  /**
   * How you attend. Kept separate from `kind` so the two can disagree — an
   * online seminar or a webinar recorded in front of a room are both things
   * that happen, and collapsing them would make one of them unrepresentable.
   */
  mode: EventMode;
  /** Where it is held. Expected whenever `mode` is "venue", ignored otherwise. */
  venue?: string;
  /**
   * What it costs. Absent means free — there is no separate "is it paid" flag,
   * because a paid event with no price and a free event would then be the same
   * row with different booleans.
   */
  price?: string;
  /**
   * Who may attend, e.g. "Open to all — registration required". Optional: the
   * cost and the registration link already answer most of it, so an event that
   * has nothing to add simply omits the line.
   */
  access?: string;
  excerpt: string;
  image: { src: string; alt: string };
  /**
   * Where registration happens. Absent means registration is not open yet,
   * and the page says so rather than offering a dead button.
   */
  registerUrl?: string;
  /**
   * Where a past session's recording lives, once there is one. A past event
   * without it simply has nothing to watch.
   */
  recordingUrl?: string;
  speakers: EventSpeaker[];
  agenda?: EventAgendaItem[];
  /**
   * The write-up, as a block structure. Uses the same model as the articles —
   * see `InsightBlock` — so <InsightBody> renders it and the prose matches the
   * rest of the site without a second renderer to keep in step.
   */
  body?: InsightBlock[];
  /**
   * The write-up as rich text, which is what the admin editor produces. Takes
   * precedence over `body` when both are present.
   */
  richBody?: RichDoc;
  /** Regions this appears on. Absent means every region. */
  regions?: TenantCode[];
  /** True for events loaded from the database, for the admin's benefit. */
  managed?: boolean;
};

/**
 * Test content.
 *
 * Written to exercise the layouts — both kinds, both online and in person,
 * upcoming and past, with and without a registration link or a recording.
 * The copy is deliberately free of thresholds, rates and deadlines: none of it
 * has been through technical review, and every figure a reader could act on
 * must come from the practice before this goes live.
 *
 * Replace with real sessions, or move to the admin panel alongside insights
 * and webinars when events need to be published without a deploy.
 */
export const events: EventItem[] = [
  {
    slug: "uae-corporate-tax-year-two",
    title: "UAE Corporate Tax, Year Two: What Changes and What Bites",
    kind: "webinar",
    date: "2026-09-10",
    time: "12:00 – 13:00",
    timezone: "GST (UTC+4)",
    mode: "online",
    access: "Open to all — registration required",
    excerpt:
      "The first filing cycle is behind us. We walk through what tripped businesses up, what is different this year, and the housekeeping worth doing now rather than in the last fortnight.",
    image: eventImages["uae-corporate-tax-year-two"],
    registerUrl: "#",
    speakers: [
      {
        name: "Abdullah Taimoor",
        role: "Partner — Tax",
        leader: "abdullah-taimoor",
      },
      { name: "Usman Hussain Khan", role: "Manager — Audit" },
    ],
    agenda: [
      { time: "12:00", title: "Where the first cycle went wrong" },
      { time: "12:15", title: "What is different in year two" },
      { time: "12:35", title: "Housekeeping to do now" },
      { time: "12:50", title: "Questions" },
    ],
    body: [
      {
        type: "paragraph",
        text: "One full filing cycle has now been through the system, and the pattern of what goes wrong is clear enough to plan around. Most of it is not technical: it is records that were never reconciled, positions that were taken without being documented, and deadlines that were discovered rather than diarised.",
      },
      { type: "heading", text: "What we will cover" },
      {
        type: "list",
        items: [
          "The registration and filing errors that came up most often",
          "Where documentation was asked for and could not be produced",
          "How group structures changed the answer",
          "A short list of things worth fixing before the next cycle opens",
        ],
      },
      { type: "heading", text: "Who it is for" },
      {
        type: "paragraph",
        text: "Finance leads, controllers and anyone who owns the filing calendar. We assume you have been through one cycle already; this is not an introduction to the regime.",
      },
    ],
  },
  {
    slug: "ksa-e-invoicing-wave-briefing",
    title: "KSA E-Invoicing: Briefing for the Next Integration Wave",
    kind: "seminar",
    date: "2026-09-24",
    time: "09:30 – 12:30",
    timezone: "AST (UTC+3)",
    mode: "venue",
    venue: "Wathiq offices, Riyadh",
    access: "In person — limited seats, registration required",
    excerpt:
      "A working session for finance and IT teams inside the next integration wave. Bring your invoice samples and your ERP questions; we go through readiness line by line.",
    image: eventImages["ksa-e-invoicing-wave-briefing"],
    registerUrl: "#",
    speakers: [
      { name: "Abdul Aziz Lang", role: "Partner", leader: "abdul-aziz-lang" },
      { name: "Saqib Nisar", role: "Director", leader: "saqib-nisar" },
    ],
    agenda: [
      { time: "09:30", title: "Arrival and coffee" },
      { time: "10:00", title: "What integration actually requires" },
      { time: "10:45", title: "Working through your own invoice samples" },
      { time: "11:45", title: "ERP and middleware questions" },
      { time: "12:15", title: "Readiness checklist and next steps" },
    ],
    body: [
      {
        type: "paragraph",
        text: "Integration is the point at which e-invoicing stops being a finance project and becomes a systems one. Teams that treat it as a compliance form to complete tend to discover the technical work late, with a fixed date already set.",
      },
      { type: "heading", text: "How the morning runs" },
      {
        type: "paragraph",
        text: "This is a working session rather than a presentation. The middle of the morning is spent on your own invoice samples, so bring them — along with whoever owns your ERP.",
      },
      { type: "heading", text: "What to bring" },
      {
        type: "list",
        items: [
          "Sample invoices covering your most awkward transaction types",
          "Your current invoicing and ERP setup, in outline",
          "The date your wave is expected to begin",
        ],
      },
    ],
  },
  {
    slug: "transfer-pricing-clinic-dubai",
    title: "Transfer Pricing Clinic: Documentation That Holds Up",
    kind: "seminar",
    date: "2026-10-08",
    time: "14:00 – 17:00",
    timezone: "GST (UTC+4)",
    mode: "venue",
    venue: "athGADLANG offices, Dubai",
    price: "AED 750 per attendee",
    access: "In person — by invitation, registration required",
    excerpt:
      "An afternoon on intercompany documentation: what a file needs to contain, where benchmarking gets challenged, and how to write a position you can still defend in three years.",
    image: eventImages["transfer-pricing-clinic-dubai"],
    speakers: [
      {
        name: "Abdullah Taimoor",
        role: "Partner — Tax",
        leader: "abdullah-taimoor",
      },
      { name: "Arslan Mushtaq", role: "Partner", leader: "arslan-mushtaq" },
    ],
    body: [
      {
        type: "paragraph",
        text: "Documentation is judged years after it is written, by somebody who was not in the room. That is the standard this clinic works to: not whether a file exists, but whether it still explains itself once everyone who prepared it has moved on.",
      },
      { type: "heading", text: "What we work through" },
      {
        type: "list",
        items: [
          "The structure of a file that answers questions before they are asked",
          "Where a benchmarking study gets picked apart",
          "Intercompany services, financing and IP — the recurring arguments",
          "Writing a position that survives a change of personnel",
        ],
      },
      {
        type: "paragraph",
        text: "Registration is not yet open. If you would like a place, speak to your usual contact and we will hold one.",
      },
    ],
  },
  {
    slug: "ifrs-18-presentation-and-disclosure",
    title: "IFRS 18: What Actually Changes in Your Statements",
    kind: "webinar",
    date: "2026-10-22",
    time: "12:00 – 13:00",
    timezone: "GST (UTC+4)",
    mode: "online",
    access: "Open to all — registration required",
    excerpt:
      "Presentation and disclosure, not recognition and measurement. We show a before-and-after set of statements so you can see where the work lands.",
    image: eventImages["ifrs-18-presentation-and-disclosure"],
    registerUrl: "#",
    speakers: [
      {
        name: "Usman Alam",
        role: "Partner — Assurance & Compliance",
        leader: "usman-alam",
      },
      { name: "Ammar Kaghdi", role: "Associate Director — Audit" },
    ],
    agenda: [
      { time: "12:00", title: "What the standard is and is not about" },
      { time: "12:20", title: "A set of statements, before and after" },
      { time: "12:45", title: "Where the preparation effort actually goes" },
    ],
    body: [
      {
        type: "paragraph",
        text: "This is a presentation and disclosure standard. Nothing about how you recognise or measure a transaction changes — but where it appears, and what has to be explained alongside it, does.",
      },
      { type: "heading", text: "Why a worked example" },
      {
        type: "paragraph",
        text: "Reading the standard tells you the requirements; seeing two versions of the same statements tells you how much work you are actually signing up for. We spend most of the hour on the latter.",
      },
    ],
  },
  {
    slug: "year-end-close-readiness",
    title: "Year-End Close: A Readiness Session for Finance Teams",
    kind: "webinar",
    date: "2026-11-05",
    time: "11:00 – 12:00",
    timezone: "GST (UTC+4)",
    mode: "online",
    access: "Open to all — registration required",
    excerpt:
      "The reconciliations, accruals and confirmations that decide whether close takes a fortnight or a month. Run through in the order an auditor will ask for them.",
    image: eventImages["year-end-close-readiness"],
    registerUrl: "#",
    speakers: [
      {
        name: "Yasir Gadit",
        role: "Partner",
        leader: "yasir-gadit",
      },
    ],
    body: [
      {
        type: "paragraph",
        text: "Close is rarely slow because of one hard problem. It is slow because a dozen small things were left until the audit asked for them, and each one has to be chased through somebody else's inbox.",
      },
      { type: "heading", text: "The order that saves time" },
      {
        type: "list",
        items: [
          "Reconciliations that must be clean before anything else can start",
          "Accruals and provisions, and the evidence each one needs",
          "Third-party confirmations, and when to send them",
          "The schedule an auditor asks for first",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- past ---
  {
    slug: "dubai-it-before-the-deadline",
    title:
      "Dubai It, Before the Deadline: Stop Surviving Tax & Audit Season, Start Owning It",
    kind: "webinar",
    date: "2026-07-28",
    time: "12:00 – 13:00",
    timezone: "GST (UTC+4)",
    mode: "online",
    access: "Anyone could view and join",
    excerpt:
      "Tax and audit season is changing. What tripped up businesses in year one, what is new for 2026, and how to get audit-ready before the deadlines hit.",
    image: eventImages["dubai-it-before-the-deadline"],
    recordingUrl: "#",
    speakers: [
      { name: "Usman Hussain Khan", role: "Manager — Audit" },
      { name: "Ammar Kaghdi", role: "Associate Director — Audit" },
      {
        name: "Usman Alam",
        role: "Partner — Assurance & Compliance",
        leader: "usman-alam",
      },
      { name: "Haziq Neshat Akhtar", role: "Director", leader: "haziq-neshat-akhtar" },
    ],
    body: [
      {
        type: "paragraph",
        text: "Tax and audit season has stopped being a fixed annual routine. The obligations moved, the evidence expected alongside them moved, and the businesses that struggled were mostly the ones running last year's checklist.",
      },
      { type: "heading", text: "What the session covered" },
      {
        type: "list",
        items: [
          "The errors that came up most often in the first cycle",
          "What changed for 2026",
          "Getting audit-ready before the deadline rather than during it",
        ],
      },
    ],
  },
  {
    slug: "bahrain-vat-refresher",
    title: "Bahrain VAT: A Refresher on the Returns That Get Queried",
    kind: "webinar",
    date: "2026-06-24",
    time: "12:00 – 13:00",
    timezone: "AST (UTC+3)",
    mode: "online",
    access: "Anyone could view and join",
    excerpt:
      "Where Bahrain VAT returns most often attract a question, and the record-keeping that answers it before it is asked.",
    image: eventImages["bahrain-vat-refresher"],
    recordingUrl: "#",
    speakers: [
      { name: "Arshad Gadit", role: "Partner & Global CEO", leader: "arshad-gadit" },
    ],
    body: [
      {
        type: "paragraph",
        text: "A queried return is rarely a wrong return. It is usually a return that cannot be evidenced quickly, which is a different problem with the same cost in time.",
      },
      { type: "heading", text: "What the session covered" },
      {
        type: "paragraph",
        text: "The recurring query patterns, the documents that resolve each one, and a short monthly routine that keeps the file current rather than reconstructed.",
      },
    ],
  },
  {
    slug: "free-zone-substance-workshop",
    title: "Free Zone Substance: A Working Session on Evidence",
    kind: "seminar",
    date: "2026-05-20",
    time: "14:00 – 17:00",
    timezone: "GST (UTC+4)",
    mode: "venue",
    venue: "athGADLANG offices, Dubai",
    access: "In person — invitation only",
    excerpt:
      "An afternoon spent on what substance looks like on paper: the decisions, the people and the records that demonstrate a free zone entity is where it says it is.",
    image: eventImages["free-zone-substance-workshop"],
    speakers: [
      { name: "Arslan Mushtaq", role: "Partner", leader: "arslan-mushtaq" },
      { name: "Osman Babar", role: "Director", leader: "osman-babar" },
    ],
    body: [
      {
        type: "paragraph",
        text: "Substance is a documentation problem long before it is a structuring one. An entity either has records showing where its decisions are taken and by whom, or it does not — and the second case is difficult to fix retrospectively.",
      },
      { type: "heading", text: "What the session covered" },
      {
        type: "list",
        items: [
          "What the records need to show, and who has to be able to produce them",
          "Board and management decisions, and how they are evidenced",
          "The gaps that surface during a review",
        ],
      },
    ],
  },
  {
    slug: "payroll-and-wps-clinic",
    title: "Payroll and WPS: A Clinic on the Monthly Routine",
    kind: "seminar",
    date: "2026-04-15",
    time: "10:00 – 13:00",
    timezone: "GST (UTC+4)",
    mode: "venue",
    venue: "athGADLANG offices, Dubai",
    access: "In person — invitation only",
    excerpt:
      "A morning on the payroll routine: reconciling the register to the employee master, accruing end-of-service as you go, and keeping the salary file accepted first time.",
    image: eventImages["payroll-and-wps-clinic"],
    speakers: [
      {
        name: "Khushboo Mushtaq",
        role: "Director",
        leader: "khushboo-mushtaq",
      },
      { name: "Sikandar Gadit", role: "Director", leader: "sikandar-gadit" },
    ],
    body: [
      {
        type: "paragraph",
        text: "Payroll is the most regular obligation a business has, and regularity is exactly why it drifts. Most rejected salary files trace back to a mismatch between what was submitted and what was registered.",
      },
      { type: "heading", text: "What the session covered" },
      {
        type: "paragraph",
        text: "A monthly checklist, run against a real register, with the reconciliations that keep the payroll master and the employment records in step.",
      },
    ],
  },
];

/** Human label for a kind. */
export const eventKindLabel: Record<EventKind, string> = {
  webinar: "Live webinar",
  seminar: "In-person seminar",
};

/** Short label, for a card pill where there is no room for the long one. */
export const eventKindShortLabel: Record<EventKind, string> = {
  webinar: "Webinar",
  seminar: "Seminar",
};

/** Human label for a mode, for the admin form. */
export const eventModeLabel: Record<EventMode, string> = {
  online: "Online",
  venue: "At a venue",
};

export function eventHref(event: EventItem) {
  return `/events/${event.slug}`;
}

/** Every built-in event slug. */
export const eventSlugs = events.map((event) => event.slug);

/**
 * Where it happens, as one line.
 *
 * Derived rather than stored, so an event cannot end up saying "Online" while
 * carrying a venue. A venue event that has not named its room yet says so
 * instead of showing an empty row.
 */
export function eventLocation(event: EventItem) {
  if (event.mode === "online") return "Online";
  return event.venue || "Venue to be confirmed";
}

/** What it costs, as one line. */
export function eventPrice(event: EventItem) {
  return event.price?.trim() || "Free to attend";
}

/**
 * The helpers below take the list to work against, because the list a page
 * renders is the built-in events merged with the region's published rows from
 * the database. Callers on the public site pass the merged list from
 * `src/lib/content.ts`; the default keeps the built-in events usable alone.
 */

/** The event for a URL segment, or undefined so the route can 404. */
export function getEvent(slug: string, list: EventItem[] = events) {
  return list.find((event) => event.slug === slug);
}

/**
 * True while the date has not passed.
 *
 * Compared as ISO date strings, which sort correctly and sidestep timezone
 * arithmetic entirely. Inclusive of today: an event running this afternoon is
 * still upcoming this morning, and nothing here knows the time of day.
 *
 * Takes a bare date as well as an event, because the admin list works from
 * database rows rather than mapped events.
 */
export function isUpcomingDate(date: string, today = todayIso()) {
  return date >= today;
}

/** True while the event has not finished. */
export function isUpcoming(event: EventItem, today = todayIso()) {
  return isUpcomingDate(event.date, today);
}

/** Today as `yyyy-mm-dd` in UTC, matching how event dates are written. */
export function todayIso(now: Date = new Date()) {
  return now.toISOString().slice(0, 10);
}

/**
 * A list split into the two shelves the pages show.
 *
 * Upcoming runs soonest-first — the next thing you could attend is the most
 * useful — while past runs most-recent-first, like every other archive on the
 * site. `featured` is the next one up, which the pages give a larger card.
 */
export function splitEvents(list: EventItem[] = events, today = todayIso()) {
  const upcoming = list
    .filter((event) => isUpcoming(event, today))
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = list
    .filter((event) => !isUpcoming(event, today))
    .sort((a, b) => b.date.localeCompare(a.date));

  const [featured, ...rest] = upcoming;

  return { upcoming, past, featured, rest };
}

/**
 * Other events worth showing at the foot of one — the next few upcoming,
 * topped up with recent past ones so the rail is never nearly empty.
 */
export function otherEvents(
  event: EventItem,
  list: EventItem[] = events,
  limit = 3,
) {
  const { upcoming, past } = splitEvents(list);

  return [...upcoming, ...past]
    .filter((item) => item.slug !== event.slug)
    .slice(0, limit);
}
