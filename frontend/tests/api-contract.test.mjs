import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root=new URL("../",import.meta.url);
const openapi=JSON.parse(readFileSync(new URL("docs/backend-openapi.json",root),"utf8"));
const source=(path)=>readFileSync(new URL(path,root),"utf8");

test("integrated backend paths and methods exist in the contract",()=>{
  for(const [path,method] of [["/auth/login","post"],["/auth/register","post"],["/research/search","get"],["/research/{research_id}","get"],["/research/","post"],["/research/{research_id}/download","post"],["/research/{research_id}/review","post"],["/favorites/{research_id}","post"],["/categories/","post"],["/stats/","get"]]) assert.ok(openapi.paths[path]?.[method],`${method.toUpperCase()} ${path}`);
});

test("multipart proxy preserves exact backend field names",()=>{
  const route=source("app/api/research/route.ts");
  for(const field of ["title_th","title_en","category_id","abstract","department","work_type","academic_year","keywords","author_ids","advisor_ids","cover_image","document"]) assert.match(route,new RegExp(`\\b${field}\\b`));
  assert.doesNotMatch(route,/multipart\/form-data/);
});

test("session is HttpOnly and no browser storage contains JWT",()=>{
  const session=source("src/lib/api/session.ts");
  assert.match(session,/httpOnly:true/);assert.match(session,/sameSite:"lax"/);
  const all=["src/features/auth/auth-form.tsx","src/features/research/actions.tsx","src/features/research/submission-form.tsx"].map(source).join("\n");
  assert.doesNotMatch(all,/localStorage|sessionStorage|access_token/);
});

test("unsupported API paths are not invented",()=>{
  const files=["src/features/research/api.ts","app/api/auth/login/route.ts","app/api/auth/register/route.ts"].map(source).join("\n");
  assert.doesNotMatch(files,/\/auth\/(refresh|google|logout|me)|\/users|\/revisions|\/notifications/);
});
