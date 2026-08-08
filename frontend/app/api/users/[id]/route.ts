import { apiJson, apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { UserResponse } from "@/src/lib/api/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json(
      { error: { status: 401, code: "unauthorized", message: "กรุณาเข้าสู่ระบบ" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const input = await request.json().catch(() => null);
  if (!input) {
    return Response.json(
      { error: { status: 400, code: "validation", message: "ไม่มีข้อมูลในการอัปเดต" } },
      { status: 400 }
    );
  }

  return toRouteResponse(
    await apiJson<UserResponse>(
      `/users/${id}`,
      "PUT",
      {
        email: input.email?.trim() || undefined,
        password: input.password || undefined,
        role: input.role || undefined,
        student_id: input.student_id !== undefined ? (input.student_id?.trim() || null) : undefined,
        department: input.department !== undefined ? (input.department?.trim() || null) : undefined,
        first_name: input.first_name !== undefined ? (input.first_name?.trim() || null) : undefined,
        last_name: input.last_name !== undefined ? (input.last_name?.trim() || null) : undefined,
        is_active: input.is_active !== undefined ? input.is_active : undefined,
      },
      token
    )
  );
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const token = await getSessionToken();
  if (!token) {
    return Response.json(
      { error: { status: 401, code: "unauthorized", message: "กรุณาเข้าสู่ระบบ" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  return toRouteResponse(
    await apiRequest<void>(`/users/${id}`, {
      method: "DELETE",
      token,
    })
  );
}
