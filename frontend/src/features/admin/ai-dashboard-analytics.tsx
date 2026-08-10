"use client";

import { useState } from "react";
import { Sparkles, Brain, Loader2, RefreshCw, BarChart2, TrendingUp, Lightbulb, Users } from "lucide-react";
import { getDashboardInsights, type AIDashboardInsights } from "@/src/services/ai";
import { useToast } from "@/src/components/ui/Toast";

interface AIDashboardAnalyticsProps {
  stats: {
    total_users: number;
    total_research_works: number;
    total_views: number;
    total_downloads: number;
  };
  categories: Array<{
    id: number;
    category_name: string;
  }>;
  researchList: any[];
}

export function AIDashboardAnalytics({
  stats,
  categories,
  researchList
}: AIDashboardAnalyticsProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<AIDashboardInsights | null>(null);
  const toast = useToast();

  const handleGenerateInsights = async (force = false) => {
    if (insights && !force) return;
    setLoading(true);
    try {
      const data = await getDashboardInsights({
        stats,
        categories,
        research_list: researchList
      });
      setInsights(data);
      toast.success("ประมวลผลข้อมูลเชิงลึกสำเร็จ");
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลวิเคราะห์จาก AI");
    } finally {
      setLoading(false);
    }
  };

  const getMomentumColor = (momentum: string) => {
    switch (momentum.toLowerCase()) {
      case "high":
        return "rgba(16, 185, 129, 0.15)";
      case "medium":
        return "rgba(245, 158, 11, 0.15)";
      case "low":
      default:
        return "rgba(148, 163, 184, 0.15)";
    }
  };

  const getMomentumTextColor = (momentum: string) => {
    switch (momentum.toLowerCase()) {
      case "high":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "low":
      default:
        return "#94a3b8";
    }
  };

  return (
    <div className="panel" style={{
      marginTop: "24px",
      padding: "24px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, var(--paper) 0%, rgba(72, 39, 106, 0.03) 100%)",
      border: "1px solid #48276a20",
      boxShadow: "0 4px 20px rgba(72, 39, 106, 0.05)"
    }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            background: "linear-gradient(135deg, #48276a 0%, #8faaf0 100%)",
            padding: "8px",
            borderRadius: "10px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              ระบบวิเคราะห์ข้อมูลและประมวลผลเชิงลึก (AI-Powered Analytics)
            </h2>
            <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
              ประเมินทิศทางงานวิจัย เทรนด์ยอดนิยม และข้อแนะนำเชิงยุทธศาสตร์ด้วย Gemini AI
            </p>
          </div>
        </div>
        
        <button
          onClick={() => handleGenerateInsights(true)}
          disabled={loading}
          className="btn btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.85rem",
            padding: "8px 16px",
            height: "auto",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #48276a 0%, #30164c 100%)",
            border: "none",
            boxShadow: "0 2px 8px rgba(72, 39, 106, 0.2)"
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : insights ? (
            <RefreshCw size={14} />
          ) : (
            <Brain size={14} />
          )}
          {insights ? "อัปเดตบทวิเคราะห์" : "เริ่มประมวลผลเชิงลึก"}
        </button>
      </header>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: "16px" }}>
          <Loader2 className="animate-spin" size={36} style={{ color: "#48276a" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 600, margin: "0 0 4px 0", color: "var(--ink)" }}>AI กำลังทำการวิเคราะห์ฐานข้อมูล...</p>
            <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>กระบวนการนี้ใช้เวลาประมาณ 3-5 วินาทีในการประมวลผลข้อมูล</p>
          </div>
        </div>
      )}

      {!loading && !insights && (
        <div style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "rgba(72, 39, 106, 0.01)",
          border: "1px dashed rgba(72, 39, 106, 0.15)",
          borderRadius: "8px"
        }}>
          <p className="muted" style={{ margin: "0 0 16px 0", fontSize: "0.9rem" }}>
            กดปุ่มด้านบนเพื่อให้ AI เริ่มทำการสังเคราะห์ข้อมูลดิบของระบบ อาทิ ยอดชมการเข้าดู, ข้อมูลการดาวน์โหลด, คำสำคัญ, และหมวดหมู่สาขาวิชา
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleGenerateInsights()}
            style={{ borderRadius: "8px" }}
          >
            เริ่มการสังเคราะห์ข้อมูลเชิงลึก
          </button>
        </div>
      )}

      {!loading && insights && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.5s ease" }}>
          
          {/* Overview Analysis */}
          <div style={{
            padding: "20px",
            borderLeft: "4px solid #48276a",
            background: "rgba(72, 39, 106, 0.02)",
            borderRadius: "0 10px 10px 0"
          }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: "#48276a" }}>
              <BarChart2 size={18} /> บทวิเคราะห์และประเมินภาพรวม (Executive Summary)
            </h3>
            <p style={{ margin: 0, fontSize: "0.925rem", lineHeight: 1.6, color: "var(--ink)" }}>
              {insights.overview_analysis}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", minWidth: "0", flexWrap: "wrap" }}>
            
            {/* Trending Topics */}
            <div style={{
              background: "var(--paper)",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(72, 39, 106, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: "var(--ink)" }}>
                <TrendingUp size={18} style={{ color: "#10b981" }} /> แนวโน้มและสาขาวิจัยที่มาแรง (Trending Topics)
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                {insights.trending_topics?.map((topic, index) => (
                  <div key={index} style={{
                    padding: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(0,0,0,0.04)",
                    borderRadius: "8px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "0.9rem", color: "var(--ink)" }}>{topic.topic}</strong>
                      <span style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: getMomentumColor(topic.momentum),
                        color: getMomentumTextColor(topic.momentum)
                      }}>
                        {topic.momentum} Momentum
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.4 }}>
                      {topic.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div style={{
              background: "var(--paper)",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid rgba(72, 39, 106, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: "var(--ink)" }}>
                <Lightbulb size={18} style={{ color: "#f59e0b" }} /> ข้อแนะนำเชิงยุทธศาสตร์เพื่อการพัฒนา (Strategic Actions)
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px", flex: 1 }}>
                {insights.strategic_recommendations?.map((rec, index) => (
                  <div key={index} style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    background: "rgba(72, 39, 106, 0.01)",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(72, 39, 106, 0.03)"
                  }}>
                    <span style={{
                      color: "#48276a",
                      fontWeight: 700,
                      background: "rgba(72, 39, 106, 0.08)",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <span style={{ color: "var(--ink)" }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Reviewer Workload Analysis */}
          <div style={{
            background: "var(--paper)",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid rgba(72, 39, 106, 0.08)"
          }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", color: "var(--ink)" }}>
              <Users size={18} style={{ color: "#48276a" }} /> บทวิเคราะห์กระบวนการและภาระงานผู้ตรวจประเมิน (Reviewer & Advisor Analysis)
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.5, color: "var(--ink)" }}>
              {insights.reviewer_workload_analysis}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
