import { NextResponse } from "next/server";
import { apiRequest } from "@/src/lib/api/client";
import { setSessionToken } from "@/src/lib/api/session";
import {
  DEVELOPMENT_SESSIONS,
  resolveDevelopmentLogin,
} from "@/src/lib/auth/development-session";
import type { TokenResponse, UserResponse } from "@/src/lib/api/types";

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

  const developmentRole = resolveDevelopmentLogin(input.email, input.password);

  if (developmentRole) {
    await setSessionToken(DEVELOPMENT_SESSIONS[developmentRole]);

    return NextResponse.json({
      authenticated: true,
      role: developmentRole,
      mock: true,
      redirect_to: developmentRole === "admin" ? "/admin" : "/advisor",
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

  const userProfile = await apiRequest<UserResponse>("/auth/" + "me", {
    token: result.data.access_token
  });

  let redirectTo = "/account/saved";
  if (userProfile.ok) {
    const role = userProfile.data.role;
    if (role === "advisor" || role === "reviewer") {
      redirectTo = "/advisor";
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

