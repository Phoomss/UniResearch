"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ClipboardClock,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Search,
  FileText,
  UsersRound,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Bookmark,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import type { ResearchWorkResponse, CategoryResponse, UserResponse } from "@/src/lib/api/types";

interface AdvisorDashboardProps {
  allResearch: ResearchWorkResponse[];
  pendingResearch: ResearchWorkResponse[];
  myResearch: ResearchWorkResponse[];
  categories: CategoryResponse[];
  user: UserResponse;
}

export function AdvisorDashboard({
  allResearch,
  pendingResearch,
  myResearch,
  categories,
  user,
}: AdvisorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "advisees" | "history">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const userId = user.id;

  // Filter Advisees research (where user is marked as advisor)
  const adviseesResearch = useMemo(() => {
    return allResearch.filter((item) =>
      item.advisors?.some((adv) => adv.user_id === userId)
    );
  }, [allResearch, userId]);

  // Filter Reviewed research (where this advisor has submitted a review comment)
  const reviewedResearch = useMemo(() => {
    return allResearch.filter((item) =>
      item.reviews?.some((rev) => rev.reviewer_id === userId)
    );
  }, [allResearch, userId]);

  // Filter Revision research (all or advisees)
  const revisionResearch = useMemo(() => {
    return allResearch.filter(
      (item) => item.status === "needs_revision" || item.status === "revision_needed"
    );
  }, [allResearch]);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      pendingCount: pendingResearch.length,
      reviewedCount: reviewedResearch.length,
      adviseesCount: adviseesResearch.length,
      revisionCount: revisionResearch.length,
    };
  }, [pendingResearch, reviewedResearch, adviseesResearch, revisionResearch]);

  // Handle items display based on active tab, search, and category filter
  const displayedItems = useMemo(() => {
    let list: ResearchWorkResponse[] = [];
    if (activeTab === "pending") {
      list = pendingResearch;
    } else if (activeTab === "advisees") {
      list = adviseesResearch;
    } else if (activeTab === "history") {
      list = reviewedResearch;
    }

    return list.filter((item) => {
      const title = `${item.title_th || ""} ${item.title_en || ""}`.toLowerCase();
      const authorsName = (item.authors || [])
        .map((a) => `${a.user.first_name || ""} ${a.user.last_name || ""}`.toLowerCase())
        .join(" ");
      const matchesSearch =
        !searchQuery ||
        title.includes(searchQuery.toLowerCase()) ||
        authorsName.includes(searchQuery.toLowerCase()) ||
        String(item.id).includes(searchQuery);

      const matchesCategory =
        categoryFilter === "all" || String(item.category_id) === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [activeTab, pendingResearch, adviseesResearch, reviewedResearch, searchQuery, categoryFilter]);

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.category_name || "ไม่ระบุหมวดหมู่";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="adv-badge approved">อนุมัติแล้ว</span>;
      case "rejected":
        return <span className="adv-badge rejected">ปฏิเสธ</span>;
      case "needs_revision":
      case "revision_needed":
        return <span className="adv-badge revision">ส่งกลับแก้ไข</span>;
      case "pending":
      default:
        return <span className="adv-badge pending">รอตรวจ</span>;
    }
  };

  return (
    <div className="adv-dashboard-container">

      {/* Grid Metrics Stats */}
      <section className="adv-stats-grid">
        {/* Card 1: Pending */}
        <div className="adv-stat-card flex-row purple-theme">
          <div className="adv-card-icon bg-purple-light">
            <ClipboardClock size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">งานรอตรวจประเมิน</span>
            <strong className="adv-card-value">{stats.pendingCount}</strong>
            <span className="adv-card-desc">รายการในคิวส่วนกลาง</span>
          </div>
        </div>

        {/* Card 2: Advisees */}
        <div className="adv-stat-card flex-row blue-theme">
          <div className="adv-card-icon bg-blue-light">
            <GraduationCap size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">งานในความดูแล</span>
            <strong className="adv-card-value">{stats.adviseesCount}</strong>
            <span className="adv-card-desc">คุณเป็นที่ปรึกษาหลัก/ร่วม</span>
          </div>
        </div>

        {/* Card 3: Reviewed */}
        <div className="adv-stat-card flex-row green-theme">
          <div className="adv-card-icon bg-green-light">
            <CheckCircle2 size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">ประเมินแล้วโดยฉัน</span>
            <strong className="adv-card-value">{stats.reviewedCount}</strong>
            <span className="adv-card-desc">บันทึกความคิดเห็นแล้ว</span>
          </div>
        </div>

        {/* Card 4: Revision */}
        <div className="adv-stat-card flex-row orange-theme">
          <div className="adv-card-icon bg-orange-light">
            <RotateCcw size={24} />
          </div>
          <div className="adv-card-body">
            <span className="adv-card-label">ส่งกลับแก้ไข</span>
            <strong className="adv-card-value">{stats.revisionCount}</strong>
            <span className="adv-card-desc">กำลังปรับปรุงผลงาน</span>
          </div>
        </div>
      </section>

      {/* Main Workspace layout */}
      <div className="adv-workspace-layout">
        <div className="adv-main-content-panel">
          {/* Controls: Tabs & Filters */}
          <div className="adv-tabs-bar">
            <div className="adv-tabs-triggers">
              <button
                type="button"
                className={`adv-tab-trigger ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                <ClipboardClock size={16} />
                <span>งานรอตรวจ ({stats.pendingCount})</span>
              </button>
              <button
                type="button"
                className={`adv-tab-trigger ${activeTab === "advisees" ? "active" : ""}`}
                onClick={() => setActiveTab("advisees")}
              >
                <GraduationCap size={16} />
                <span>งานในความดูแล ({stats.adviseesCount})</span>
              </button>
              <button
                type="button"
                className={`adv-tab-trigger ${activeTab === "history" ? "active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                <CheckCircle2 size={16} />
                <span>ประวัติประเมินของฉัน ({stats.reviewedCount})</span>
              </button>
            </div>

            {/* Quick Filters inside Tabs Bar */}
            <div className="adv-quick-filters">
              <div className="adv-search-input-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="ค้นหา ชื่องานวิจัย / นศ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="กรองหมวดหมู่"
                className="adv-category-select"
              >
                <option value="all">ทุกหมวดหมู่</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="adv-results-list">
            {displayedItems.length === 0 ? (
              <div className="adv-empty-state">
                <FileText size={48} className="text-gray-300 mb-2" />
                <p>ไม่พบรายการผลงานวิจัยที่ตรงตามเงื่อนไข</p>
                <small className="text-gray-400">
                  {searchQuery || categoryFilter !== "all"
                    ? "ลองเปลี่ยนคีย์เวิร์ดหรือตัวกรองหมวดหมู่"
                    : "ไม่มีข้อมูลงานวิจัยในหมวดนี้จากฐานข้อมูล"}
                </small>
              </div>
            ) : (
              displayedItems.map((item) => {
                const authorsText = (item.authors || [])
                  .map((a) => `${a.user.first_name || ""} ${a.user.last_name || ""}`.trim() || a.user.email)
                  .join(", ") || "ไม่ระบุผู้เขียน";

                const isDirectAdvisee = item.advisors?.some((adv) => adv.user_id === userId);

                return (
                  <article key={item.id} className="adv-item-card">
                    <div className="adv-item-main">
                      <div className="adv-item-header">
                        <div className="adv-item-meta">
                          <span className="adv-meta-tag ref-id">ID: {item.id}</span>
                          <span className="adv-meta-tag category">
                            {getCategoryName(item.category_id)}
                          </span>
                          {item.academic_year && (
                            <span className="adv-meta-tag year">
                              ปีการศึกษา {item.academic_year}
                            </span>
                          )}
                          {isDirectAdvisee && (
                            <span className="adv-meta-tag direct-advisee">
                              <Bookmark size={10} className="mr-1 fill-current" />
                              งานในความดูแล
                            </span>
                          )}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>

                      <h3 className="adv-item-title">
                        {item.title_th || item.title_en}
                      </h3>
                      {item.title_th && item.title_en && (
                        <h4 className="adv-item-subtitle">{item.title_en}</h4>
                      )}

                      <div className="adv-item-footer">
                        <div className="adv-author-info">
                          <UsersRound size={14} className="text-gray-400" />
                          <span>ผู้เขียน: {authorsText}</span>
                        </div>
                        {item.updated_at && (
                          <div className="adv-date-info">
                            <Calendar size={14} className="text-gray-400" />
                            <span>
                              อัปเดต:{" "}
                              {new Intl.DateTimeFormat("th-TH", {
                                dateStyle: "medium",
                              }).format(new Date(item.updated_at))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="adv-item-actions">
                      <Link href={`/research/${item.id}`} className="adv-action-btn view">
                        <BookOpen size={14} />
                        <span>อ่านผลงาน</span>
                      </Link>
                      {activeTab === "pending" || item.status === "pending" ? (
                        <Link
                          href={`/advisor/reviews/${item.id}`}
                          className="adv-action-btn review"
                        >
                          <ClipboardClock size={14} />
                          <span>ตรวจประเมิน</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/advisor/reviews/${item.id}`}
                          className="adv-action-btn details"
                        >
                          <MessageSquare size={14} />
                          <span>ประวัติ/ความเห็น</span>
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Panel for advisory rules and instructions */}
        <aside className="adv-sidebar-panel">
          <div className="adv-sidebar-card">
            <h3>สถิติและการมีส่วนร่วม</h3>
            <div className="adv-sidebar-stat-list">
              <div className="adv-sidebar-stat-row">
                <span>อัตราการอนุมัติผลงาน</span>
                <strong>
                  {allResearch.length
                    ? Math.round(
                        (allResearch.filter((item) => item.status === "approved").length /
                          allResearch.length) *
                          100
                      )
                    : 0}
                  %
                </strong>
              </div>
              <div className="adv-sidebar-stat-row">
                <span>หมวดหมู่ผลงานทั้งหมด</span>
                <strong>{categories.length} หมวด</strong>
              </div>
              <div className="adv-sidebar-stat-row">
                <span>ยอดเข้าชมผลงานรวม</span>
                <strong>
                  {allResearch.reduce((sum, item) => sum + (item.view_count || 0), 0).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          <div className="adv-sidebar-card">
            <h3>ขอบเขตและหน้าที่การตรวจสอบ</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              อาจารย์ที่ปรึกษาทุกท่านสามารถตรวจสอบงานในคิวรอประเมินส่วนกลาง
              เมื่อผลงานได้รับอนุมัติแล้วจะเผยแพร่บนหน้าเว็บไซต์หลักทันที
            </p>
            <div className="adv-checklist">
              <div className="adv-checklist-item">
                <div className="adv-check">✓</div>
                <span>ตรวจสอบไฟล์ PDF และบทคัดย่อ</span>
              </div>
              <div className="adv-checklist-item">
                <div className="adv-check">✓</div>
                <span>อนุมัติเพื่อให้ระบบเผยแพร่ข้อมูล</span>
              </div>
              <div className="adv-checklist-item">
                <div className="adv-check">✓</div>
                <span>หรือระบุคำแนะนำเพื่อให้ส่งกลับแก้ไข</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
