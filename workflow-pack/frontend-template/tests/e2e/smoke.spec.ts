import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "ทุกงานวิจัย คือจุดเริ่มต้นของคำถามถัดไป",
    }),
  ).toBeVisible();
});
