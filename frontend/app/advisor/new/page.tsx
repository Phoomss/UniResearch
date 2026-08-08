import { StatePanel } from "@/src/components/ui";
import { getCategories, getResearchParticipants } from "@/src/features/research/api";
import { SubmissionForm } from "@/src/features/research/submission-form";

export default async function AdvisorNewResearchPage() {
  const [categories, participants] = await Promise.all([getCategories(), getResearchParticipants()]);
  return <main className="admin-main submission-page"><header className="admin-page-heading"><p>พื้นที่ของฉัน <span>สร้างผลงานและส่งเข้าสู่คิวตรวจ</span></p><h1>ส่งผลงานวิจัยใหม่</h1></header><p className="muted">สถานะเริ่มต้นคือ <code>pending</code> และระบบจะส่งข้อมูลทั้งหมดในคำขอเดียว</p>{!categories.ok ? <StatePanel kind="error" title="ไม่สามารถโหลดหมวดหมู่ได้" detail={categories.error.message} /> : !participants.ok ? <StatePanel kind="error" title="ไม่สามารถโหลดรายชื่อผู้เกี่ยวข้องได้" detail={participants.error.message} /> : categories.data.length === 0 ? <StatePanel kind="empty" title="ยังไม่มีหมวดหมู่" detail="กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มหมวดหมู่ก่อนส่งผลงาน" /> : <SubmissionForm categories={categories.data} participants={participants.data} returnPath="/advisor/submissions" formPath="/advisor/new" />}</main>;
}
