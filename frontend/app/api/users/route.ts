import { apiJson } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { UserResponse } from "@/src/lib/api/types";

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json(
      { error: { status: 401, code: "unauthorized", message: "กรุณาเข้าสู่ระบบ" } },
      { status: 401 }
    );
  }

  const input = await request.json().catch(() => null);
  if (!input || !input.email || !input.password) {
    return Response.json(
      { error: { status: 422, code: "validation", message: "กรุณากรอกอีเมลและรหัสผ่าน" } },
      { status: 422 }
    );
  }

  return toRouteResponse(
    await apiJson<UserResponse>(
      "/users/",
      "POST",
      {
        email: input.email.trim(),
        password: input.password,
        role: input.role || "guest",
        student_id: input.student_id?.trim() || null,
        department: input.department?.trim() || null,
        first_name: input.first_name?.trim() || null,
        last_name: input.last_name?.trim() || null,
      },
      token
    )
  );
}
