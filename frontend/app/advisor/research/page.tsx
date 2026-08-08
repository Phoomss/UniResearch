import Link from "next/link";
import { FilePlus2, BookOpen, Layers, CalendarRange } from "lucide-react";
import { AdminResearchManager } from "@/src/features/admin/admin-research-manager";
import { toAdvisorResearchRecords } from "@/src/features/advisor/advisor-data";
import { getCategories, searchResearch } from "@/src/features/research/api";

export default async function AdvisorResearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = (await searchParams).q?.trim();
  const [researchResult, categoryResult] = await Promise.all([searchResearch({ q: query }), getCategories()]);
  const categories = categoryResult.ok ? categoryResult.data : [];
  const records = toAdvisorResearchRecords(researchResult.ok ? researchResult.data : [], categories);

  // Extract quick stats for the database library
  const totalWorks = records.length;
  const uniqueCategoriesCount = new Set(records.map(r => r.category)).size;
  const uniqueYearsCount = new Set(records.map(r => r.year)).size;

  return (
    <main className="admin-main">
      {/* Page Heading */}
      <header className="admin-page-heading admin-heading-actions" style={{ marginBottom: "28px" }}>
        <div>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
            <BookOpen size={16} />
            <span>คลังผลงานวิจัย</span>
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>ผลงานวิจัยทั้งหมด</h1>
        </div>
        <div>
          <Link className="admin-primary-action" href="/advisor/new" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <FilePlus2 size={17} />
            <span>ส่งผลงานใหม่</span>
          </Link>
        </div>
      </header>

      {/* Mini Stats Summary Widgets */}
      <section className="adv-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {/* Total papers */}
        <div className="adv-stat-card flex-row blue-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-blue-light" style={{ width: "40px", height: "40px" }}>
            <BookOpen size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>ผลงานวิจัยรวม</span>
            <strong className="adv-card-value" style={{ fontSize: "22px" }}>{totalWorks}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>รายการทั้งหมดในระบบ</span>
          </div>
        </div>

        {/* Categories */}
        <div className="adv-stat-card flex-row purple-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-purple-light" style={{ width: "40px", height: "40px" }}>
            <Layers size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>หมวดหมู่ที่พบ</span>
            <strong className="adv-card-value" style={{ fontSize: "22px" }}>{uniqueCategoriesCount}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>สาขาการวิจัย</span>
          </div>
        </div>

        {/* Years range */}
        <div className="adv-stat-card flex-row green-theme" style={{ padding: "16px 20px" }}>
          <div className="adv-card-icon bg-green-light" style={{ width: "40px", height: "40px" }}>
            <CalendarRange size={20} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label" style={{ fontSize: "12px" }}>ปีการศึกษา</span>
            <strong className="adv-card-value" style={{ fontSize: "22px" }}>{uniqueYearsCount}</strong>
            <span className="adv-card-desc" style={{ fontSize: "11px" }}>ช่วงปีการศึกษาของงานวิจัย</span>
          </div>
        </div>
      </section>

      {query && (
        <p className="muted" style={{ marginBottom: "16px" }}>
          ผลการค้นหาสำหรับ “<strong>{query}</strong>” จำนวน {totalWorks} รายการ
        </p>
      )}

      {/* Main Manager Table with Filters */}
      <AdminResearchManager records={records} reviewBasePath="/advisor/reviews" />
    </main>
  );
}
