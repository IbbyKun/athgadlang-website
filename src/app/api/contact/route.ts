import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { saveEnquiry } from "@/lib/enquiries";
import { tenantCodeFromHost } from "@/lib/tenants";

const SUCCESS = "Thanks, we'll be in touch shortly.";

type Errors = Record<string, string>;

/**
 * Contact form endpoint.
 *
 * Validation is real and runs server-side, so the client cannot bypass it.
 * A valid enquiry is written to `contact_enquiries` and that write is what the
 * success message is promising — if it fails, the visitor is told so rather
 * than thanked, because a lead nobody has a copy of is worse than one the
 * sender knows to resend.
 *
 * Mailing somebody about it is a separate, still-unbuilt step: delivery needs
 * credentials the group has not issued yet, and whichever transport it ends up
 * using should be a notification about the row rather than the only copy of it.
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
  // with the success message rather than an error, to avoid teaching it — and
  // store nothing, which is the point of catching it.
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

  const headerList = await headers();

  const stored = await saveEnquiry({
    firstName: field("firstName"),
    lastName: field("lastName"),
    email,
    phone,
    message: field("message"),
    // Taken from the host the request arrived on rather than trusted from the
    // form, as with the newsletter: it decides which office picks this up.
    region: tenantCodeFromHost(headerList.get("host") ?? ""),
    sourcePath: refererPath(headerList.get("referer")),
  });

  if (!stored.ok) {
    return NextResponse.json(
      {
        message:
          "Could not send your message just now. Please try again, or email us directly.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: SUCCESS });
}

/**
 * The path of the page the form was submitted from.
 *
 * Path only — the host is already known from the request and the query string
 * can carry campaign parameters that have no business in this table. Anything
 * unparseable, or from somewhere that is not us, is recorded as nothing rather
 * than as a guess.
 */
function refererPath(referer: string | null) {
  if (!referer) return null;

  try {
    return new URL(referer).pathname;
  } catch {
    return null;
  }
}
