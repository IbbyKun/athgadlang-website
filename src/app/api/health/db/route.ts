import { NextResponse, type NextRequest } from "next/server";

import { readClient } from "@/lib/supabase";

/**
 * Database health check, and the reason the database stays awake.
 *
 * Supabase pauses a free project after seven consecutive days with no requests,
 * and restarting it is a manual click in their dashboard. Nothing would look
 * broken in the meantime: the content layer treats an unreachable database as
 * "no rows", so the site quietly falls back to its built-in articles and the
 * failure stays invisible until somebody wonders where the insights went. A
 * scheduled request resets that seven-day clock.
 *
 * Scheduled from vercel.json — daily, not every five days. Cron has no way to
 * express "every five days": `*​/5` in the day-of-month field means the 1st,
 * 6th, 11th, 16th, 21st and 26th, which leaves a six-day gap across the end of
 * a 31-day month. Vercel documents cron delivery as best effort, so one dropped
 * run doubles whatever gap you chose — six days becomes twelve and the project
 * pauses anyway. Daily costs one invocation a day and survives six consecutive
 * misses.
 */

// Never cached. A cached 200 would report a healthy database without asking it
// anything, and Vercel does not log cron invocations that return a cached
// response — so it would fail silently in both directions at once.
export const dynamic = "force-dynamic";

/** The content tables the public pages read. */
const TABLES = ["insights", "events", "webinars"] as const;

const encoder = new TextEncoder();

/**
 * Compares two strings without leaking how much of them matched, by hashing
 * both to a fixed length first. Mirrors `equals` in src/lib/admin/session.ts.
 */
async function equals(a: string, b: string) {
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);

  const x = new Uint8Array(left);
  const y = new Uint8Array(right);

  let difference = 0;
  for (let index = 0; index < x.length; index += 1) {
    difference |= x[index] ^ y[index];
  }

  return difference === 0;
}

/**
 * Vercel sends `Authorization: Bearer $CRON_SECRET` on every cron invocation,
 * once that variable is set on the project.
 *
 * Open in development so the endpoint can be curled locally. Closed in
 * production, because an unauthenticated endpoint that runs database queries is
 * a cheap thing to hit in a loop and it is the free tier that pays.
 *
 * A missing secret is reported as "misconfigured" rather than "unauthorised",
 * and the two get different status codes. They are different faults and they
 * need different fixes: 401 means something called this without the secret,
 * 503 means nobody set one — in which case the scheduled request is being turned
 * away before it reaches the database and the project will pause on schedule,
 * which is the exact failure this endpoint exists to prevent. Worth being able
 * to tell apart from Vercel's cron log, which shows only the status code.
 */
type Auth = "ok" | "unauthorised" | "misconfigured";

async function authorise(request: NextRequest): Promise<Auth> {
  if (process.env.NODE_ENV !== "production") return "ok";

  const secret = process.env.CRON_SECRET;
  if (!secret) return "misconfigured";

  const header = request.headers.get("authorization") ?? "";
  return (await equals(header, `Bearer ${secret}`)) ? "ok" : "unauthorised";
}

export async function GET(request: NextRequest) {
  const auth = await authorise(request);

  if (auth === "misconfigured") {
    console.error(
      "[health/db] CRON_SECRET is not set, so the keep-alive request is being " +
        "rejected before it reaches the database. Set it on the Vercel project.",
    );

    return NextResponse.json(
      { ok: false, error: "misconfigured" },
      { status: 503 },
    );
  }

  if (auth === "unauthorised") {
    return NextResponse.json(
      { ok: false, error: "unauthorised" },
      { status: 401 },
    );
  }

  const client = readClient();

  if (!client) {
    // Not the database failing — there isn't one attached. Still 503 so a
    // monitor notices, but with a reason that points at configuration.
    return NextResponse.json(
      {
        ok: false,
        database: "not configured",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  const startedAt = Date.now();

  // `head: true` asks for the count and no rows, so this stays cheap however
  // much content accumulates. One round trip would be enough to reset the
  // inactivity clock; querying all three in parallel means the response also
  // says whether the read path works for each of them.
  const results = await Promise.all(
    TABLES.map(async (table) => {
      const { count, error } = await client
        .from(table)
        .select("*", { count: "exact", head: true });

      return { table, count: count ?? 0, error: error?.message ?? null };
    }),
  );

  const latencyMs = Date.now() - startedAt;
  const checkedAt = new Date().toISOString();
  const failed = results.filter((result) => result.error);

  if (failed.length > 0) {
    // Logged as well as returned: Vercel keeps the cron invocation log, and
    // nobody is reading the response body of a scheduled request.
    console.error("[health/db] unreachable", failed);

    return NextResponse.json(
      {
        ok: false,
        database: "error",
        latencyMs,
        checkedAt,
        errors: Object.fromEntries(
          failed.map((result) => [result.table, result.error]),
        ),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    database: "reachable",
    latencyMs,
    checkedAt,
    tables: Object.fromEntries(
      results.map((result) => [result.table, result.count]),
    ),
  });
}
