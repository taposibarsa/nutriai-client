import { createAuthClient } from "better-auth/react";

/**
 * Auth always talks to the Express API (Render / localhost).
 * Cross-origin cookies use SameSite=None on the server when FRONTEND_URL ≠ BETTER_AUTH_URL.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: {
    credentials: "include",
  },
});

/** Frontend origin for OAuth callbackURL (must be in server trustedOrigins). */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
