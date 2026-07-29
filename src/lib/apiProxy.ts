/**
 * Proxy helpers for same-origin auth/API on Vercel → Render.
 * Rewrites Set-Cookie so the browser stores first-party cookies on the frontend host
 * (fixes mobile Safari blocking cross-site Render cookies).
 */

export function rewriteSetCookie(raw: string | null): string[] {
  if (!raw) return [];
  // Headers.get can join multiple Set-Cookie incorrectly; callers should use getSetCookie when available
  return [sanitizeSetCookie(raw)];
}

export function sanitizeSetCookie(cookie: string): string {
  const parts = cookie
    .split(";")
    .map((part) => part.trim())
    .filter((part) => {
      const lower = part.toLowerCase();
      // Drop Domain so the cookie becomes host-only for the frontend
      if (lower.startsWith("domain=")) return false;
      return true;
    })
    .map((part) => {
      const lower = part.toLowerCase();
      // First-party on Vercel → Lax is enough and works better on mobile Safari
      if (lower.startsWith("samesite=")) return "SameSite=Lax";
      return part;
    });

  const joined = parts.join("; ");
  const lowerJoined = joined.toLowerCase();
  // Ensure Secure for HTTPS frontends (required with modern browsers)
  if (!lowerJoined.includes("secure")) {
    return `${joined}; Secure`;
  }
  return joined;
}

export function collectSetCookies(res: Response): string[] {
  const anyHeaders = res.headers as Headers & {
    getSetCookie?: () => string[];
  };
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie().map(sanitizeSetCookie);
  }
  const single = res.headers.get("set-cookie");
  return single ? [sanitizeSetCookie(single)] : [];
}

export async function proxyToApi(
  request: Request,
  targetUrl: string,
): Promise<Response> {
  const incoming = new Headers(request.headers);
  incoming.delete("host");
  incoming.delete("connection");
  incoming.delete("content-length");

  // Help Better Auth / Express see the real browser host and client IP
  const host = request.headers.get("host");
  if (host) {
    incoming.set("x-forwarded-host", host);
  }
  incoming.set("x-forwarded-proto", "https");
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    incoming.set("x-forwarded-for", forwardedFor);
  }

  const init: RequestInit = {
    method: request.method,
    headers: incoming,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetUrl, init);
  const outHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "set-cookie") return;
    if (lower === "transfer-encoding") return;
    if (lower === "content-encoding") return;
    outHeaders.set(key, value);
  });

  for (const cookie of collectSetCookies(upstream)) {
    outHeaders.append("set-cookie", cookie);
  }

  // If Better Auth redirects to the API origin, rewrite to the frontend origin
  const location = upstream.headers.get("location");
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (host ? `https://${host}` : undefined);
  if (location && apiBase && siteBase && location.startsWith(apiBase)) {
    outHeaders.set("location", siteBase + location.slice(apiBase.length));
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}
