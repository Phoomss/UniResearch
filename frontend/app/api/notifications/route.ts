import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

export async function GET(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json({ error: { status: 401, message: "กรุณาเข้าสู่ระบบ" } }, { status: 401 });
  }
  const result = await apiRequest("/notifications/", { token });
  return toRouteResponse(result);
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json({ error: { status: 401, message: "กรุณาเข้าสู่ระบบ" } }, { status: 401 });
  }
  const url = new URL(request.url);
  if (url.pathname.endsWith("/read-all")) {
    const result = await apiRequest("/notifications/read-all", { method: "POST", token });
    return toRouteResponse(result);
  }

  // Expecting notification ID in JSON body for specific read request
  const body = await request.json().catch(() => ({}));
  const id = body.id;
  if (!id) {
    return Response.json({ error: { message: "Invalid ID" } }, { status: 400 });
  }
  const result = await apiRequest(`/notifications/${id}/read`, { method: "POST", token });
  return toRouteResponse(result);
}
