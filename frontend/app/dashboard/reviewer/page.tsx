import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { KnownResearchIdForm } from "@/src/features/review/known-research-id-form";
import { hasSession } from "@/src/lib/api/session";

export default async function ReviewerDashboard(){
  if(!await hasSession())redirect("/login");
  return <DashboardShell active="02"><main className="dash-main"><p className="eyebrow">[ Advisor / administrator ]</p><h1 className="title">Review workspace</h1><div className="dashboard-grid"><KnownResearchIdForm/><StatePanel kind="empty" title="No review queue is available" detail="The backend does not provide a queue, assignment, or history endpoint. A known research ID must be supplied outside this application."/></div></main></DashboardShell>;
}
