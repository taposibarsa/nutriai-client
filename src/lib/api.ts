const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Resolve fetch base for recipes/AI/etc. Uses same-origin gateway when SITE_URL is set. */
export function getApiRequestUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // /api/recipes → /api/gateway/api/recipes (proxied to Render)
    return `/api/gateway${normalized}`;
  }
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return `${API_URL}${normalized}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(getApiRequestUrl(path), {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Warm the Render free tier before auth (reduces first-try failures). */
export async function wakeApi(timeoutMs = 45_000): Promise<boolean> {
  if (!API_URL) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(API_URL, { method: "GET", signal: controller.signal, cache: "no-store" });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
