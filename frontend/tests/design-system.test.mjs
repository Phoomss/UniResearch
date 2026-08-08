import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const routes = ["../app/page.tsx","../app/login/page.tsx","../app/register/page.tsx","../app/research/page.tsx","../app/research/[id]/page.tsx","../app/student/research/new/page.tsx","../app/advisor/reviews/[id]/page.tsx","../app/account/saved/page.tsx","../app/admin/page.tsx","../app/admin/categories/page.tsx","../app/dashboard/student/page.tsx","../app/dashboard/student/submit/page.tsx","../app/dashboard/reviewer/page.tsx","../app/dashboard/admin/page.tsx"];

test("Mulberry Library tokens and responsive rail are defined", () => {
  for (const token of ["--paper", "--mulberry", "--periwinkle", "--rail"]) assert.match(css, new RegExp(token));
  assert.match(css, /@media \(max-width:900px\)/);
  assert.match(css, /\.rail \{/);
  assert.match(css, /\.review-workspace/);
  assert.match(css, /\.status-message\.forbidden/);
  assert.match(css, /@media \(max-width:1120px\)/);
  assert.match(css, /\.state-title/);
});

test("shared fields expose hint relationships and loading states announce context",()=>{
  const ui=readFileSync(new URL("../src/components/ui.tsx",import.meta.url),"utf8");
  assert.match(ui,/aria-describedby/);
  assert.match(ui,/field-hint/);
  assert.match(ui,/className="sr-only"/);
  assert.match(ui,/state-\$\{kind\}/);
});

test("all Phase 2 routes are present and have default exports", () => {
  for (const path of routes) assert.match(readFileSync(new URL(path, import.meta.url), "utf8"), /export default/);
});

test("server pages have no scattered raw network calls", () => {
  for (const path of routes) assert.doesNotMatch(readFileSync(new URL(path, import.meta.url), "utf8"), /fetch\(|axios/);
});
