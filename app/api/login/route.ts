import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_MAX_AGE, createAuthCookieValue, passwordMatches } from "@/lib/auth";

// Edge runtime so this shares the exact same Web Crypto implementation as
// middleware.ts (which always runs on the edge) — no Node-vs-edge crypto
// mismatch to worry about.
export const runtime = "edge";

export async function POST(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return NextResponse.json({ error: "Site password is not configured." }, { status: 500 });
  }

  let submitted: unknown;
  try {
    const body = await request.json();
    submitted = body?.password;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof submitted !== "string" || submitted.length === 0) {
    return NextResponse.json({ error: "Enter a password." }, { status: 400 });
  }

  const ok = await passwordMatches(submitted, sitePassword);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookieValue = await createAuthCookieValue(sitePassword);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE,
  });
  return res;
}
