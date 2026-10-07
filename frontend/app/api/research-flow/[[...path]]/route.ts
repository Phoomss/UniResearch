import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

type Context = { params: Promise<{ path?: string[] }> };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function proxy(request: NextRequest, context: Context) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: { message: "Please sign in", status: 401 } }, { status: 401 });
  const { path = [] } = await context.params;
  const collection = new Set(["tasks", "sources", "papers", "claims", "evidence", "citations", "report", "events"]);
  const commands = new Set(["start", "continue", "stop"]);
  const isGet = request.method === "GET";
  const allowed = path.length === 0 || (uuid.test(path[0]) && (
    (isGet && path.length === 1) || (path.length === 2 && (isGet ? collection : commands).has(path[1]))
  ));
  if (!allowed) return NextResponse.json({ error: { message: "Unknown ResearchFlow route" } }, { status: 404 });
  let body: string | undefined;
  if (!isGet) {
    // Next's internal URL can use the container hostname. The browser's public
    // address is the request Host; do not trust Origin or X-Forwarded-Host alone.
    const publicOrigin = new URL(request.nextUrl.protocol + "//" + (request.headers.get("host") ?? request.nextUrl.host)).origin;
    if (request.headers.get("sec-fetch-site") === "cross-site" ||
        (request.headers.get("origin") && request.headers.get("origin") !== publicOrigin)) {
      return NextResponse.json({ error: { message: "Invalid request origin" } }, { status: 403 });
    }
    const raw = await request.text();
    if (raw.length > 10000) return NextResponse.json({ error: { message: "Request too large" } }, { status: 413 });
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Expected JSON object");
      body = JSON.stringify(parsed);
    }
    catch { return NextResponse.json({ error: { message: "Invalid JSON" } }, { status: 422 }); }
  }
  const after = request.nextUrl.searchParams.get("after") ?? "0";
  if (!/^\d{1,10}$/.test(after)) return NextResponse.json({ error: { message: "Invalid event cursor" } }, { status: 422 });
  const suffix = path[1] === "events" ? `?after=${after}` : "";
  return toRouteResponse(await apiRequest(`/research-flow${path.length ? `/${path.join("/")}` : ""}${suffix}`, {
    method: request.method, token, headers: { "Content-Type": "application/json" }, body,
  }), !isGet && path.length === 0 ? 201 : 200);
}

export const GET = proxy;
export const POST = proxy;
