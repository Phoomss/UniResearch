import { notFound } from "next/navigation";
import { StatePanel } from "@/src/components/ui";
import { getCategories, getResearch, getResearchParticipants } from "@/src/features/research/api";
import { SubmissionForm } from "@/src/features/research/submission-form";

export default async function AdvisorEditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const [categories, participants, research] = await Promise.all([getCategories(), getResearchParticipants(), getResearch(id)]);
  if (!research.ok && research.error.status === 404) notFound();
  return <main className="admin-main submission-page"><header className="admin-page-heading"><p>พื้นที่ของฉัน <span>การแก้ไขจะเปลี่ยนสถานะกลับเป็น pending</span></p><h1>แก้ไขผลงานวิจัย</h1></header>{!research.ok ? <StatePanel kind="error" title="ไม่สามารถโหลดผลงานได้" detail={research.error.message} /> : !categories.ok ? <StatePanel kind="error" title="ไม่สามารถโหลดหมวดหมู่ได้" detail={categories.error.message} /> : !participants.ok ? <StatePanel kind="error" title="ไม่สามารถโหลดรายชื่อผู้เกี่ยวข้องได้" detail={participants.error.message} /> : <SubmissionForm categories={categories.data} participants={participants.data} research={research.data} returnPath="/advisor/submissions" formPath={`/advisor/submissions/${id}`} />}</main>;
}
