import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root=new URL("../",import.meta.url);
const source=(path)=>readFileSync(new URL(path,root),"utf8");

test("saved research uses the favorites list without detail fan-out",()=>{
  const page=source("app/account/saved/page.tsx");
  const list=source("src/features/research/saved-research-list.tsx");
  assert.match(page,/listFavorites\(\)/);
  assert.doesNotMatch(page,/getResearch|fetch\(/);
  assert.match(list,/research_id/);
  assert.match(list,/prefetch=\{false\}/);
  assert.doesNotMatch(list,/titleTh|category|abstract/);
});

test("admin pages expose totals and category list-create only",()=>{
  const overview=source("app/admin/page.tsx");
  const categories=source("app/admin/categories/page.tsx");
  const form=source("src/features/admin/category-form.tsx");
  assert.match(overview,/getStats\(\)/);
  assert.doesNotMatch(overview,/getCategories|CategoryForm/);
  assert.match(categories,/getCategories\(\)/);
  assert.match(categories,/CategoryForm/);
  assert.match(form,/router\.refresh\(\)/);
  assert.match(form,/response\.status===403/);
  assert.doesNotMatch([overview,categories,form].join("\n"),/\/users|\/analytics/);
});

test("legacy dashboards consolidate into canonical supported routes",()=>{
  assert.match(source("app/dashboard/student/page.tsx"),/redirect\("\/account\/saved"\)/);
  assert.match(source("app/dashboard/admin/page.tsx"),/redirect\("\/admin"\)/);
  assert.match(source("app/dashboard/student/submit/page.tsx"),/redirect\("\/student\/research\/new"\)/);
});

test("reviewer landing validates a known positive ID without inventing a queue call",()=>{
  const page=source("app/dashboard/reviewer/page.tsx");
  const form=source("src/features/review/known-research-id-form.tsx");
  assert.match(page,/KnownResearchIdForm/);
  assert.match(form,/Number\.isInteger\(id\)/);
  assert.match(form,/id<1/);
  assert.match(form,/\/advisor\/reviews\/\$\{id\}/);
  assert.doesNotMatch([page,form].join("\n"),/fetch\(|axios/);
});

test("authentication uses a safe same-origin return path and no unsupported profile fields",()=>{
  const page=source("app/login/page.tsx");
  const forms=source("src/features/auth/auth-form.tsx");
  assert.match(page,/startsWith\("\/"\)/);
  assert.match(page,/!value\.startsWith\("\/\/"\)/);
  assert.match(forms,/nextPath/);
  assert.doesNotMatch(forms,/first_name|last_name|remember/);
  assert.match(forms,/tabIndex=\{-1\}/);
});

test("Playwright starts only when an explicit disposable P0 or P1 fixture is present",()=>{
  const config=source("playwright.config.mjs");
  assert.match(config,/E2E_ADMIN_EMAIL/);
  assert.match(config,/!hasDisposableFixtures\?undefined/);
});
