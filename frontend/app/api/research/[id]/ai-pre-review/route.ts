import { apiJson } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json({ error: { status: 401, code: "unauthorized", message: "กรุณาเข้าสู่ระบบ" } }, { status: 401 });
  }
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: { status: 422, code: "validation", message: "รหัสงานวิจัยไม่ถูกต้อง" } }, { status: 422 });
  }
  return toRouteResponse(await apiJson<any>(`/research/${id}/ai-pre-review`, "POST", {}, token));
}
