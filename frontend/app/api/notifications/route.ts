import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

export async function GET() {
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
  const body = await request.json().catch(() => ({}));
  if (body?.action === "read-all") {
    const result = await apiRequest("/notifications/read-all", { method: "POST", token });
    return toRouteResponse(result);
  }

  // Expecting notification ID in JSON body for specific read request
  const id = body?.id;
  if (!Number.isSafeInteger(id) || id <= 0) {
    return Response.json({ error: { message: "Invalid ID" } }, { status: 400 });
  }
  const result = await apiRequest(`/notifications/${id}/read`, { method: "POST", token });
  return toRouteResponse(result);
}
