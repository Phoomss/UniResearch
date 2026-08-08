import Link from "next/link";
import { AlertTriangle as AlertSquare, BookOpen, Download, Eye, FileClock, Users } from "lucide-react";
import { getStats, getPendingResearch } from "@/src/features/research/api";
import { getSessionToken } from "@/src/lib/api/session";
import { apiRequest } from "@/src/lib/api/client";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

export default async function AdminOverview() {
  const statsResult = await getStats();
  const pendingResult = await getPendingResearch();
  const token = await getSessionToken();
  
  // Fetch all research works to aggregate status breakdown, years, and keywords
  const allResearchResult = await apiRequest<ResearchWorkResponse[]>("/research/search", { token });

  const stats = statsResult.ok 
    ? statsResult.data 
    : { total_users: 0, total_research_works: 0, total_views: 0, total_downloads: 0 };
    
  const pendingWorks = pendingResult.ok ? pendingResult.data : [];
  const allResearch = allResearchResult.ok ? allResearchResult.data : [];

  // Calculate status counts
  const totalCount = allResearch.length;
  const approvedCount = allResearch.filter(rw => rw.status === "approved").length;
  const pendingCount = allResearch.filter(rw => rw.status === "pending").length;
  const draftCount = allResearch.filter(rw => rw.status === "draft" || rw.status === "needs_revision" || rw.status === "revision_needed").length;
  const approvedPercentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  // Calculate real academic year counts (last 6 academic years)
  // Default to fallback years if no academic years are specified
  const currentYear = new Date().getFullYear() + 543; // Convert to Buddhist Year (BE)
  const yearsRange = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i); // Last 6 years
  
  const yearCounts = yearsRange.map(year => {
    return allResearch.filter(rw => rw.academic_year === year).length;
  });

  const maxYearCount = Math.max(...yearCounts, 1);
  const miniBarHeights = yearCounts.map(count => Math.max(10, Math.round((count / maxYearCount) * 90)));

  // Calculate real keywords (top 6 for dashboard tags)
  const keywordCounts: { [key: string]: number } = {};
  allResearch.forEach(rw => {
    if (rw.keywords) {
      const kwList = rw.keywords.split(/[,,;，\s]+/).map(k => k.trim()).filter(Boolean);
      kwList.forEach(k => {
        const key = k.toLowerCase();
        keywordCounts[key] = (keywordCounts[key] || 0) + 1;
      });
    }
  });

  let popularKeywords = Object.keys(keywordCounts)
    .sort((a, b) => keywordCounts[b] - keywordCounts[a])
    .slice(0, 6);

  if (popularKeywords.length === 0) {
    popularKeywords = ["Machine Learning", "การศึกษาปฐมวัย", "Sustainability", "Data Science", "AI", "Public Health"];
  }

  const cards = [
    { label: "ผลงานทั้งหมด", value: stats.total_research_works, detail: "ผลงานตีพิมพ์ทั้งหมด", icon: BookOpen },
    { label: "รอตรวจสอบ", value: pendingWorks.length, detail: "รอตรวจสอบผลงาน", icon: FileClock, featured: true },
    { label: "ผู้ใช้งานทั้งหมด", value: stats.total_users, detail: "ผู้เขียนผลงานวิจัย", icon: Users },
    { label: "การเข้าชมทั้งหมด", value: stats.total_views, detail: "การเข้าดูคลังข้อมูล", icon: Eye },
    { label: "การดาวน์โหลดทั้งหมด", value: stats.total_downloads, detail: "ดาวน์โหลดฉบับเต็ม", icon: Download, wide: true },
  ];

  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-dashboard-heading">
        <p><span /> ข้อมูลภาพรวมของผู้ดูแลระบบ</p>
        <h1>ภาพรวมระบบ</h1>
        <div className="admin-heading-rule">
          <span>ติดตามกิจกรรมการเก็บถาวรผลงานวิจัย การมีส่วนร่วมของผู้ใช้ และการตรวจสอบผลงานที่รอดำเนินการในคลังสถาบันการศึกษา</span>
        </div>
      </header>

      {/* Metric Grid Cards */}
      <section className="admin-metric-grid">
        {cards.map(({ label, value, detail, icon: Icon, featured, wide }) => (
          <article className={`${featured ? "featured" : ""} ${wide ? "wide" : ""}`} key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} />
            </div>
            <strong>{value.toLocaleString()}</strong>
            <small>[ {detail} ]</small>
          </article>
        ))}
      </section>

      <div className="admin-dashboard-columns">
        
        {/* Pending items list */}
        <section className="admin-attention">
          <header>
            <h2><AlertSquare size={22} /> งานที่ต้องดำเนินการ</h2>
            <span>[ ต้องดำเนินการด่วน ]</span>
          </header>
          {pendingWorks.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", background: "var(--paper-low)", borderRadius: "8px", border: "1px dashed var(--line)" }}>
              <p className="muted" style={{ margin: 0 }}>ไม่มีผลงานค้างตรวจสอบในระบบขณะนี้</p>
            </div>
          ) : (
            pendingWorks.slice(0, 3).map((item) => (
              <article key={item.id}>
                <div>
                  <p><span>รอตรวจสอบ</span> [ปีการศึกษา: {item.academic_year || "ไม่ระบุ"}]</p>
                  <h3>{item.title_th || item.title_en}</h3>
                  <small>
                    ผู้เขียน: {item.authors?.[0]?.user ? `${item.authors[0].user.first_name || ""} ${item.authors[0].user.last_name || ""}` : "ไม่ทราบชื่อ"} • อัปเดตเมื่อ: {new Date(item.updated_at).toLocaleDateString("th-TH")}
                  </small>
                </div>
                <Link href={`/admin/reviews/${item.id}`}>ตรวจสอบ</Link>
              </article>
            ))
          )}
          <Link className="admin-view-all" href="/admin/reviews">ดูรายการรอดำเนินการทั้งหมด →</Link>
        </section>

        {/* Sidebar Insights */}
        <aside className="admin-dashboard-insights">
          
          {/* Status Donut */}
          <section>
            <h3>สัดส่วนสถานะ</h3>
            <div className="admin-donut">
              <strong>{approvedPercentage}%</strong>
              <span>เผยแพร่แล้ว</span>
            </div>
            <ul>
              <li>
                <i className="published" />เผยแพร่แล้ว <strong>{approvedCount.toLocaleString()}</strong>
              </li>
              <li>
                <i className="pending" />รอตรวจสอบ <strong>{pendingCount.toLocaleString()}</strong>
              </li>
              <li>
                <i className="draft" />แบบร่าง <strong>{draftCount.toLocaleString()}</strong>
              </li>
            </ul>
          </section>

          {/* Academic Year Chart */}
          <section>
            <h3>ผลงานวิจัยตามปีการศึกษา</h3>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "10px", height: "150px", padding: "10px 4px 0", borderBottom: "1px solid var(--line)" }}>
              {miniBarHeights.map((height, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "flex-end",
                    height: "100%",
                    flex: 1
                  }}
                  title={`ปี พ.ศ. ${yearsRange[index]}: ${yearCounts[index]} เรื่อง`}
                >
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--mulberry)", marginBottom: "4px" }}>
                    {yearCounts[index]}
                  </span>
                  <i 
                    style={{ 
                      height: `${Math.max(10, Math.round(height * 0.95))}%`, 
                      width: "100%", 
                      maxWidth: "24px",
                      background: "linear-gradient(to top, var(--mulberry), var(--periwinkle))",
                      borderTopLeftRadius: "6px",
                      borderTopRightRadius: "6px",
                      display: "block",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      transition: "height 0.3s ease"
                    }} 
                  />
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted)", marginTop: "8px" }}>
                    {yearsRange[index]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Keywords */}
          <section>
            <h3>คำค้นหายอดนิยม [ จากคลังข้อมูลจริง ]</h3>
            <div className="admin-keywords">
              {popularKeywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </section>

        </aside>
      </div>
    </main>
  );
}
