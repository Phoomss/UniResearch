import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { hasSession } from "@/src/lib/api/session";

export default async function ReviewerDashboard(){
  if(!await hasSession())redirect("/login");
  return <DashboardShell active="02"><main className="dash-main"><p className="eyebrow">[ Advisor / administrator ]</p><h1 className="title">Review workspace</h1><StatePanel kind="empty" title="No review queue is available" detail="The backend does not provide a queue or assignment endpoint. Open a known research review URL in the form /advisor/reviews/{id}."/></main></DashboardShell>;
}
