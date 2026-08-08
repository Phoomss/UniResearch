import { NextResponse } from "next/server";
import { apiRequest } from "@/src/lib/api/client";
import { setSessionToken } from "@/src/lib/api/session";
import type { TokenResponse, UserResponse } from "@/src/lib/api/types";

const DEVELOPMENT_ADMIN_USERNAME = "admin";
const DEVELOPMENT_ADMIN_PASSWORD = "password";
const DEVELOPMENT_ADMIN_SESSION = "frontend-development-admin";

export async function POST(request: Request) {
  const input = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  if (!input?.email || !input.password) {
    return NextResponse.json(
      {
        error: {
          status: 422,
          code: "validation",
          message: "กรุณากรอกอีเมลและรหัสผ่าน",
        },
      },
      { status: 422 },
    );
  }

  const isDevelopmentAdmin =
    process.env.NODE_ENV !== "production" &&
    input.email === DEVELOPMENT_ADMIN_USERNAME &&
    input.password === DEVELOPMENT_ADMIN_PASSWORD;

  if (isDevelopmentAdmin) {
    await setSessionToken(DEVELOPMENT_ADMIN_SESSION);

    return NextResponse.json({
      authenticated: true,
      role: "admin",
      mock: true,
      redirect_to: "/admin",
    });
  }

  const form = new URLSearchParams({
    username: input.email,
    password: input.password,
  });
  const result = await apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error.status || 503 },
    );
  }

  await setSessionToken(result.data.access_token);

  const userProfile = await apiRequest<UserResponse>("/auth/me", {
    token: result.data.access_token
  });

  let redirectTo = "/account/saved";
  if (userProfile.ok) {
    const role = userProfile.data.role;
    if (role === "advisor" || role === "reviewer") {
      redirectTo = "/dashboard/reviewer";
    } else if (role === "admin") {
      redirectTo = "/admin";
    }
  }

  return NextResponse.json({
    authenticated: true,
    token_type: result.data.token_type,
    redirect_to: redirectTo,
  });
}

