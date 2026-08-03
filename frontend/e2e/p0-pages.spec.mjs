import { expect, test } from "@playwright/test";

const researchId=process.env.E2E_RESEARCH_ID;
const studentEmail=process.env.E2E_STUDENT_EMAIL;
const studentPassword=process.env.E2E_STUDENT_PASSWORD;
const advisorEmail=process.env.E2E_ADVISOR_EMAIL;
const advisorPassword=process.env.E2E_ADVISOR_PASSWORD;

async function login(page,email,password){await page.goto("/login");await page.getByLabel(/email/i).fill(email);await page.getByLabel(/password/i).fill(password);await page.getByRole("button",{name:/login|เข้าสู่ระบบ/i}).click();await page.waitForLoadState("networkidle");}

test("guest research detail offers authentication and handles unknown IDs",async({page})=>{
  test.skip(!researchId,"E2E_RESEARCH_ID must identify seeded research in the disposable backend.");
  await page.goto(`/research/${researchId}`);await expect(page.getByRole("heading",{level:1})).toBeVisible();await expect(page.getByRole("link",{name:/sign in to continue/i})).toBeVisible();
  await page.goto("/research/999999999");await expect(page.getByText(/not found/i)).toBeVisible();
});

test("student submits the verified one-shot research form",async({page})=>{
  test.skip(!studentEmail||!studentPassword,"Disposable student credentials are required.");
  await login(page,studentEmail,studentPassword);await page.goto("/student/research/new");await expect(page.getByRole("heading",{name:"Submit research"})).toBeVisible();await page.getByLabel("Thai title").fill("งานวิจัยทดสอบ E2E");await page.getByLabel("English title").fill("E2E Contract Research");await page.getByLabel("Category").selectOption({index:1});await page.getByRole("button",{name:"Submit research"}).click();await expect(page).toHaveURL(/\/research\/\d+/);
});

test("advisor reviews a known research record",async({page})=>{
  test.skip(!researchId||!advisorEmail||!advisorPassword,"Disposable advisor credentials and seeded research are required.");
  await login(page,advisorEmail,advisorPassword);await page.goto(`/advisor/reviews/${researchId}`);await expect(page.getByRole("heading",{name:"Research review"})).toBeVisible();await page.getByLabel("Reviewer comment").fill("Reviewed through the verified E2E flow.");await page.getByRole("button",{name:"Review decision"}).click();await page.getByRole("button",{name:"Confirm decision"}).click();await expect(page.getByRole("status")).toContainText(/saved/i);
});
