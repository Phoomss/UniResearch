import { expect, test } from "@playwright/test";

const studentEmail=process.env.E2E_STUDENT_EMAIL;
const studentPassword=process.env.E2E_STUDENT_PASSWORD;
const advisorEmail=process.env.E2E_ADVISOR_EMAIL;
const advisorPassword=process.env.E2E_ADVISOR_PASSWORD;
const adminEmail=process.env.E2E_ADMIN_EMAIL;
const adminPassword=process.env.E2E_ADMIN_PASSWORD;

async function login(page,email,password,next){await page.goto(`/login?next=${encodeURIComponent(next)}`);await page.locator('input[name="email"]').fill(email);await page.locator('input[name="password"]').fill(password);await page.locator('button[type="submit"]').click();await page.waitForURL(url=>url.pathname===next);}

test("authenticated account opens the canonical saved index",async({page})=>{
  test.skip(!studentEmail||!studentPassword,"Disposable account credentials are required.");
  await login(page,studentEmail,studentPassword,"/account/saved");await expect(page.getByRole("heading",{name:"Saved research"})).toBeVisible();
});

test("advisor opens the server-backed review queue",async({page})=>{
  test.skip(!advisorEmail||!advisorPassword,"Disposable advisor credentials are required.");
  await login(page,advisorEmail,advisorPassword,"/advisor/reviews");await expect(page.getByRole("heading",{name:"คิวตรวจประเมิน"})).toBeVisible();
});

test("administrator opens totals and category management",async({page})=>{
  test.skip(!adminEmail||!adminPassword,"Disposable administrator credentials are required.");
  await login(page,adminEmail,adminPassword,"/admin");await expect(page.getByRole("heading",{name:"Archive totals"})).toBeVisible();await page.getByRole("link",{name:"Manage categories"}).click();await expect(page.getByRole("heading",{name:"Research categories"})).toBeVisible();
});
