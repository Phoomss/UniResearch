# UniResearch Frontend App Cleanup

## Role

Act as a senior frontend developer.

Analyze and safely reformat the frontend pages in:

```text
D:\Project-69\UniResearch\frontend\app
```

Many files may contain minified or one-line code. Convert them into readable, maintainable clean code without changing existing behavior.

## Objectives

1. Inspect every source file under `frontend/app`.
2. Find pages or related components containing one-line, minified, compressed, or poorly formatted code.
3. Reformat those files into clean, readable code.
4. Preserve all existing UI, logic, routes, API calls, data structures, styles, and behavior.
5. Validate the frontend after formatting.
6. Create a short Thai report of the changes.

## Safety Rules

Run this first:

```bash
git status
```

Follow these rules:

* Preserve all existing user changes.
* Do not use destructive Git commands.
* Do not use:

  * `git reset --hard`
  * `git clean -fd`
  * `git checkout .`
  * `git restore .`
* Do not delete files.
* Do not install or upgrade packages.
* Do not rewrite the application architecture.
* Do not change routes or folder names.
* Do not change API endpoints or request payloads.
* Do not change business logic.
* Do not change displayed text.
* Do not redesign the UI.
* Do not change CSS classes unless required only for formatting.
* Do not modify generated folders such as:

  * `node_modules`
  * `.next`
  * `dist`
  * `build`
  * `coverage`
  * cache directories

## Scope

Primary scope:

```text
frontend/app
```

Inspect relevant source files such as:

* `page.tsx`
* `page.jsx`
* `page.ts`
* `page.js`
* `layout.tsx`
* `loading.tsx`
* `error.tsx`
* `not-found.tsx`
* route-level components
* components located inside route folders
* files directly imported by pages when they also contain one-line or unreadable code

Do not modify unrelated frontend or backend files unless required to validate imports.

## Analysis

For each file under `frontend/app`, determine:

* File purpose
* Route represented by the file
* Main component
* Imported components
* State and hooks used
* Event handlers
* API or service connections
* Whether the file is already readable
* Whether the file contains one-line or compressed code
* Whether formatting can be changed without affecting behavior

Only modify files that require formatting or small safe clean-code improvements.

## Formatting Requirements

Apply the following rules:

* One statement per line.
* Use consistent indentation.
* Split long JSX elements across multiple lines.
* Split JSX props across multiple lines when needed.
* Format nested components clearly.
* Format objects and arrays across multiple lines when long.
* Format chained methods clearly.
* Separate logical code sections with appropriate blank lines.
* Keep imports readable and organized.
* Keep hooks near the top of the component.
* Keep handlers separate from JSX when they already exist as functions.
* Preserve comments that explain important behavior.
* Remove clearly unused imports only when confirmed safe.
* Remove duplicate blank lines.
* Keep naming consistent with the existing codebase.

Example:

Before:

```tsx
export default function Page(){const [open,setOpen]=useState(false);return <main><button onClick={()=>setOpen(!open)}>Open</button>{open&&<div>Content</div>}</main>}
```

After:

```tsx
export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <button onClick={() => setOpen(!open)}>
        Open
      </button>

      {open && <div>Content</div>}
    </main>
  );
}
```

## Allowed Safe Improvements

You may perform these improvements when they do not change behavior:

* Reformat minified or one-line code.
* Organize imports.
* Remove confirmed unused imports.
* Add missing semicolons according to project style.
* Add safe TypeScript types when obvious.
* Move large static arrays or objects outside the component in the same file.
* Replace deeply nested JSX formatting with readable indentation.
* Extract a small local helper function inside the same file.
* Replace an inline callback with a named handler only when behavior stays identical.
* Use early returns when the result is exactly equivalent.
* Add descriptive comments only where complex code needs explanation.

## Forbidden Changes

Do not:

* Rewrite entire pages.
* Split every page into new components.
* Move files to new folders.
* Rename exported components.
* Rename routes.
* Change dynamic route parameters.
* Change React state behavior.
* Change hook dependencies without clear evidence.
* Change API contracts.
* Change authentication behavior.
* Change authorization or role checks.
* Change form validation rules.
* Change navigation behavior.
* Change local storage keys.
* Change cookies or token names.
* Replace libraries.
* convert server components to client components or vice versa.
* Add or remove `"use client"` unless absolutely required to preserve an existing valid implementation.
* add features that were not requested.

## Project Formatter

Inspect:

```text
frontend/package.json
```

Also inspect existing configuration such as:

* `.prettierrc`
* `prettier.config.*`
* `eslint.config.*`
* `.eslintrc.*`
* `tsconfig.json`

Use the existing project style.

If a Prettier script exists, prefer formatting only the relevant files.

Examples:

```bash
npm run format
npm run lint
npm run typecheck
npm run build
```

Run only scripts that actually exist in `package.json`.

Use the package manager indicated by the lock file:

* `package-lock.json` → npm
* `pnpm-lock.yaml` → pnpm
* `yarn.lock` → Yarn

Do not install missing tools.

## Validation

After editing:

1. Review changes:

```bash
git diff -- frontend/app
```

2. Confirm that changes are formatting-focused.

3. Confirm that no routes, API endpoints, UI content, or business logic were unintentionally changed.

4. Run available validation scripts from `frontend/package.json`.

5. Record the real result of each command.

Never report a command as successful when it failed or was not executed.

If an error existed before the formatting changes, clearly identify it as a pre-existing issue when this can be verified.

## Required Report

Create or update:

```text
D:\Project-69\UniResearch\frontend\docs\FRONTEND_APP_CLEANUP_TH.md
```

Write the report in clear Thai.

Use this structure:

```markdown
# รายงานการจัดรูปแบบโค้ด Frontend App

## 1. สรุปภาพรวม

- จำนวนไฟล์ที่ตรวจสอบ
- จำนวนไฟล์ที่แก้ Formatting
- จำนวนไฟล์ที่ไม่ต้องแก้
- ผลการ Build
- ผลการ Lint
- ผลการ Type Check

## 2. โครงสร้าง Route และ Page

| Route | Path ไฟล์ | หน้าที่ | Component ที่เชื่อมต่อ |
|---|---|---|---|

## 3. ไฟล์ที่แก้ไข

| Path ไฟล์ | ปัญหาก่อนแก้ | สิ่งที่ปรับ | เปลี่ยน Logic หรือไม่ |
|---|---|---|---|

## 4. ไฟล์ที่ตรวจสอบแต่ไม่แก้ไข

| Path ไฟล์ | เหตุผลที่ไม่แก้ |
|---|---|

## 5. การเชื่อมโยงของแต่ละ Page

| Page | Import สำคัญ | State / Hook | API / Service | Route ที่เชื่อมต่อ |
|---|---|---|---|---|

## 6. ปัญหาที่พบ

### ปัญหาระดับสูง

### ปัญหาระดับกลาง

### ปัญหาระดับต่ำ

## 7. ผลการตรวจสอบ

| คำสั่ง | ผลลัพธ์ | Error หรือ Warning |
|---|---|---|

## 8. งานที่ควรทำต่อ

- งานที่จำเป็น
- ไฟล์ที่เกี่ยวข้อง
- เหตุผล
```

Use real file paths and actual findings.

Do not claim that a page works only because the file exists.

## Completion Criteria

The task is complete only when:

1. Every relevant source file under `frontend/app` has been inspected.
2. One-line or unreadable page code has been reformatted.
3. Existing behavior has been preserved.
4. No unnecessary architecture or feature changes were made.
5. Available lint, type-check, and build scripts were run.
6. `frontend/docs/FRONTEND_APP_CLEANUP_TH.md` was created.
7. The final response includes:

   * Files inspected
   * Files modified
   * Validation results
   * Remaining errors
   * Report path

Start now and complete the work. Do not stop after presenting a plan.
