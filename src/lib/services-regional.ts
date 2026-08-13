import { type ServiceContent } from "@/lib/services";
import { type TenantCode } from "@/lib/tenants";

/**
 * Region-specific service copy.
 *
 * The base copy in `services.ts` was written for the UAE, and a good deal of it
 * is UAE-specific in substance rather than in wording: Corporate Tax at 9%, the
 * Federal Tax Authority, free zone qualifying status, the Golden Visa, mainland
 * versus offshore licensing. None of that is true of the UK or Pakistan, and
 * only some of it maps onto Bahrain and Saudi Arabia — so it cannot be
 * localised by swapping the country name. "UAE Corporate Tax is live at 9%"
 * with "UK" substituted is not a translation, it is a false statement about tax
 * law on an accountancy firm's website.
 *
 * So: this file holds replacements, written per region by the people who
 * advise in that region. An entry overrides only the fields it names; anything
 * it leaves out falls through to the base copy, which stays the UAE version.
 *
 * EMPTY ON PURPOSE. Every region currently shows the UAE copy, which is the
 * behaviour before this file existed. Filling it in is a copy task, not a code
 * task — see BLOCKERS.md for the list of passages waiting on regional wording.
 *
 * To localise a page, add an entry under its region:
 *
 *   sa: [
 *     {
 *       path: "tax",
 *       intro:
 *         "At Wathiq, we provide specialized tax services tailored to Saudi " +
 *         "Arabia's ZATCA regime …",
 *     },
 *   ],
 *
 * `path` matches the base entry's path exactly: a practice area (`"tax"`) or a
 * single service within one (`"tax/transfer-pricing"`).
 */
export type RegionalServiceContent = { path: string } & Partial<
  Omit<ServiceContent, "path">
>;

export const regionalServiceContent: Partial<
  Record<TenantCode, RegionalServiceContent[]>
> = {
  // ae is the base copy itself and needs no entries.
  bh: [],
  sa: [],
  uk: [],
  pk: [],
};

/** The override for one page in one region, where there is one. */
export function regionalOverride(path: string, region: TenantCode) {
  return regionalServiceContent[region]?.find((item) => item.path === path);
}
