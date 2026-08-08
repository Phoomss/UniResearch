"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Clock, AlertTriangle, CheckCircle2, ChevronRight, FileText, Calendar, Tag } from "lucide-react";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

interface AdminReviewQueueDashboardProps {
  initialResearch: ResearchWorkResponse[];
  categories: Array<{ id: number; category_name: string }>;
  reviewBasePath?: string;
  heading?: string;
  eyebrow?: string;
}

type TabType = "pending" | "revision" | "approved" | "rejected";

export function AdminReviewQueueDashboard({
  initialResearch,
  categories,
  reviewBasePath = "/admin/reviews",
  heading = "งานรอตรวจสอบ",
  eyebrow = "การจัดการความเห็นชอบ",
}: AdminReviewQueueDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  // Create category map
  const categoryMap = new Map<number, string>();
  categories.forEach(c => categoryMap.set(c.id, c.category_name));

  // Filter research based on status
  const pendingList = initialResearch.filter(rw => rw.status === "pending");
  const revisionList = initialResearch.filter(rw => rw.status === "needs_revision" || rw.status === "revision_needed");
  const approvedList = initialResearch.filter(rw => rw.status === "approved");
  const rejectedList = initialResearch.filter(rw => rw.status === "rejected");

  const getActiveList = () => {
    switch (activeTab) {
      case "pending": return pendingList;
      case "revision": return revisionList;
      case "approved": return approvedList;
      case "rejected": return rejectedList;
    }
  };

  const activeList = getActiveList();

  return (
    <div className="adv-dashboard-container">
      {/* Header and Title */}
      <header className="admin-page-heading" style={{ marginBottom: "24px" }}>
        <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48276a", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <ClipboardList size={16} />
          <span>{eyebrow}</span>
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#111827", margin: "8px 0 0" }}>{heading}</h1>
      </header>

      {/* Grid Metrics Stats - Left Aligned Icon Style */}
      <section className="adv-stats-grid" style={{ marginBottom: "32px" }}>
        {/* Pending Card */}
        <div 
          onClick={() => setActiveTab("pending")}
          className={`adv-stat-card flex-row purple-theme ${activeTab === "pending" ? "active-filter-card" : ""}`}
          style={{ cursor: "pointer", border: activeTab === "pending" ? "1.5px solid #7c3aed" : "1px solid rgba(0, 0, 0, 0.06)" }}
        >
          <div className="adv-card-icon bg-purple-light">
            <Clock size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">รอตรวจสอบ</span>
            <strong className="adv-card-value">{pendingList.length}</strong>
            <span className="adv-card-desc">รายการรอตรวจประเมิน</span>
          </div>
        </div>

        {/* Revision Card */}
        <div 
          onClick={() => setActiveTab("revision")}
          className={`adv-stat-card flex-row orange-theme ${activeTab === "revision" ? "active-filter-card" : ""}`}
          style={{ cursor: "pointer", border: activeTab === "revision" ? "1.5px solid #ea580c" : "1px solid rgba(0, 0, 0, 0.06)" }}
        >
          <div className="adv-card-icon bg-orange-light">
            <AlertTriangle size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">ต้องแก้ไข</span>
            <strong className="adv-card-value">{revisionList.length}</strong>
            <span className="adv-card-desc">งานที่ส่งกลับไปปรับปรุง</span>
          </div>
        </div>

        {/* Approved Card */}
        <div 
          onClick={() => setActiveTab("approved")}
          className={`adv-stat-card flex-row green-theme ${activeTab === "approved" ? "active-filter-card" : ""}`}
          style={{ cursor: "pointer", border: activeTab === "approved" ? "1.5px solid #059669" : "1px solid rgba(0, 0, 0, 0.06)" }}
        >
          <div className="adv-card-icon bg-green-light">
            <CheckCircle2 size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">อนุมัติแล้ว</span>
            <strong className="adv-card-value">{approvedList.length}</strong>
            <span className="adv-card-desc">ผลงานที่เผยแพร่แล้ว</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="adv-workspace-layout" style={{ gridTemplateColumns: "1fr" }}>
        <div className="adv-main-content-panel">
          {/* Tabs Filter Bar */}
          <div className="adv-tabs-bar" style={{ justifyContent: "flex-start", gap: "8px" }}>
            <button 
              type="button"
              className={`adv-tab-trigger ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              <span>รอตรวจสอบ ({pendingList.length})</span>
            </button>
            <button 
              type="button"
              className={`adv-tab-trigger ${activeTab === "revision" ? "active" : ""}`}
              onClick={() => setActiveTab("revision")}
            >
              <span>ต้องแก้ไข ({revisionList.length})</span>
            </button>
            <button 
              type="button"
              className={`adv-tab-trigger ${activeTab === "approved" ? "active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              <span>อนุมัติแล้ว ({approvedList.length})</span>
            </button>
            <button 
              type="button"
              className={`adv-tab-trigger ${activeTab === "rejected" ? "active" : ""}`}
              style={{ color: activeTab === "rejected" ? "#white" : "#ef4444" }}
              onClick={() => setActiveTab("rejected")}
            >
              <span>ไม่อนุมัติ ({rejectedList.length})</span>
            </button>
          </div>

          {/* Review List */}
          <div className="adv-results-list">
            {activeList.length === 0 ? (
              <div className="adv-empty-state">
                <FileText size={48} className="text-gray-300 mb-2" />
                <p>ไม่มีผลงานวิจัยในคิวตรวจสอบหมวดหมู่นี้</p>
                <small className="text-gray-400">เมื่อมีผลงานส่งเข้ามาใหม่จะปรากฏขึ้นที่คิวนี้ทันที</small>
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

                const tags = item.keywords ? item.keywords.split(/[,,;，\s]+/).map(k => k.trim()).filter(Boolean).slice(0, 3) : [];

                return (
                  <article key={item.id} className="adv-item-card" style={{ alignItems: "flex-start" }}>
                    <div className="adv-item-main">
                      <div className="adv-item-header">
                        <div className="adv-item-meta">
                          <span className="adv-meta-tag ref-id">ID: {item.id}</span>
                          <span className="adv-meta-tag category">{categoryName}</span>
                          {item.academic_year && (
                            <span className="adv-meta-tag year">ปีการศึกษา {item.academic_year}</span>
                          )}
                        </div>
                      </div>

                      <h3 className="adv-item-title" style={{ whiteSpace: "normal" }}>
                        {item.title_th || item.title_en}
                      </h3>
                      {item.title_th && item.title_en && (
                        <h4 className="adv-item-subtitle" style={{ whiteSpace: "normal" }}>{item.title_en}</h4>
                      )}

                      <p style={{ margin: "4px 0 12px", color: "#4b5563", fontSize: "14px", lineHeight: "1.6" }}>
                        {item.abstract || "ไม่มีบทคัดย่อ"}
                      </p>

                      {tags.length > 0 && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                          {tags.map((tag) => (
                            <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: "4px" }}>
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="adv-item-footer">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ background: "#48276a", color: "white", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>
                            {authorName.slice(0, 2).toUpperCase()}
                          </span>
                          <span style={{ fontWeight: "600", color: "#1f2937" }}>{authorName}</span>
                          <span style={{ color: "#9ca3af" }}>• ส่งเมื่อ {formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="adv-item-actions" style={{ alignSelf: "center" }}>
                      <Link 
                        href={`${reviewBasePath}/${item.id}`}
                        className="adv-action-btn review"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <span>ตรวจสอบผลงาน</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
