import { proxyToApi } from "@/lib/apiProxy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Allow Render free-tier cold starts through the auth proxy. */
export const maxDuration = 60;

type Ctx = { params: Promise<{ all: string[] }> };

async function handle(request: Request, ctx: Ctx) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiBase) {
    return Response.json({ error: "NEXT_PUBLIC_API_URL is not set" }, { status: 500 });
  }

  const { all } = await ctx.params;
  const path = all?.join("/") ?? "";
  const url = new URL(request.url);
  const target = `${apiBase}/api/auth/${path}${url.search}`;

  try {
    return await proxyToApi(request, target);
  } catch {
    return Response.json(
      { error: "Auth service unavailable. The API may be waking up — try again." },
      { status: 503 },
    );
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
