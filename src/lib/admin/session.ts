import "server-only";

import { cookies } from "next/headers";

/**
 * Admin sessions.
 *
 * One shared password guards the panel — there are no user accounts. Signing
 * in exchanges the password for a cookie holding an expiry and an HMAC of it,
 * so the server can trust the cookie later without storing anything: the
 * signature is only reproducible with `ADMIN_SESSION_SECRET`, and the expiry
 * is inside the signed payload, so neither can be edited by the browser.
 *
 * The limits of a shared password are worth naming: there is no per-author
 * attribution, and changing the password signs everybody out at once. If the
 * team grows beyond a handful of people, this is the module to replace with
 * Supabase Auth — nothing outside it knows how the session is built.
 */

const cookieName = "ag_admin";

/** How long a sign-in lasts. Long enough not to interrupt a writing session. */
const sessionSeconds = 60 * 60 * 12;

const encoder = new TextEncoder();

/** Present only when both secrets are configured; the panel refuses to run otherwise. */
export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

async function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payload: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(),
    encoder.encode(payload),
  );

  return Buffer.from(signature).toString("base64url");
}

/**
 * Compares two strings without leaking how much of them matched.
 *
 * A plain `===` returns as soon as it finds a difference, so response timing
 * narrows down the password one character at a time. Both values are hashed
 * first, which makes the comparison fixed-length regardless of input.
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

/** True when the submitted password is the configured one. */
export async function isValidPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  return equals(password, expected);
}

/** Signs the visitor in by setting the session cookie. */
export async function startSession() {
  const expiresAt = Date.now() + sessionSeconds * 1000;
  const payload = String(expiresAt);
  const token = `${payload}.${await sign(payload)}`;

  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: sessionSeconds,
  });
}

/** Signs the visitor out. */
export async function endSession() {
  const store = await cookies();
  store.delete({ name: cookieName, path: "/admin" });
}

/** True when the request carries a valid, unexpired session cookie. */
export async function hasSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;

  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expected = await sign(payload);
  if (!(await equals(signature, expected))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
