import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { CategoryForm } from "@/src/features/admin/category-form";
import { CategoryTable } from "@/src/features/admin/category-table";
import { getCategories } from "@/src/features/research/api";
import { hasSession } from "@/src/lib/api/session";

export default async function AdminCategoriesPage(){
  if(!await hasSession())redirect(`/login?next=${encodeURIComponent("/admin/categories")}`);
  const categories=await getCategories();
  return <DashboardShell><main className="dash-main"><p className="eyebrow">[ Supported administration ]</p><h1 className="title">Research categories</h1><p className="muted">The backend supports listing and creating categories only. It does not support edit, delete, slug, or category-detail operations. Permission to create is decided by the backend.</p><div className="dashboard-grid category-workspace"><section className="panel"><h2 className="section-title">Current index</h2>{!categories.ok?<StatePanel kind="error" title="Categories unavailable" detail={`${categories.error.message} [${categories.error.code}]`}/>:categories.data.length===0?<StatePanel kind="empty" title="No categories" detail="An administrator can create the first category using this page."/>:<CategoryTable categories={categories.data}/>}</section><CategoryForm/></div></main></DashboardShell>;
}
