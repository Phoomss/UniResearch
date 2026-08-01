import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getCategories } from "@/src/features/research/api";
import { SubmissionForm } from "@/src/features/research/submission-form";
import { hasSession } from "@/src/lib/api/session";

export default async function SubmissionPage(){if(!await hasSession())redirect("/login");const categories=await getCategories();return <DashboardShell active="03"><main className="dash-main"><h1 className="title" style={{color:"var(--mulberry)"}}>ส่งผลงานวิจัย</h1><p className="muted">แบบฟอร์มส่งตรงตาม multipart contract ของระบบหลังบ้าน ไม่มีการบันทึกร่างหรืออัปโหลด revision เพราะไม่มี endpoint รองรับ</p><div className="dashboard-grid">{categories.ok?<SubmissionForm categories={categories.data}/>:<StatePanel kind="error" title="โหลดหมวดหมู่ไม่สำเร็จ" detail={categories.error.message}/>}<aside><div className="panel" style={{borderLeft:"4px solid var(--mulberry)"}}><h2 className="section-title">ข้อควรทราบ</h2><p>สิทธิ์ส่งผลงานอนุญาตสำหรับบัญชี student และ admin โดยระบบหลังบ้านเป็นผู้ตัดสินสิทธิ์</p><p>ข้อจำกัดไฟล์ที่แสดงเป็นนโยบายของหน้าเว็บ ไม่ใช่การรับรองว่าระบบหลังบ้านบังคับใช้ข้อจำกัดเดียวกัน</p></div></aside></div></main></DashboardShell>}
