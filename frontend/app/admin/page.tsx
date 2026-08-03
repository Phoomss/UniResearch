import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { ButtonLink, StatePanel } from "@/src/components/ui";
import { getStats } from "@/src/features/research/api";
import { hasSession } from "@/src/lib/api/session";

export default async function AdminOverview(){
  if(!await hasSession())redirect(`/login?next=${encodeURIComponent("/admin")}`);
  const stats=await getStats();
  return <DashboardShell><main className="dash-main"><p className="eyebrow">[ Repository overview ]</p><h1 className="title">Archive totals</h1><p className="muted">These four totals are public backend statistics. Token presence opens this workspace, but does not prove an administrator role; protected mutations remain backend-authorized.</p>{stats.ok?<div className="kpi-grid admin-metrics"><div className="kpi">Users<strong>{stats.data.total_users.toLocaleString()}</strong></div><div className="kpi">Research works<strong>{stats.data.total_research_works.toLocaleString()}</strong></div><div className="kpi">Views<strong>{stats.data.total_views.toLocaleString()}</strong></div><div className="kpi">Downloads<strong>{stats.data.total_downloads.toLocaleString()}</strong></div></div>:<StatePanel kind="error" title="Statistics unavailable" detail={`${stats.error.message} [${stats.error.code}]`}/>}<section className="admin-callout rule"><div><p className="eyebrow">[ Available management ]</p><h2 className="section-title">Category index</h2><p className="muted">List categories and, when the backend confirms administrator permission, create a category.</p></div><ButtonLink href="/admin/categories">Manage categories</ButtonLink></section></main></DashboardShell>;
}
