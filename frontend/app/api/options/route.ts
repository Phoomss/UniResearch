import { apiJson } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

export async function GET() {
  return toRouteResponse(
    await apiJson("/options/", "GET", null)
  );
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json({ error: { message: "กรุณาเข้าสู่ระบบ" } }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.departments) || !Array.isArray(body.work_types)) {
      return Response.json({ error: { message: "ข้อมูลไม่ถูกต้อง" } }, { status: 422 });
    }

    return toRouteResponse(
      await apiJson("/options/", "POST", {
        departments: body.departments.map((x: string) => String(x).trim()).filter(Boolean),
        work_types: body.work_types.map((x: string) => String(x).trim()).filter(Boolean)
      }, token)
    );
  } catch (error: any) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }
}
