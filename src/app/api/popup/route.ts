import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { activePopup } from "@/lib/popup";
import { tenantCodeFromHost } from "@/lib/tenants";

/**
 * The popup this region should be showing, if any.
 *
 * A route handler asked for by the browser, rather than data rendered into the
 * page — and that is the whole point of it.
 *
 * Rendering the popup on the server would put it in the tenant layout, which
 * wraps every page. Changing it would then mean invalidating that layout, and
 * invalidating a layout invalidates everything under it: around 830 pages
 * across five regions, against a monthly allowance of 200,000 ISR writes.
 * Scheduling a popup for a Tuesday seminar would cost more writes than a
 * month of publishing does. See the note on `refresh()` in admin/actions.ts,
 * which is the same lesson learned the expensive way.
 *
 * Fetching it instead costs one small request per visit, cached at the edge for
 * five minutes, and nothing is rewritten when the popup changes.
 */
export async function GET() {
  const host = (await headers()).get("host") ?? "";
  const popup = await activePopup(tenantCodeFromHost(host));

  return NextResponse.json(
    { popup },
    {
      headers: {
        /*
          Five minutes at the edge, with a day of stale-while-revalidate. A
          popup is not urgent to the second — the cost of a visitor seeing last
          week's announcement for five more minutes is nothing, and the cost of
          asking the database on every page view of every visit is real.
        */
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
