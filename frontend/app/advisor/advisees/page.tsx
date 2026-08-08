import { UsersRound, FileCheck } from "lucide-react";
import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, getCurrentUser, searchResearch } from "@/src/features/research/api";

export default async function AdvisorAdviseesPage() {
  const [researchResult, categoryResult, userResult] = await Promise.all([
    searchResearch({}), 
    getCategories(), 
    getCurrentUser()
  ]);
  
  const all = researchResult.ok ? researchResult.data : [];
  const userId = userResult.ok ? userResult.data.id : -1;
  const advised = all.filter((item) => item.advisors?.some((advisor) => advisor.user_id === userId));
  const categories = categoryResult.ok ? categoryResult.data : [];
  const records = toAdvisorResearchRecords(advised, categories);

  return (
    <main className="admin-main">
      {/* Page Heading */}
      <header className="admin-page-heading" style={{ marginBottom: "20px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
          <UsersRound size={16} />
          <span>พื้นที่ให้คำปรึกษา</span>
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>งานในความดูแล</h1>
      </header>

      {/* Mini Stat Card */}
      <section className="adv-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 320px))", gap: "16px", marginBottom: "24px" }}>
        <div className="adv-stat-card flex-row blue-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-blue-light" style={{ width: "40px", height: "40px" }}>
            <FileCheck size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>งานในความดูแลทั้งหมด</span>
            <strong className="adv-card-value" style={{ fontSize: "22px" }}>{records.length}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>คุณถูกระบุเป็นอาจารย์ที่ปรึกษา</span>
          </div>
        </div>
      </section>

      <p className="muted" style={{ fontSize: "13.5px", marginBottom: "20px", color: "#6b7280" }}>
        รายการนี้แสดงผลงานวิจัยของนักศึกษาที่บัญชีของคุณได้รับการระบุเป็นอาจารย์ที่ปรึกษาหลักหรืออาจารย์ที่ปรึกษาร่วม 
        การเป็นอาจารย์ที่ปรึกษาจะให้สิทธิ์ในการเข้าถึงคิวและบันทึกข้อเสนอแนะในการตรวจสอบประเมินได้
      </p>

      {/* Advised Publications Manager */}
      <AdminResearchManager records={records} reviewBasePath="/advisor/reviews" />
    </main>
  );
}
