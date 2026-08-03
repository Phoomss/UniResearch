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

test("P0 pages use only verified backend-facing modules and preserve authorization states",()=>{
  const reviewPage=source("app/advisor/reviews/[id]/page.tsx");
  const detailPage=source("app/research/[id]/page.tsx");
  const submissionPage=source("app/student/research/new/page.tsx");
  const reviewForm=source("src/features/review/review-form.tsx");
  const submissionForm=source("src/features/research/submission-form.tsx");
  assert.match(reviewPage,/getResearch\(id\)/);
  assert.match(reviewForm,/\/api\/research\/\$\{researchId\}\/review/);
  assert.match(reviewForm,/response\.status===403/);
  assert.match(detailPage,/ResearchActions/);
  assert.match(submissionPage,/getCategories\(\)/);
  assert.match(submissionForm,/response\.status===401/);
  assert.match(submissionForm,/response\.status===403/);
  assert.doesNotMatch([reviewPage,detailPage,submissionPage].join("\n"),/fetch\(|axios/);
});

test("P0 route boundaries cover loading, failure, empty, and not-found surfaces",()=>{
  for(const path of ["app/research/[id]/loading.tsx","app/research/[id]/error.tsx","app/advisor/reviews/[id]/loading.tsx","app/advisor/reviews/[id]/error.tsx","app/advisor/reviews/[id]/not-found.tsx","app/student/research/new/loading.tsx","app/student/research/new/error.tsx"]) assert.match(source(path),/export default/);
  assert.match(source("app/student/research/new/page.tsx"),/categories\.data\.length===0/);
});

test("P0 forms expose programmatic labels and handlers reject non-positive IDs",()=>{
  const ui=source("src/components/ui.tsx");
  assert.match(ui,/htmlFor=\{controlId\}/);
  for(const path of ["app/api/research/[id]/download/route.ts","app/api/research/[id]/favorite/route.ts","app/api/research/[id]/review/route.ts"]){
    assert.match(source(path),/id<1/);
  }
  assert.match(source("app/api/research/[id]/review/route.ts"),/comment_text\.trim\(\)/);
});
