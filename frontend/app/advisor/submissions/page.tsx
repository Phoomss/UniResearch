import Link from "next/link";
import { FilePlus2, Files, CheckSquare } from "lucide-react";
import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, getMyResearch } from "@/src/features/research/api";

export default async function AdvisorSubmissionsPage() {
  const [researchResult, categoryResult] = await Promise.all([getMyResearch(), getCategories()]);
  const categories = categoryResult.ok ? categoryResult.data : [];
  const records = toAdvisorResearchRecords(researchResult.ok ? researchResult.data : [], categories);

  return (
    <main className="admin-main">
      {/* Page Heading */}
      <header className="admin-page-heading admin-heading-actions" style={{ marginBottom: "20px" }}>
        <div>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
            <Files size={16} />
            <span>พื้นที่ของฉัน</span>
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>ผลงานที่ฉันส่ง</h1>
        </div>
        <div>
          <Link className="admin-primary-action" href="/advisor/new" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <FilePlus2 size={17} />
            <span>ส่งผลงานใหม่</span>
          </Link>
        </div>
      </header>

      {/* Mini Stat Card */}
      <section className="adv-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 320px))", gap: "16px", marginBottom: "24px" }}>
        <div className="adv-stat-card flex-row purple-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-purple-light" style={{ width: "40px", height: "40px" }}>
            <CheckSquare size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>งานที่ส่งทั้งหมด</span>
            <strong className="adv-card-value" style={{ fontSize: "22px" }}>{records.length}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>คุณเป็นผู้ส่ง/ผู้เขียนผลงานนี้</span>
          </div>
        </div>
      </section>

      <p className="muted" style={{ fontSize: "13.5px", marginBottom: "20px", color: "#6b7280" }}>
        หน้าสำหรับจัดการเอกสารผลงานวิจัยที่คุณเป็นผู้เขียนร่วมหรือเป็นผู้ส่งขึ้นคิวระบบ 
        (การถูกจับคู่เป็นอาจารย์ที่ปรึกษาอย่างเดียวโดยไม่ได้เป็นผู้ร่วมเขียนจะไม่รวมอยู่ในรายการหน้านี้)
      </p>

      {/* Submitted Publications Manager */}
      <AdminResearchManager 
        records={records} 
        reviewBasePath="/advisor/reviews" 
        editBasePath="/advisor/submissions" 
        allowReview={false} 
        allowManage 
      />
    </main>
  );
}
