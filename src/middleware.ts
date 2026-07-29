import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Cross-origin deploys (Vercel frontend + Render API) store the Better Auth
 * session cookie on the API host, so it is never visible to this Edge middleware.
 * Route gating is handled by AuthGuard (client session check); real security is
 * requireAuth on the API.
 */
export function middleware(_request: NextRequest) {
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
