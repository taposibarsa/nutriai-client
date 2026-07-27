import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedExact = new Set([
  "/items/add",
  "/items/manage",
  "/meal-planner",
  "/coach",
]);

function isProtectedPath(pathname: string): boolean {
  if (protectedExact.has(pathname)) return true;
  return (
    pathname.startsWith("/items/add/") ||
    pathname.startsWith("/items/manage/") ||
    pathname.startsWith("/meal-planner/") ||
    pathname.startsWith("/coach/")
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // UX gate only — real security is requireAuth on the API.
  // On cross-domain deploys the API cookie may be invisible here; AuthGuard covers that.
  if (!hasSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/items/add",
    "/items/add/:path*",
    "/items/manage",
    "/items/manage/:path*",
    "/meal-planner",
    "/meal-planner/:path*",
    "/coach",
    "/coach/:path*",
  ],
};
