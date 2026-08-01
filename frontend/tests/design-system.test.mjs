import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const routes = ["../app/page.tsx","../app/login/page.tsx","../app/register/page.tsx","../app/research/page.tsx","../app/research/[id]/page.tsx","../app/dashboard/student/page.tsx","../app/dashboard/student/submit/page.tsx","../app/dashboard/reviewer/page.tsx","../app/dashboard/admin/page.tsx"];

test("Mulberry Library tokens and responsive rail are defined", () => {
  for (const token of ["--paper", "--mulberry", "--periwinkle", "--rail"]) assert.match(css, new RegExp(token));
  assert.match(css, /@media \(max-width:900px\)/);
  assert.match(css, /\.rail \{/);
});

test("all Phase 2 routes are present and have default exports", () => {
  for (const path of routes) assert.match(readFileSync(new URL(path, import.meta.url), "utf8"), /export default/);
});

test("server pages have no scattered raw network calls", () => {
  for (const path of routes) assert.doesNotMatch(readFileSync(new URL(path, import.meta.url), "utf8"), /fetch\(|axios/);
});
