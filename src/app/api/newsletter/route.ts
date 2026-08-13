import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { subscribeToNewsletter } from "@/lib/newsletter";
import { tenantCodeFromHost } from "@/lib/tenants";

const SUCCESS = "You're subscribed. Thanks!";

/**
 * Newsletter sign-up.
 *
 * The address is stored, keyed to the regional site it was given on. Handing it
 * on to the email platform is a separate step and is NOT connected yet: rows
 * land here with `synced_at` null, which is the queue of people waiting to be
 * added to the campaign list. See src/lib/newsletter.ts.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const honeypot = typeof data.website === "string" ? data.website.trim() : "";

  // Hidden from real visitors, so anything here is a bot.
  if (honeypot) return NextResponse.json({ message: SUCCESS });

  if (!email) {
    return NextResponse.json(
      { message: "Enter your email address." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  // Which regional site they signed up on, taken from the host the request
  // arrived on rather than trusted from the form.
  const host = (await headers()).get("host") ?? "";
  const stored = await subscribeToNewsletter(email, tenantCodeFromHost(host));

  if (!stored.ok) {
    return NextResponse.json(
      { message: "Could not subscribe just now. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: SUCCESS });
}
