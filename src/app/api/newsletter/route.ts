import { NextResponse } from "next/server";

const SUCCESS = "You're subscribed — thanks!";

/**
 * Newsletter sign-up.
 *
 * Validation is real. Delivery is NOT: connect the mailing provider
 * (Mailchimp, Brevo, Resend audiences, …) at the TODO below, or addresses are
 * collected and discarded.
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

  // TODO: add the address to the real mailing list.
  console.info("[newsletter] subscribe", { email });

  return NextResponse.json({ message: SUCCESS });
}
