import { FilePlus2 } from "lucide-react";
import { StatePanel } from "@/src/components/ui";
import { getCategories, getResearchParticipants } from "@/src/features/research/api";
import { SubmissionForm } from "@/src/features/research/submission-form";

export default async function AdvisorNewResearchPage() {
  const [categories, participants] = await Promise.all([getCategories(), getResearchParticipants()]);
  
  return (
    <main className="admin-main submission-page">
      {/* Page Heading */}
      <header className="admin-page-heading" style={{ marginBottom: "20px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
          <FilePlus2 size={16} />
          <span>พื้นที่ของฉัน</span>
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>ส่งผลงานวิจัยใหม่</h1>
      </header>

      <p className="muted" style={{ fontSize: "13.5px", marginBottom: "24px", color: "#6b7280" }}>
        สร้างผลงานวิจัยใหม่และส่งเข้าระบบ สถานะเริ่มต้นของผลงานที่เพิ่มจะเข้าสู่สถานะ <code>รอตรวจ (pending)</code> ทันที
      </p>

      {!categories.ok ? (
        <StatePanel kind="error" title="ไม่สามารถโหลดหมวดหมู่ได้" detail={categories.error.message} />
      ) : !participants.ok ? (
        <StatePanel kind="error" title="ไม่สามารถโหลดรายชื่อผู้เกี่ยวข้องได้" detail={participants.error.message} />
      ) : categories.data.length === 0 ? (
        <StatePanel kind="empty" title="ยังไม่มีหมวดหมู่" detail="กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มหมวดหมู่ก่อนส่งผลงาน" />
      ) : (
        <SubmissionForm 
          categories={categories.data} 
          participants={participants.data} 
          returnPath="/advisor/submissions" 
          formPath="/advisor/new" 
        />
      )}
    </main>
  );
}
