import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFileSync(new URL(path, root), "utf8");

test("frontend development aliases share a password and have role-specific sessions", () => {
  const development = source("src/lib/auth/development-session.ts");
  assert.match(development, /DEVELOPMENT_PASSWORD = "password"/);
  assert.match(development, /username === "admin"/);
  assert.match(development, /username === "advisor"/);
  assert.match(development, /frontend-development-advisor/);
  assert.match(development, /process\.env\.NODE_ENV === "production"/);
});

test("advisor development login redirects and resolves a mock current user", () => {
  const login = source("app/api/auth/login/route.ts");
  const authForm = source("src/features/auth/auth-form.tsx");
  const api = source("src/features/research/api.ts");
  const profileRoute = source("app/api/auth/me/route.ts");
  assert.match(login, /developmentRole === "admin" \? "\/admin" : "\/advisor"/);
  assert.match(authForm, /identifier !== "advisor"/);
  assert.match(api, /isDevelopmentSession\(token, "advisor"\)/);
  assert.match(profileRoute, /developmentAdvisorUser\(body\)/);
});
