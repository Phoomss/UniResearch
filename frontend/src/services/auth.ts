import { apiJson, apiRequest } from "@/src/lib/api/client";
import type { UserCreate, UserResponse, TokenResponse, ApiResult } from "@/src/lib/api/types";

/**
 * Registers a new user.
 * @param userIn User creation data.
 */
export async function registerUser(userIn: UserCreate): Promise<ApiResult<UserResponse>> {
  return apiJson<UserResponse>("/auth/register", "POST", userIn);
}

/**
 * Logs in a user by acquiring a JWT token.
 * @param email User email
 * @param password User password
 */
export async function loginUser(email: string, password: string): Promise<ApiResult<TokenResponse>> {
  const form = new URLSearchParams({
    username: email,
    password: password,
  });
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
}
