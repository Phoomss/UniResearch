import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { hasSession } from "@/src/lib/api/session";
import { ResearchFlow } from "@/src/features/research-flow/research-flow";
import "./research-flow.css";

export default async function ResearchFlowPage() {
  if (!await hasSession()) redirect("/login?next=%2Fresearch-flow");
  return <DashboardShell active="04"><main className="dash-main">
    <p className="eyebrow">ทีมวิจัย AI อัตโนมัติ</p>
    <h1 className="title">ResearchFlow AI</h1>
    <p className="muted">วางแผน ค้นคว้า ตรวจสอบหลักฐาน และจัดทำรายงานวิจัยที่ตรวจสอบแหล่งอ้างอิงได้</p>
    <ResearchFlow />
  </main></DashboardShell>;
}
