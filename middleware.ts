import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, isValidAuthCookie } from "@/lib/auth";

// Plain string checks rather than a matcher regex — easier to verify by eye
// (and by testing) that /trojan.mp3 and other static assets can never get
// caught by an off-by-one in a lookahead pattern.
function isPublicPath(pathname: string): boolean {
  if (pathname === "/login") return true;
  if (pathname === "/api/login") return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/manifest.json") return true;
  if (pathname === "/trojan.mp3") return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/images/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const password = process.env.SITE_PASSWORD;
  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  // If SITE_PASSWORD is unset, fail closed (nobody gets in) rather than
  // silently leaving the site unprotected.
  const authed = password ? await isValidAuthCookie(cookieValue, password) : false;

  if (authed) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
