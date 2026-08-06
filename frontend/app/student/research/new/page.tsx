import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getCategories, getResearchParticipants } from "@/src/features/research/api";
import { SubmissionForm } from "@/src/features/research/submission-form";
import { hasSession } from "@/src/lib/api/session";

export default async function NewResearchPage() {
  if (!await hasSession()) redirect(`/login?next=${encodeURIComponent("/student/research/new")}`);

  const [categories, participants] = await Promise.all([getCategories(), getResearchParticipants()]);

  return (
    <DashboardShell active="03">
      <main className="dash-main submission-page">
        <p className="eyebrow">[ Student / administrator action ]</p>
        <h1 className="title">ส่งผลงานวิจัย</h1>
        <p className="muted">
          กรอกข้อมูล ตรวจสอบ และส่งเป็นคำขอเดียวไปยังระบบหลังบ้าน สถานะเริ่มต้นคือ <code>pending</code> และไม่มีการบันทึกร่าง
        </p>

        {!categories.ok ? (
          <StatePanel
            kind="error"
            title="ไม่สามารถโหลดหมวดหมู่ได้"
            detail={categories.error.message}
          />
        ) : !participants.ok ? (
          <StatePanel
            kind="error"
            title="ไม่สามารถโหลดรายชื่อผู้จัดทำและอาจารย์ได้"
            detail={participants.error.message}
          />
        ) : categories.data.length === 0 ? (
          <StatePanel
            kind="empty"
            title="ยังไม่มีหมวดหมู่"
            detail="Backend กำหนดให้ต้องมีหมวดหมู่ กรุณาให้ผู้ดูแลระบบสร้างหมวดหมู่ก่อนส่งผลงาน"
          />
        ) : (
          <SubmissionForm
            categories={categories.data}
            participants={participants.data}
          />
        )}
      </main>
    </DashboardShell>
  );
}
