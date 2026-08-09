import type { UserResponse } from "@/src/lib/api/types";

export type DevelopmentRole = "admin" | "advisor";

export const DEVELOPMENT_PASSWORD = "password";
export const DEVELOPMENT_SESSIONS: Record<DevelopmentRole, string> = {
  admin: "frontend-development-admin",
  advisor: "frontend-development-advisor",
};

export function resolveDevelopmentLogin(
  username: string,
  password: string,
): DevelopmentRole | null {
  if (process.env.NODE_ENV === "production" || password !== DEVELOPMENT_PASSWORD) return null;
  if (username === "admin") return "admin";
  if (username === "advisor") return "advisor";
  return null;
}

export function isDevelopmentSession(
  token: string | null,
  role: DevelopmentRole,
) {
  return process.env.NODE_ENV !== "production" && token === DEVELOPMENT_SESSIONS[role];
}

export function developmentAdvisorUser(
  overrides: Partial<UserResponse> = {},
): UserResponse {
  return {
    id: -2,
    email: "advisor@development.local",
    role: "advisor",
    student_id: null,
    department: "Development",
    first_name: "Advisor",
    last_name: "Developer",
    is_active: true,
    ...overrides,
  };
}
