import { getOptions, updateOptions } from "@/src/features/research/api";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await toRouteResponse(await getOptions());
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return response;
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

    const depts = body.departments.map((x: string) => String(x).trim()).filter(Boolean);
    const types = body.work_types.map((x: string) => String(x).trim()).filter(Boolean);

    return toRouteResponse(await updateOptions(depts, types));
  } catch (error: any) {
    return Response.json({ error: { message: error.message } }, { status: 500 });
  }
}
