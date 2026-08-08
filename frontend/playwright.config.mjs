import { defineConfig } from "@playwright/test";

const hasDisposableFixtures=Boolean(process.env.E2E_RESEARCH_ID||process.env.E2E_STUDENT_EMAIL||process.env.E2E_ADVISOR_EMAIL||process.env.E2E_ADMIN_EMAIL);

export default defineConfig({
  testDir:"./e2e",
  timeout:60_000,
  use:{baseURL:process.env.PLAYWRIGHT_BASE_URL??"http://127.0.0.1:3000",trace:"retain-on-failure"},
  webServer:process.env.PLAYWRIGHT_EXTERNAL_SERVER||!hasDisposableFixtures?undefined:{command:"pnpm dev",url:"http://127.0.0.1:3000",reuseExistingServer:true,timeout:120_000},
});
