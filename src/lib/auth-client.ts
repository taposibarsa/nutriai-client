import { createAuthClient } from "better-auth/react";

/**
 * In production (NEXT_PUBLIC_SITE_URL set), auth hits the same-origin
 * `/api/auth/*` Next proxy so cookies are first-party (works on mobile Safari).
 * Locally, talk to the Express API directly.
 */
function authBaseURL(): string | undefined {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site) return site;
  return process.env.NEXT_PUBLIC_API_URL;
}

export const authClient = createAuthClient({
  baseURL: authBaseURL(),
  fetchOptions: {
    credentials: "include",
  },
});

/** Prefer configured site URL so OAuth callback matches FRONTEND_URL / trustedOrigins. */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/** True when auth/API should go through the Next.js same-origin proxy. */
export function useApiGateway(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SITE_URL);
}
