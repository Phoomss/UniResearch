import { redirect, notFound } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { getCategories, getResearchParticipants, getResearch } from "@/src/features/research/api";
import { SubmissionForm } from "@/src/features/research/submission-form";
import { hasSession } from "@/src/lib/api/session";

export default async function EditResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!await hasSession()) {
    const rawId = (await params).id;
    redirect(`/login?next=${encodeURIComponent(`/student/research/edit/${rawId}`)}`);
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const [categories, participants, researchResult] = await Promise.all([
    getCategories(),
    getResearchParticipants(),
    getResearch(id),
  ]);

  if (!researchResult.ok) {
    if (researchResult.error.status === 404) {
      notFound();
    }
    return (
      <DashboardShell active="03">
        <main className="dash-main submission-page">
          <h1 className="title">แก้ไขผลงานวิจัย</h1>
          <StatePanel
            kind="error"
            title="ไม่สามารถโหลดข้อมูลผลงานวิจัยได้"
            detail={researchResult.error.message}
          />
        </main>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell active="03">
      <main className="dash-main submission-page">
        <p className="eyebrow">[ Student / administrator action ]</p>
        <h1 className="title">แก้ไขผลงานวิจัย</h1>
        <p className="muted">
          แก้ไขรายละเอียดผลงานวิจัย ตรวจสอบ และส่งข้อมูลที่ปรับปรุงแล้วไปยังระบบหลังบ้าน สถานะผลงานวิจัยจะกลับเป็น <code>pending</code>
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
        ) : (
          <SubmissionForm
            categories={categories.data}
            participants={participants.data}
            research={researchResult.data}
          />
        )}
      </main>
    </DashboardShell>
  );
}
