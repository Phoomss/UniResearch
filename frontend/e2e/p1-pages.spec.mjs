import { expect, test } from "@playwright/test";

const studentEmail=process.env.E2E_STUDENT_EMAIL;
const studentPassword=process.env.E2E_STUDENT_PASSWORD;
const advisorEmail=process.env.E2E_ADVISOR_EMAIL;
const advisorPassword=process.env.E2E_ADVISOR_PASSWORD;
const adminEmail=process.env.E2E_ADMIN_EMAIL;
const adminPassword=process.env.E2E_ADMIN_PASSWORD;
const backendBaseUrl=process.env.E2E_BACKEND_BASE_URL;

async function login(page,email,password,next){await page.goto(`/login?next=${encodeURIComponent(next)}`);await page.locator('input[name="email"]').fill(email);await page.locator('input[name="password"]').fill(password);await page.locator('button[type="submit"]').click();await page.waitForURL(url=>url.pathname!=="/login");await page.goto(next);}

test("authenticated account opens the canonical saved index",async({page})=>{
  test.skip(!studentEmail||!studentPassword,"Disposable account credentials are required.");
  await login(page,studentEmail,studentPassword,"/account/saved");await expect(page.getByRole("heading",{name:"ผลงานวิจัยที่บันทึกไว้"})).toBeVisible();
});

test("advisor opens the server-backed review queue",async({page})=>{
  test.skip(!advisorEmail||!advisorPassword,"Disposable advisor credentials are required.");
  await login(page,advisorEmail,advisorPassword,"/advisor/reviews");await expect(page.getByRole("heading",{name:"คิวตรวจประเมิน"})).toBeVisible();
});

test("administrator opens totals and category management",async({page})=>{
  test.skip(!adminEmail||!adminPassword,"Disposable administrator credentials are required.");
  await login(page,adminEmail,adminPassword,"/admin");await expect(page.getByRole("heading",{name:"ภาพรวมระบบ"})).toBeVisible();await page.getByRole("link",{name:"หมวดหมู่"}).click();await expect(page.getByRole("heading",{name:"หมวดหมู่งานวิจัย"})).toBeVisible();
});

test("registration redirects to login and ignores a requested admin role",async({page,request})=>{
  test.skip(!backendBaseUrl,"Disposable backend URL is required.");
  const uiEmail=`tc-web-${Date.now()}@example.com`;
  await page.goto("/register");
  await page.locator('input[name="first_name"]').fill("Test");
  await page.locator('input[name="last_name"]').fill("Registration");
  await page.locator('input[name="email"]').fill(uiEmail);
  await page.locator('input[name="password"]').fill("DisposableTest2026A");
  await page.locator('input[name="confirmPassword"]').fill("DisposableTest2026A");
  await page.getByRole("button",{name:"สร้างบัญชี"}).click();
  await page.waitForURL(url=>url.pathname==="/login"&&url.searchParams.get("registered")==="1");
  expect((await page.context().cookies()).some(cookie=>cookie.httpOnly)).toBe(false);
  const uiLogin=await request.post(`${backendBaseUrl}/auth/login`,{form:{username:uiEmail,password:"DisposableTest2026A"}});
  expect(uiLogin.status()).toBe(200);
  const uiMe=await request.get(`${backendBaseUrl}/auth/me`,{headers:{Authorization:`Bearer ${(await uiLogin.json()).access_token}`}});
  expect((await uiMe.json()).role).toBe("student");
  const apiResponse=await request.post(`${backendBaseUrl}/auth/register`,{data:{email:`tc-api-${Date.now()}@example.com`,password:"DisposableTest2026A",role:"admin"}});
  expect(apiResponse.status()).toBe(200);
  expect((await apiResponse.json()).role).toBe("student");
});

test("student login returns to saved research with a valid backend token",async({page,request})=>{
  test.skip(!studentEmail||!studentPassword||!backendBaseUrl,"Disposable student credentials and backend URL are required.");
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(studentEmail);
  await page.locator('input[name="password"]').fill(studentPassword);
  await page.getByRole("button",{name:"เข้าสู่ระบบ"}).click();
  await page.waitForURL(url=>url.pathname==="/account/saved");
  const loginResponse=await request.post(`${backendBaseUrl}/auth/login`,{form:{username:studentEmail,password:studentPassword}});
  expect(loginResponse.status()).toBe(200);
  const token=(await loginResponse.json()).access_token;
  const meResponse=await request.get(`${backendBaseUrl}/auth/me`,{headers:{Authorization:`Bearer ${token}`}});
  expect(meResponse.status()).toBe(200);
  expect((await meResponse.json()).email).toBe(studentEmail);
});

test("wrong password leaves the user on login without a session",async({page})=>{
  test.skip(!studentEmail,"Disposable student account is required.");
  await page.goto("/login");
  await page.locator('input[name="email"]').fill(studentEmail);
  await page.locator('input[name="password"]').fill("IncorrectPassword2026");
  await page.getByRole("button",{name:"เข้าสู่ระบบ"}).click();
  await expect(page.getByText("อีเมลหรือรหัสผ่านไม่ถูกต้อง")).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/login");
  expect((await page.context().cookies()).some(cookie=>cookie.httpOnly)).toBe(false);
});

test("logout clears the HttpOnly session and protects saved research",async({page})=>{
  test.skip(!studentEmail||!studentPassword,"Disposable student credentials are required.");
  await login(page,studentEmail,studentPassword,"/account/saved");
  expect((await page.context().cookies()).some(cookie=>cookie.httpOnly)).toBe(true);
  const logoutResponse=await page.request.post("/api/auth/logout");
  expect(logoutResponse.status()).toBe(200);
  expect((await page.context().cookies()).some(cookie=>cookie.httpOnly)).toBe(false);
  await page.goto("/account/saved");
  await page.waitForURL(url=>url.pathname==="/login");
});
