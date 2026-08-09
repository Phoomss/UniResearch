import { NextResponse } from "next/server";
import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { developmentAdvisorUser, isDevelopmentSession } from "@/src/lib/auth/development-session";
import type { UserResponse } from "@/src/lib/api/types";

export async function PUT(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: { status: 419, code: "unauthorized", message: "กรุณาเข้าสู่ระบบอีกครั้ง" } },
      { status: 419 }
    );
  }

  const body = await request.json().catch(() => ({}));
  if (isDevelopmentSession(token, "advisor")) {
    return NextResponse.json(developmentAdvisorUser(body));
  }

  const result = await apiRequest<UserResponse>("/auth/me", {
    method: "PUT",
    token: token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error.status || 500 }
    );
  }

  return NextResponse.json(result.data);
}
