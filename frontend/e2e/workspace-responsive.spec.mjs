import { expect, test } from "@playwright/test";

const viewports = [320, 360, 375, 390, 430, 480, 600, 700, 768, 820, 900, 1024, 1100, 1280, 1440];
const routes = {
  admin: ["/admin", "/admin/users", "/admin/research", "/admin/categories", "/admin/reviews", "/admin/analytics", "/admin/options", "/admin/profile"],
  advisor: ["/advisor", "/advisor/reviews", "/advisor/history", "/advisor/research", "/advisor/advisees", "/advisor/submissions", "/advisor/participants", "/advisor/new", "/advisor/profile"],
};

async function login(page, role) {
  await page.goto(`/login?next=/${role}`, { waitUntil: "domcontentloaded" });
  await page.locator('input[name="email"]').fill(role);
  await page.locator('input[name="password"]').fill("password");
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL(new RegExp(`/${role}(?:$|\\?)`));
  await page.waitForLoadState("domcontentloaded");
}

async function navigate(page, route) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForURL((url) => url.pathname === route);
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(100);
    }
  }
}

async function expectNoPageOverflow(page, label) {
  let dimensions;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      dimensions = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const offenders = [...document.querySelectorAll("body *")]
          .map((element) => ({ element, rect: element.getBoundingClientRect() }))
          .filter(({ rect }) => rect.right > viewport + 1 || rect.left < -1)
          .slice(0, 8)
          .map(({ element, rect }) => ({
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === "string" ? element.className : "",
            parentClassName: typeof element.parentElement?.className === "string" ? element.parentElement.className : "",
            text: (element.textContent ?? "").trim().slice(0, 80),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          }));

        return {
          viewport,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          offenders,
        };
      });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForLoadState("domcontentloaded").catch(() => {});
      await page.waitForTimeout(100);
    }
  }
  if (!dimensions) throw new Error(`${label}: viewport dimensions unavailable`);
  const offenderSummary = dimensions.offenders.length > 0 ? ` ${JSON.stringify(dimensions.offenders)}` : "";
  expect.soft(dimensions.document, `${label}: document overflow${offenderSummary}`).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect.soft(dimensions.body, `${label}: body overflow${offenderSummary}`).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const role of ["admin", "advisor"]) {
  test(`${role} workspace has no horizontal page overflow across audit widths`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, role);

    for (const width of viewports) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      await expectNoPageOverflow(page, `${role} ${width}px`);

      if (width <= 900) {
        const trigger = page.locator(".admin-mobile-menu-trigger");
        await expect(trigger).toBeVisible();
        await trigger.click();
        await expect(trigger, `${role} drawer trigger at ${width}px`).toHaveAttribute("aria-expanded", "true");
        const drawer = page.locator(".admin-mobile-menu");
        await expect(drawer, `${role} drawer at ${width}px`).toBeVisible();
        const box = await drawer.boundingBox();
        expect.soft(box?.x).toBeGreaterThanOrEqual(0);
        expect.soft((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width + 1);
        await page.locator(".admin-mobile-menu-close").click();
      }
    }
  });

  test(`${role} routes keep overflow localized`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, role);
    for (const width of [320, 820, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 320 ? 844 : 900 });
      for (const route of routes[role]) {
        await navigate(page, route);
        await expectNoPageOverflow(page, `${route} ${width}px`);
      }
    }
  });
}
