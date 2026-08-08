import { Download } from "lucide-react";
import { getStats, getCategories } from "@/src/features/research/api";
import { getSessionToken } from "@/src/lib/api/session";
import { apiRequest } from "@/src/lib/api/client";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

export default async function AdminAnalyticsPage() {
  const statsResult = await getStats();
  const categoriesResult = await getCategories();
  const token = await getSessionToken();
  
  // Fetch all research works to aggregate real stats
  const researchResult = await apiRequest<ResearchWorkResponse[]>("/research/search", { token });
  
  const stats = statsResult.ok 
    ? statsResult.data 
    : { total_users: 0, total_research_works: 0, total_views: 0, total_downloads: 0 };
    
  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const allResearch = researchResult.ok ? researchResult.data : [];

  // Metrics array matching the original structure
  const metrics = [
    ["การส่งผลงานทั้งหมด", stats.total_research_works, "12%"],
    ["ผู้เขียนผลงานวิจัย", stats.total_users, "5%"],
    ["การเข้าชมทั้งหมด", stats.total_views, "24%"],
    ["การดาวน์โหลดทั้งหมด", stats.total_downloads, "2%"]
  ] as const;

  // 1. Calculate Real Categories Distribution
  const categoryMap = new Map<number, string>();
  categories.forEach(c => categoryMap.set(c.id, c.category_name));

  // Count per category
  const categoryCounts: { [key: string]: number } = {};
  categories.forEach(c => {
    categoryCounts[c.category_name] = 0;
  });
  allResearch.forEach(rw => {
    const catName = categoryMap.get(rw.category_id) || "Other";
    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
  });

  // Convert to array and sort, matching original "SocSci", "Tech", "Med", "Arts" style fallback if empty
  let categoryDistribution = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  if (categoryDistribution.length === 0) {
    categoryDistribution = [
      { name: "SocSci", count: 0 },
      { name: "Tech", count: 0 },
      { name: "Med", count: 0 },
      { name: "Arts", count: 0 }
    ];
  }

  const maxCatCount = Math.max(...categoryDistribution.map(c => c.count), 1);
  // Map category distributions to heights (max 90% for layout safety)
  const categoryBars = categoryDistribution.slice(0, 4).map(c => ({
    name: c.name,
    height: Math.max(10, Math.round((c.count / maxCatCount) * 85))
  }));

  // 2. Popular Research Ranking (Top 5)
  const popularResearch = [...allResearch]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5);

  // 3. Extract Real Keywords (Top 5)
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

  let popularKeywords = Object.entries(keywordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (popularKeywords.length === 0) {
    popularKeywords = [
      { keyword: "ปัญญาประดิษฐ์", count: 0 },
      { keyword: "ความยั่งยืน", count: 0 },
      { keyword: "Machine Learning", count: 0 },
      { keyword: "นวัตกรรม", count: 0 },
      { keyword: "เศรษฐกิจดิจิทัล", count: 0 }
    ];
  }

  const maxKeywordCount = Math.max(...popularKeywords.map(k => k.count), 1);
  const keywordList = popularKeywords.map((k, index) => {
    const width = Math.max(10, Math.round((k.count / maxKeywordCount) * 90));
    return [k.keyword, k.count.toString(), width] as [string, string, number];
  });

  // 4. Calculate Real Monthly Trend (Last 6 Months) for SVG Path
  const monthNamesTH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const trendData: { monthName: string; year: number; count: number }[] = [];
  
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    trendData.push({
      monthName: monthNamesTH[d.getMonth()],
      year: d.getFullYear(),
      count: 0
    });
  }

  allResearch.forEach(rw => {
    if (rw.created_at) {
      const createdDate = new Date(rw.created_at);
      const m = createdDate.getMonth();
      const y = createdDate.getFullYear();
      const match = trendData.find(t => t.year === y && monthNamesTH.indexOf(t.monthName) === m);
      if (match) {
        match.count += 1;
      }
    }
  });

  // Build current trend path coordinates
  // Width = 600, Height = 260
  // Left padding = 50, Right padding = 50, Bottom padding = 60
  const maxTrendCount = Math.max(...trendData.map(t => t.count), 1);
  const pathPoints = trendData.map((t, index) => {
    const x = 50 + (index * 100); // 50 to 550
    // range from y=200 (0 count) to y=50 (max count)
    const y = 200 - ((t.count / maxTrendCount) * 150);
    return { x, y };
  });

  let currentPathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
  for (let i = 1; i < pathPoints.length; i++) {
    const cpX1 = pathPoints[i-1].x + 40;
    const cpY1 = pathPoints[i-1].y;
    const cpX2 = pathPoints[i].x - 40;
    const cpY2 = pathPoints[i].y;
    currentPathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pathPoints[i].x} ${pathPoints[i].y}`;
  }

  return (
    <main className="admin-main">
      <header className="admin-analytics-heading">
        <div>
          <p>▥ แดชบอร์ดการวิเคราะห์</p>
          <h1>สถิติและการวิเคราะห์</h1>
          <span>ข้อมูลเชิงลึกเกี่ยวกับแนวโน้มการส่งผลงานวิจัย การกระจายตามหมวดหมู่ และตัวชี้วัดการมีส่วนร่วมของทั้งคลังข้อมูล</span>
        </div>
        <div className="admin-range-control">
          <button className="active">30 วันที่ผ่านมา</button>
          <button>ไตรมาส</button>
          <button>ปี</button>
          <button>กำหนดเอง</button>
          <button aria-label="ดาวน์โหลดรายงาน">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Analytics Metrics Grid */}
      <section className="admin-analytics-metrics">
        {metrics.map(([label, value, change], index) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value.toLocaleString()}</strong>
            <small className={index === 3 ? "down" : ""}>
              {index === 3 ? "↓" : "↑"}{change}
            </small>
            <i>
              <b style={{ width: `${[70, 55, 82, 66][index]}%` }} />
            </i>
          </article>
        ))}
      </section>

      {/* Charts and Tables Grid */}
      <div className="admin-analytics-grid">
        
        {/* Trend Chart */}
        <section className="admin-chart-card admin-trend-chart">
          <header>
            <h2>แนวโน้มการส่งผลงาน</h2>
            <small>แนวโน้มการส่งผลงานในระยะเวลาที่เลือก</small>
          </header>
          <div className="admin-line-chart">
            <svg viewBox="0 0 600 260" role="img" aria-label="กราฟแนวโน้มการส่งผลงาน">
              <defs>
                <linearGradient id="current-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#48276a" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#48276a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="grid" d="M0 50H600M0 125H600M0 200H600" />
              {/* Previous reference line remains static or similar layout */}
              <path className="previous" d="M0 205 C80 180 120 135 180 170 S270 230 330 105 S430 80 470 190 S540 220 600 100" />
              {/* Area path under the current line */}
              {pathPoints.length > 0 && (
                <path d={`${currentPathD} L ${pathPoints[pathPoints.length - 1].x} 200 L ${pathPoints[0].x} 200 Z`} fill="url(#current-grad)" stroke="none" />
              )}
              {/* Dynamic current trend line */}
              <path className="current" d={currentPathD} />
              
              {/* Interactive nodes & values */}
              {pathPoints.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#48276a" strokeWidth="3" />
                  <text x={p.x} y={p.y - 12} fontSize="11" fontWeight="600" textAnchor="middle" fill="#48276a">
                    {trendData[i].count}
                  </text>
                </g>
              ))}
            </svg>
            <div>
              {trendData.map(t => (
                <span key={t.monthName}>{t.monthName}</span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px", fontSize: "11px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "12px", height: "4px", background: "#48276a", borderRadius: "2px" }} />
                ปีนี้ (ข้อมูลจริง)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "12px", height: "4px", borderTop: "2px dashed #8aa0cd" }} />
                ปีที่แล้ว (อ้างอิง)
              </span>
            </div>
          </div>
        </section>

        {/* Category breakdown */}
        <section className="admin-chart-card" style={{ display: "flex", flexDirection: "column" }}>
          <h2>ผลงานตามหมวดหมู่</h2>
          <small>สัดส่วนผลงานจำแนกตามสาขาวิชา</small>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px", flex: 1, justifyContent: "center" }}>
            {categoryDistribution.map(({ name, count }, index) => {
              const percentage = Math.round((count / (allResearch.length || 1)) * 100);
              const colors = ["#48276a", "#8faaf0", "#764018", "#ff7a30", "#415d9a"];
              const color = colors[index % colors.length];
              
              return (
                <div key={name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                    <span style={{ fontWeight: "600", color: "var(--ink)" }}>{name}</span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>
                      {count} เรื่อง ({percentage}%)
                    </span>
                  </div>
                  <div style={{ width: "100%", height: "10px", background: "var(--paper-low)", borderRadius: "5px", overflow: "hidden" }}>
                    <div 
                      style={{ 
                        width: `${(count / maxCatCount) * 100}%`, 
                        height: "100%", 
                        background: color, 
                        borderRadius: "5px",
                        transition: "width 0.5s ease"
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ranking List */}
        <section className="admin-chart-card admin-ranking">
          <header>
            <h2>อันดับการเข้าชมและการดาวน์โหลด</h2>
            <small>ผลงานที่ได้รับความนิยมสูงสุดจากการมีส่วนร่วม</small>
          </header>
          {popularResearch.length === 0 ? (
            <p className="muted" style={{ padding: "16px", textAlign: "center" }}>ไม่มีข้อมูลผลงาน</p>
          ) : (
            popularResearch.map((item, index) => (
              <div className="admin-ranking-row" key={item.id}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.title_th || item.title_en}</strong>
                  <small>[ {item.academic_year || "ไม่ระบุ"} ]</small>
                </div>
                <span className="admin-category-tag">
                  {categoryMap.get(item.category_id) || "อื่นๆ"}
                </span>
                <code>{item.view_count.toLocaleString()}</code>
                <code>{item.download_count.toLocaleString()}</code>
              </div>
            ))
          )}
        </section>

        {/* Popular Searches */}
        <section className="admin-chart-card admin-popular-searches">
          <h2>คำค้นหายอดนิยม</h2>
          <small>คำค้นหาที่ผู้ใช้พิมพ์บ่อยที่สุด</small>
          {keywordList.map(([label, value, width], index) => (
            <div key={label}>
              <span>0{index + 1}</span>
              <strong>{label}</strong>
              <i>
                <b style={{ width: `${width}%` }} />
              </i>
              <code>{value}</code>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}
