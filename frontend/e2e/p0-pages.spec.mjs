import { expect, test } from "@playwright/test";

const researchId=process.env.E2E_RESEARCH_ID;
const studentEmail=process.env.E2E_STUDENT_EMAIL;
const studentPassword=process.env.E2E_STUDENT_PASSWORD;
const advisorEmail=process.env.E2E_ADVISOR_EMAIL;
const advisorPassword=process.env.E2E_ADVISOR_PASSWORD;

async function login(page,email,password){await page.goto("/login");await page.locator('form[data-hydrated="true"] button[type="submit"]').waitFor();await page.locator('input[name="email"]').fill(email);await page.locator('input[name="password"]').fill(password);await page.locator('button[type="submit"]').click();await page.waitForURL(url=>url.pathname!=="/login");}

test("guest research detail offers authentication and handles unknown IDs",async({page})=>{
  test.skip(!researchId,"E2E_RESEARCH_ID must identify seeded research in the disposable backend.");
  await page.goto(`/research/${researchId}`);await expect(page.getByRole("heading",{level:1})).toBeVisible();await expect(page.locator('a[href^="/login?next="]')).toBeVisible();
  await page.goto("/research/999999999");await expect(page.locator('a[href="/research"]')).toBeVisible();
});

test("student completes the verified multi-step research form",async({page})=>{
  test.skip(!studentEmail||!studentPassword,"Disposable student credentials are required.");
  await login(page,studentEmail,studentPassword);await page.goto("/student/research/new");await expect(page.getByRole("heading",{name:"ส่งผลงานวิจัย"})).toBeVisible();
  for(const viewport of [{width:1280,height:800},{width:768,height:900},{width:390,height:844}]){await page.setViewportSize(viewport);await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);}await page.setViewportSize({width:1280,height:800});
  await page.getByLabel("ชื่อผลงานภาษาไทย").fill("งานวิจัยทดสอบ E2E");await page.getByLabel("ชื่อผลงานภาษาอังกฤษ").fill("E2E Contract Research");await page.getByLabel("หมวดหมู่").selectOption({index:1});
  await page.getByRole("button",{name:"ดำเนินการต่อ"}).click();await expect(page.getByRole("heading",{name:"ผู้จัดทำ",exact:true})).toBeVisible();
  await expect(page.getByRole("combobox",{name:/ผู้จัดทำคนที่ 1/})).not.toHaveValue("");
  await page.getByRole("button",{name:"ดำเนินการต่อ"}).click();await page.getByRole("textbox",{name:"บทคัดย่อ"}).fill("บทคัดย่อสำหรับการทดสอบ workflow กับ backend จริง");
  await page.getByRole("button",{name:"ดำเนินการต่อ"}).click();await page.locator('input[name="cover_image"]').setInputFiles({name:"e2e-cover.png",mimeType:"image/png",buffer:Buffer.from("89504e470d0a1a0a7665726966696564","hex")});await page.locator('input[name="document"]').setInputFiles({name:"e2e-paper.pdf",mimeType:"application/pdf",buffer:Buffer.from("%PDF-1.7\nverified e2e")});await page.getByRole("button",{name:"ดำเนินการต่อ"}).click();
  await page.getByRole("button",{name:"ยืนยันและส่งผลงาน"}).evaluate(button=>button.click());await expect(page.getByRole("status")).toContainText("ส่งผลงานเรียบร้อยแล้ว");await expect(page.getByRole("link",{name:"ดูรายละเอียดผลงาน"})).toBeVisible();
});

test("advisor reviews a known research record",async({page})=>{
  test.skip(!researchId||!advisorEmail||!advisorPassword,"Disposable advisor credentials and seeded research are required.");
  await login(page,advisorEmail,advisorPassword);await page.goto(`/advisor/reviews/${researchId}`);await expect(page.getByRole("heading",{name:"Research review"})).toBeVisible();await page.getByLabel("Reviewer comment").fill("Reviewed through the verified E2E flow.");await page.getByRole("button",{name:"Review decision"}).click();await page.getByRole("button",{name:"Confirm decision"}).click();await expect(page.getByRole("status")).toContainText(/saved/i);
});
