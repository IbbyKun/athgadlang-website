import { NextResponse } from "next/server";

const SUCCESS = "Thanks — we'll be in touch shortly.";

type Errors = Record<string, string>;

/**
 * Contact form endpoint.
 *
 * Validation is real and runs server-side, so the client cannot bypass it.
 * Delivery is NOT wired up yet — see the TODO below. Connect an SMTP
 * transport, a service such as Resend, or the CRM before launch, otherwise
 * enquiries reach the server log and go no further.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const field = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string).trim() : "";

  // Honeypot: hidden from real visitors, so anything here is a bot. Answer
  // with the success message rather than an error, to avoid teaching it.
  if (field("website")) {
    return NextResponse.json({ message: SUCCESS });
  }

  const errors: Errors = {};

  if (!field("firstName")) errors.firstName = "First name is required.";
  if (!field("lastName")) errors.lastName = "Last name is required.";

  const email = field("email");
  if (!email) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "Enter a valid email address.";

  const phone = field("phone");
  if (!phone) errors.phone = "Phone number is required.";
  else if (phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number.";

  if (field("message").length > 4000)
    errors.message = "Please keep the message under 4000 characters.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { errors, message: "Please check the highlighted fields." },
      { status: 400 },
    );
  }

  // TODO: replace with real delivery (SMTP / Resend / CRM webhook).
  console.info("[contact] enquiry received", {
    name: `${field("firstName")} ${field("lastName")}`,
    email,
    phone,
    messageLength: field("message").length,
  });

  return NextResponse.json({ message: SUCCESS });
}
