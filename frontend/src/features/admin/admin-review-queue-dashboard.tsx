"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Clock, AlertTriangle, CheckCircle2, ChevronRight, FileText, Calendar, Tag } from "lucide-react";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

interface AdminReviewQueueDashboardProps {
  initialResearch: ResearchWorkResponse[];
  categories: Array<{ id: number; category_name: string }>;
}

type TabType = "pending" | "revision" | "approved";

export function AdminReviewQueueDashboard({
  initialResearch,
  categories
}: AdminReviewQueueDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Create category map
  const categoryMap = new Map<number, string>();
  categories.forEach(c => categoryMap.set(c.id, c.category_name));

  // Filter research based on status
  const pendingList = initialResearch.filter(rw => rw.status === "pending");
  const revisionList = initialResearch.filter(rw => rw.status === "needs_revision" || rw.status === "revision_needed");
  const approvedList = initialResearch.filter(rw => rw.status === "approved");

  const getActiveList = () => {
    switch (activeTab) {
      case "pending": return pendingList;
      case "revision": return revisionList;
      case "approved": return approvedList;
    }
  };

  const activeList = getActiveList();

  return (
    <>
      <header className="admin-review-queue-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "32px", marginBottom: "32px" }}>
        <div>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 8px", fontSize: "14px", fontWeight: "600", color: "var(--muted)" }}>
            <ClipboardList size={18} style={{ background: "var(--lavender)", color: "var(--mulberry)", padding: "4px", boxSizing: "content-box", borderRadius: "6px" }} />
            <span>การจัดการความเห็นชอบ</span>
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: "750", color: "var(--mulberry)", margin: 0 }}>งานรอตรวจสอบ</h1>
        </div>

        {/* Dynamic Interactive Stat Cards */}
        <dl style={{ display: "flex", gap: "16px", margin: 0, padding: 0 }}>
          
          {/* Pending Card */}
          <div 
            onClick={() => setActiveTab("pending")} 
            style={{ 
              cursor: "pointer", 
              padding: "16px 24px", 
              borderRadius: "12px", 
              background: activeTab === "pending" ? "var(--paper-low)" : "var(--paper-white)",
              border: activeTab === "pending" ? "2px solid var(--mulberry)" : "2px solid #cdc3d020",
              boxShadow: activeTab === "pending" ? "0 4px 12px rgba(72,39,106,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              minWidth: "160px",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ background: "rgba(72, 39, 106, 0.1)", color: "var(--mulberry)", padding: "10px", borderRadius: "50%" }}>
              <Clock size={20} />
            </div>
            <div>
              <dt style={{ fontSize: "28px", fontWeight: "750", color: "var(--mulberry)", lineHeight: 1 }}>{pendingList.length}</dt>
              <dd style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>รอตรวจสอบ</dd>
            </div>
          </div>

          {/* Revision Card */}
          <div 
            onClick={() => setActiveTab("revision")} 
            style={{ 
              cursor: "pointer", 
              padding: "16px 24px", 
              borderRadius: "12px", 
              background: activeTab === "revision" ? "var(--apricot)" : "var(--paper-white)",
              border: activeTab === "revision" ? "2px solid #ff7a30" : "2px solid #cdc3d020",
              boxShadow: activeTab === "revision" ? "0 4px 12px rgba(255,122,48,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              minWidth: "160px",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ background: "rgba(255, 122, 48, 0.1)", color: "#ff7a30", padding: "10px", borderRadius: "50%" }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <dt style={{ fontSize: "28px", fontWeight: "750", color: "#8a3a00", lineHeight: 1 }}>{revisionList.length}</dt>
              <dd style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>ต้องแก้ไข</dd>
            </div>
          </div>

          {/* Approved Card */}
          <div 
            onClick={() => setActiveTab("approved")} 
            style={{ 
              cursor: "pointer", 
              padding: "16px 24px", 
              borderRadius: "12px", 
              background: activeTab === "approved" ? "rgba(33, 122, 82, 0.05)" : "var(--paper-white)",
              border: activeTab === "approved" ? "2px solid var(--success)" : "2px solid #cdc3d020",
              boxShadow: activeTab === "approved" ? "0 4px 12px rgba(33,122,82,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              minWidth: "160px",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ background: "rgba(33, 122, 82, 0.1)", color: "var(--success)", padding: "10px", borderRadius: "50%" }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <dt style={{ fontSize: "28px", fontWeight: "750", color: "var(--success)", lineHeight: 1 }}>{approvedList.length}</dt>
              <dd style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>อนุมัติแล้ว</dd>
            </div>
          </div>

        </dl>
      </header>

      {/* Segmented Pill Tabs */}
      <div className="admin-review-tabs" style={{ display: "flex", background: "var(--paper-low)", padding: "4px", borderRadius: "100px", border: "1px solid #cdc3d040", width: "fit-content", marginBottom: "32px" }}>
        <button 
          style={{ 
            border: "none", 
            background: activeTab === "pending" ? "white" : "transparent", 
            color: activeTab === "pending" ? "var(--mulberry)" : "var(--muted)", 
            fontWeight: "600", 
            fontSize: "13px", 
            padding: "8px 20px", 
            borderRadius: "100px", 
            cursor: "pointer", 
            boxShadow: activeTab === "pending" ? "0 2px 8px rgba(0,0,0,0.06)" : "none", 
            transition: "all 0.2s ease" 
          }}
          onClick={() => setActiveTab("pending")}
        >
          รอตรวจสอบ [ {pendingList.length} ]
        </button>
        <button 
          style={{ 
            border: "none", 
            background: activeTab === "revision" ? "white" : "transparent", 
            color: activeTab === "revision" ? "var(--mulberry)" : "var(--muted)", 
            fontWeight: "600", 
            fontSize: "13px", 
            padding: "8px 20px", 
            borderRadius: "100px", 
            cursor: "pointer", 
            boxShadow: activeTab === "revision" ? "0 2px 8px rgba(0,0,0,0.06)" : "none", 
            transition: "all 0.2s ease" 
          }}
          onClick={() => setActiveTab("revision")}
        >
          ต้องแก้ไข [ {revisionList.length} ]
        </button>
        <button 
          style={{ 
            border: "none", 
            background: activeTab === "approved" ? "white" : "transparent", 
            color: activeTab === "approved" ? "var(--mulberry)" : "var(--muted)", 
            fontWeight: "600", 
            fontSize: "13px", 
            padding: "8px 20px", 
            borderRadius: "100px", 
            cursor: "pointer", 
            boxShadow: activeTab === "approved" ? "0 2px 8px rgba(0,0,0,0.06)" : "none", 
            transition: "all 0.2s ease" 
          }}
          onClick={() => setActiveTab("approved")}
        >
          อนุมัติแล้ว [ {approvedList.length} ]
        </button>
      </div>

      {/* Review List */}
      <section className="admin-review-list" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {activeList.length === 0 ? (
          <div style={{ padding: "64px 32px", textAlign: "center", background: "white", borderRadius: "16px", border: "1px dashed var(--line)" }}>
            <p className="muted" style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>ไม่มีผลงานวิจัยในหมวดหมู่ที่เลือก</p>
          </div>
        ) : (
          activeList.map((item) => {
            const authorName = item.authors?.[0]?.user 
              ? `${item.authors[0].user.first_name || ""} ${item.authors[0].user.last_name || ""}`.trim()
              : "ไม่ระบุผู้ส่ง";
              
            const categoryName = categoryMap.get(item.category_id) || "อื่นๆ";
            const formattedDate = new Date(item.updated_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "short",
              day: "numeric"
            });

            // Extract tags
            const tags = item.keywords ? item.keywords.split(/[,,;，\s]+/).map(k => k.trim()).filter(Boolean).slice(0, 3) : [];

            return (
              <article 
                key={item.id} 
                style={{ 
                  position: "relative",
                  display: "flex",
                  gap: "24px",
                  padding: "24px",
                  border: "1px solid #cdc3d025", 
                  borderRadius: "16px", 
                  background: "white",
                  boxShadow: "0 2px 8px rgba(38,36,52,0.03)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(38,36,52,0.06)";
                  e.currentTarget.style.borderColor = "var(--mulberry-2, #603f83)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(38,36,52,0.03)";
                  e.currentTarget.style.borderColor = "#cdc3d025";
                }}
              >
                {/* Paper Icon Container */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }}>
                  <div style={{ background: "var(--paper-low)", color: "var(--mulberry)", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={32} />
                  </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="admin-review-card-meta" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                    <span className="admin-category-tag" style={{ background: "var(--paper-mid)", color: "var(--mulberry)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>{categoryName}</span>
                    <code style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>ID: {item.id}</code>
                    {item.academic_year && (
                      <span style={{ fontSize: "12px", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={13} />
                        ปี {item.academic_year}
                      </span>
                    )}
                  </div>
                  
                  <h2 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "700", color: "var(--ink)", lineHeight: "1.4" }}>{item.title_th || item.title_en}</h2>
                  
                  <p style={{ 
                    margin: "0 0 16px", 
                    color: "var(--muted)", 
                    fontSize: "14px", 
                    lineHeight: "1.6",
                    display: "-webkit-box", 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: "vertical", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis" 
                  }}>
                    {item.abstract || "ไม่มีบทคัดย่อ"}
                  </p>

                  {/* Render tag list */}
                  {tags.length > 0 && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
                      {tags.map((tag) => (
                        <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--muted)", background: "var(--paper)", padding: "2px 8px", borderRadius: "4px", border: "1px solid #cdc3d020" }}>
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #cdc3d020", paddingTop: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="admin-author-avatar" style={{ background: "var(--mulberry)", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>
                        {authorName.slice(0, 2).toUpperCase()}
                      </span>
                      <strong style={{ fontSize: "13px", color: "var(--ink)" }}>{authorName}</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>• ส่งเมื่อ {formattedDate}</span>
                    </div>
                    
                    <Link 
                      href={`/admin/reviews/${item.id}`}
                      style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        padding: "8px 16px", 
                        borderRadius: "8px", 
                        background: "var(--mulberry)", 
                        color: "white", 
                        fontSize: "13px",
                        fontWeight: "600",
                        boxShadow: "0 2px 6px rgba(72,39,106,0.15)",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--mulberry-2, #603f83)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--mulberry)";
                      }}
                    >
                      <span>ตรวจสอบผลงาน</span>
                      <ChevronRight size={14} />
                    </Link>
                  </footer>
                </div>
              </article>
            );
          })
        )}
      </section>
    </>
  );
}
