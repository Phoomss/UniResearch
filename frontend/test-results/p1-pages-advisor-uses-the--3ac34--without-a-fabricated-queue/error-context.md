# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: p1-pages.spec.mjs >> advisor uses the known-ID reviewer entry without a fabricated queue
- Location: e2e\p1-pages.spec.mjs:17:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Research ID')

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e2]:
    - complementary [ref=f1e3]:
      - generic [ref=f1e4]: "2026"
      - navigation "ดัชนีงานวิจัย" [ref=f1e5]:
        - link "01" [ref=f1e6] [cursor=pointer]:
          - /url: /dashboard/student
        - link "02" [ref=f1e7] [cursor=pointer]:
          - /url: /research
        - link "03" [ref=f1e8] [cursor=pointer]:
          - /url: /dashboard/student/submit
      - generic [ref=f1e9]: INDEX RAIL
    - banner [ref=f1e10]:
      - link "UR UniResearch" [ref=f1e11] [cursor=pointer]:
        - /url: /
        - generic [ref=f1e12]: UR
        - generic [ref=f1e13]: UniResearch
      - generic [ref=f1e14]:
        - link "ค้นหา" [ref=f1e15] [cursor=pointer]:
          - /url: /research
          - text: ⌕
        - button "ออกจากระบบ" [ref=f1e16] [cursor=pointer]
    - main [ref=f1e17]:
      - paragraph [ref=f1e18]: "[ Advisor / administrator ]"
      - heading "Review workspace" [level=1] [ref=f1e19]
      - generic [ref=f1e20]:
        - generic [ref=f1e21]:
          - paragraph [ref=f1e22]: "[ Known ID ]"
          - heading "Open a review workspace" [level=2] [ref=f1e23]
          - generic [ref=f1e24]:
            - generic [ref=f1e25]: Research ID *
            - spinbutton [ref=f1e26]
            - generic [ref=f1e27]: The backend does not provide a review queue or assignment list.
          - button "Open research review" [ref=f1e28] [cursor=pointer]
        - status [ref=f1e29]:
          - strong [ref=f1e30]: "[ ] No review queue is available"
          - paragraph [ref=f1e31]: The backend does not provide a queue, assignment, or history endpoint. A known research ID must be supplied outside this application.
  - alert [ref=f1e32]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const studentEmail=process.env.E2E_STUDENT_EMAIL;
  4  | const studentPassword=process.env.E2E_STUDENT_PASSWORD;
  5  | const advisorEmail=process.env.E2E_ADVISOR_EMAIL;
  6  | const advisorPassword=process.env.E2E_ADVISOR_PASSWORD;
  7  | const adminEmail=process.env.E2E_ADMIN_EMAIL;
  8  | const adminPassword=process.env.E2E_ADMIN_PASSWORD;
  9  | 
  10 | async function login(page,email,password,next){await page.goto(`/login?next=${encodeURIComponent(next)}`);await page.locator('input[name="email"]').fill(email);await page.locator('input[name="password"]').fill(password);await page.locator('button[type="submit"]').click();await page.waitForURL(url=>url.pathname===next);}
  11 | 
  12 | test("authenticated account opens the canonical saved index",async({page})=>{
  13 |   test.skip(!studentEmail||!studentPassword,"Disposable account credentials are required.");
  14 |   await login(page,studentEmail,studentPassword,"/account/saved");await expect(page.getByRole("heading",{name:"Saved research"})).toBeVisible();
  15 | });
  16 | 
  17 | test("advisor uses the known-ID reviewer entry without a fabricated queue",async({page})=>{
  18 |   test.skip(!advisorEmail||!advisorPassword,"Disposable advisor credentials are required.");
> 19 |   await login(page,advisorEmail,advisorPassword,"/dashboard/reviewer");await expect(page.getByText("No review queue is available")).toBeVisible();await page.getByLabel("Research ID").fill("1");await page.getByRole("button",{name:"Open research review"}).click();await expect(page).toHaveURL(/\/advisor\/reviews\/1$/);
     |                                                                                                                                                                                        ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  20 | });
  21 | 
  22 | test("administrator opens totals and category management",async({page})=>{
  23 |   test.skip(!adminEmail||!adminPassword,"Disposable administrator credentials are required.");
  24 |   await login(page,adminEmail,adminPassword,"/admin");await expect(page.getByRole("heading",{name:"Archive totals"})).toBeVisible();await page.getByRole("link",{name:"Manage categories"}).click();await expect(page.getByRole("heading",{name:"Research categories"})).toBeVisible();
  25 | });
  26 | 
```