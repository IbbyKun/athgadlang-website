import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { hasSession } from "@/lib/admin/session";
import { contentTags } from "@/lib/content";
import { tenants } from "@/lib/tenants";

/**
 * Clear a cached page by hand.
 *
 * Publishing already revalidates what it touches — see refresh() in
 * ../actions.ts, which is the mechanism and should stay the mechanism. This is
 * the escape hatch for when a page is stuck anyway, and there are two ways that
 * happens:
 *
 *   - Content reaches the database without going through the admin panel.
 *     `npm run import:insights` writes rows directly, so nothing tells Next.
 *   - A URL was requested before its article existed. The 404 it correctly got
 *     is cached, and pages now revalidate daily rather than every five minutes,
 *     so it stays wrong for a day.
 *
 * Lives under /admin deliberately: the session cookie is scoped to that path,
 * so being signed in is the whole authorisation story and there is no second
 * secret to manage. A GET, so it can be pasted into the address bar of the
 * browser you are already signed into — revalidation is idempotent and destroys
 * nothing, which is what makes that acceptable on a GET.
 *
 *   /admin/revalidate?slug=my-article&kind=insights   one article, all regions
 *   /admin/revalidate?path=/pk/insights/my-article    one exact path
 *   /admin/revalidate?everything=1                    the whole tree
 *
 * `everything` maps to `revalidatePath('/', 'layout')`, which Next documents as
 * invalidating all cached data. It costs a regeneration of every page
 * subsequently visited — up to 927 — so it is a repair tool, not something to
 * wire into a workflow.
 *
 * What none of these can do is resurrect a cached 404. Tested against a
 * deliberately broken page on 10 August 2026: the route pattern, the literal
 * path and the layout-wide purge all left it 404ing, and only a rebuild cleared
 * it. So if a page is stuck at 404 rather than merely stale, this endpoint is
 * the wrong tool and a redeploy is the right one. The real answer is to not
 * cache that 404 in the first place, which is what `freshInsight` and
 * `freshEvent` in src/lib/content.ts are for.
 */

// Never cached: a cached response here would be a revalidation that silently
// did not happen.
export const dynamic = "force-dynamic";

const KINDS = ["insights", "events", "webinars"] as const;
type Kind = (typeof KINDS)[number];

export async function GET(request: NextRequest) {
  if (!(await hasSession())) {
    return NextResponse.json(
      { ok: false, error: "Not signed in." },
      { status: 401 },
    );
  }

  const params = request.nextUrl.searchParams;
  const done: string[] = [];

  if (params.get("everything")) {
    revalidatePath("/", "layout");
    done.push("everything (revalidatePath('/', 'layout'))");
  }

  const kindParam = params.get("kind");
  const kind = KINDS.includes(kindParam as Kind)
    ? (kindParam as Kind)
    : "insights";

  // One article, every region. The route segment is the tenant code, so KSA is
  // /sa/ rather than the /ksa/ its subdomain uses.
  const slug = params.get("slug");
  if (slug) {
    revalidateTag(contentTags[kind], { expire: 0 });
    revalidatePath(`/[tenant]/${kind}`, "page");

    for (const tenant of tenants) {
      const path = `/${tenant.code}/${kind}/${slug}`;
      revalidatePath(path);
      done.push(path);
    }
  }

  // An exact path, for anything the two shapes above do not cover.
  for (const path of params.getAll("path")) {
    if (!path.startsWith("/")) continue;
    revalidatePath(path);
    done.push(path);
  }

  if (done.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Nothing to do. Pass ?slug=… (with optional &kind=), ?path=/…, or ?everything=1.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    revalidated: done,
    note: "Cleared. The next request to each path regenerates it.",
  });
}
