import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { ReviewForm } from "@/src/features/review/review-form";
import { hasSession } from "@/src/lib/api/session";

export default async function ReviewerDashboard(){if(!await hasSession())redirect("/login");return <DashboardShell><main className="dash-main"><p className="eyebrow">[ Advisor / Admin Action ]</p><h1 className="title">บันทึกผลการตรวจสอบ</h1><p className="muted">ระบบหลังบ้านไม่มี reviewer queue หรือ review history จึงต้องระบุรหัสงานวิจัยที่ทราบอยู่แล้ว ระบบหลังบ้านเป็นผู้ตรวจสิทธิ์ advisor/admin</p><div className="dashboard-grid" style={{marginTop:40}}><ReviewForm/><StatePanel kind="empty" title="ไม่มีคิวงานจาก API" detail="ไม่สามารถแสดงรายการรอตรวจ ค่าเฉลี่ยเวลา หรือจำนวนรีวิวได้โดยไม่สร้างข้อมูลสมมติ"/></div></main></DashboardShell>}
