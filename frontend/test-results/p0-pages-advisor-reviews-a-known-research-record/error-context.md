# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: p0-pages.spec.mjs >> advisor reviews a known research record
- Location: e2e\p0-pages.spec.mjs:22:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Reviewer comment')

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e2]:
    - complementary [ref=f2e3]:
      - generic [ref=f2e4]: "2026"
      - navigation "ดัชนีงานวิจัย" [ref=f2e5]:
        - link "01" [ref=f2e6] [cursor=pointer]:
          - /url: /dashboard/student
        - link "02" [ref=f2e7] [cursor=pointer]:
          - /url: /research
        - link "03" [ref=f2e8] [cursor=pointer]:
          - /url: /dashboard/student/submit
      - generic [ref=f2e9]: INDEX RAIL
    - banner [ref=f2e10]:
      - link "UR UniResearch" [ref=f2e11] [cursor=pointer]:
        - /url: /
        - generic [ref=f2e12]: UR
        - generic [ref=f2e13]: UniResearch
      - generic [ref=f2e14]:
        - link "ค้นหา" [ref=f2e15] [cursor=pointer]:
          - /url: /research
          - text: ⌕
        - button "ออกจากระบบ" [ref=f2e16] [cursor=pointer]
    - main [ref=f2e17]:
      - paragraph [ref=f2e18]: "[ Advisor / administrator workspace ]"
      - heading "Research review" [level=1] [ref=f2e19]
      - generic [ref=f2e20]:
        - article [ref=f2e21]:
          - generic [ref=f2e22]:
            - generic [ref=f2e23]: E2E Science
            - generic [ref=f2e24]: RES-0001
          - heading "งานวิจัยทดสอบระบบ" [level=2] [ref=f2e25]
          - paragraph [ref=f2e26]: Disposable E2E Research
          - generic [ref=f2e27]: pending
          - generic [ref=f2e28]:
            - heading "Abstract" [level=3] [ref=f2e29]
            - paragraph [ref=f2e30]: A disposable research record for isolated browser testing.
          - generic [ref=f2e31]:
            - generic [ref=f2e32]:
              - term [ref=f2e33]: Department
              - definition [ref=f2e34]: ไม่ระบุ
            - generic [ref=f2e35]:
              - term [ref=f2e36]: Year
              - definition [ref=f2e37]: ไม่ระบุ
          - region "Research actions" [ref=f2e38]:
            - generic [ref=f2e39]:
              - button "Download document" [disabled] [ref=f2e40]
              - button "Save research" [ref=f2e41] [cursor=pointer]
            - status [ref=f2e42]: No document file is available for this record.
        - generic [ref=f2e43]:
          - paragraph [ref=f2e44]: "[ Verified review action ]"
          - heading "Record a decision" [level=2] [ref=f2e45]
          - generic [ref=f2e46]:
            - generic [ref=f2e47]: Decision *
            - combobox [ref=f2e48]:
              - option "Approve" [selected]
              - option "Reject"
          - generic [ref=f2e49]:
            - generic [ref=f2e50]: Reviewer comment *
            - textbox [ref=f2e51]
          - paragraph [ref=f2e52]: Only approval and rejection are exposed. Scoring, revision requests, queue assignment, and review history are not supported by the backend.
          - button "Review decision" [ref=f2e53] [cursor=pointer]
  - alert [ref=f2e54]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const researchId=process.env.E2E_RESEARCH_ID;
  4  | const studentEmail=process.env.E2E_STUDENT_EMAIL;
  5  | const studentPassword=process.env.E2E_STUDENT_PASSWORD;
  6  | const advisorEmail=process.env.E2E_ADVISOR_EMAIL;
  7  | const advisorPassword=process.env.E2E_ADVISOR_PASSWORD;
  8  | 
  9  | async function login(page,email,password){await page.goto("/login");await page.locator('input[name="email"]').fill(email);await page.locator('input[name="password"]').fill(password);await page.locator('button[type="submit"]').click();await page.waitForURL(url=>url.pathname!=="/login");}
  10 | 
  11 | test("guest research detail offers authentication and handles unknown IDs",async({page})=>{
  12 |   test.skip(!researchId,"E2E_RESEARCH_ID must identify seeded research in the disposable backend.");
  13 |   await page.goto(`/research/${researchId}`);await expect(page.getByRole("heading",{level:1})).toBeVisible();await expect(page.locator('a[href^="/login?next="]')).toBeVisible();
  14 |   await page.goto("/research/999999999");await expect(page.locator('a[href="/research"]')).toBeVisible();
  15 | });
  16 | 
  17 | test("student submits the verified one-shot research form",async({page})=>{
  18 |   test.skip(!studentEmail||!studentPassword,"Disposable student credentials are required.");
  19 |   await login(page,studentEmail,studentPassword);await page.goto("/student/research/new");await expect(page.getByRole("heading",{name:"Submit research"})).toBeVisible();await page.getByLabel("Thai title").fill("งานวิจัยทดสอบ E2E");await page.getByLabel("English title").fill("E2E Contract Research");await page.getByLabel("Category").selectOption({index:1});await page.getByRole("button",{name:"Submit research"}).click();await expect(page).toHaveURL(/\/research\/\d+/);
  20 | });
  21 | 
  22 | test("advisor reviews a known research record",async({page})=>{
  23 |   test.skip(!researchId||!advisorEmail||!advisorPassword,"Disposable advisor credentials and seeded research are required.");
> 24 |   await login(page,advisorEmail,advisorPassword);await page.goto(`/advisor/reviews/${researchId}`);await expect(page.getByRole("heading",{name:"Research review"})).toBeVisible();await page.getByLabel("Reviewer comment").fill("Reviewed through the verified E2E flow.");await page.getByRole("button",{name:"Review decision"}).click();await page.getByRole("button",{name:"Confirm decision"}).click();await expect(page.getByRole("status")).toContainText(/saved/i);
     |                                                                                                                                                                                                                             ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  25 | });
  26 | 
```