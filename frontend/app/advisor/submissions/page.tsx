import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, getMyResearch } from "@/src/features/research/api";

export default async function AdvisorSubmissionsPage() {
  const [researchResult, categoryResult] = await Promise.all([getMyResearch(), getCategories()]);
  const categories = categoryResult.ok ? categoryResult.data : [];
  const records = toAdvisorResearchRecords(researchResult.ok ? researchResult.data : [], categories);
  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-heading-actions"><div><p>พื้นที่ของฉัน <span>ผลงานที่ส่งหรือเป็นผู้เขียน</span></p><h1>ผลงานที่ฉันส่ง</h1></div><div><Link className="admin-primary-action" href="/advisor/new"><FilePlus2 size={17} />ส่งผลงานใหม่</Link></div></header>
      <p className="muted">การเป็นอาจารย์ที่ปรึกษาเพียงอย่างเดียวจะไม่ทำให้งานปรากฏในรายการนี้ และไม่ให้สิทธิ์แก้ไขหรือลบงาน</p>
      <AdminResearchManager records={records} reviewBasePath="/advisor/reviews" editBasePath="/advisor/submissions" allowReview={false} allowManage />
    </main>
  );
}
