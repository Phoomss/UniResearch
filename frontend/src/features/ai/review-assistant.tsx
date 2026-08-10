"use client";

import { useState } from "react";
import {
  Sparkles,
  FileCheck2,
  AlertTriangle,
  UserCheck,
  ClipboardList,
  Loader2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Info
} from "lucide-react";
import { useToast } from "@/src/components/ui/Toast";

interface ReviewAssistantProps {
  researchId: number;
}

type TabType = "pre-review" | "plagiarism" | "reviewer-match" | "review-summary";

interface PreReviewResult {
  structure_score: number;
  methodology_score: number;
  language_score: number;
  strengths: string[];
  weaknesses: string[];
  methodology_feedback: string;
  suggestions: string[];
  overall_evaluation: string;
}

interface PlagiarismMatch {
  research_id: number;
  title: string;
  similarity_score: number;
  reasons: string[];
}

interface PlagiarismResult {
  overall_similarity_score: number;
  matches: PlagiarismMatch[];
  verdict: string;
}

interface AdvisorMatch {
  advisor_id: number;
  name: string;
  score: number;
  reason: string;
}

interface ReviewerMatchResult {
  matches: AdvisorMatch[];
}

interface ReviewSummaryResult {
  executive_summary: string;
  key_issues_raised: string[];
  improvement_sentiment: string;
}

export function AIReviewAssistant({ researchId }: ReviewAssistantProps) {
  const [activeTab, setActiveTab] = useState<TabType>("pre-review");
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const [preReview, setPreReview] = useState<PreReviewResult | null>(null);
  const [plagiarism, setPlagiarism] = useState<PlagiarismResult | null>(null);
  const [reviewerMatch, setReviewerMatch] = useState<ReviewerMatchResult | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryResult | null>(null);

  const fetchAnalysis = async (tab: TabType, force = false) => {
    if (!force) {
      if (tab === "pre-review" && preReview) return;
      if (tab === "plagiarism" && plagiarism) return;
      if (tab === "reviewer-match" && reviewerMatch) return;
      if (tab === "review-summary" && reviewSummary) return;
    }

    setLoading(true);
    try {
      const endpointMap: Record<TabType, string> = {
        "pre-review": "ai-pre-review",
        "plagiarism": "ai-plagiarism",
        "reviewer-match": "ai-reviewer-match",
        "review-summary": "ai-review-summary",
      };

      const response = await fetch(`/api/research/${researchId}/${endpointMap[tab]}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || "ไม่สามารถดำเนินการวิเคราะห์ด้วย AI ได้");
      }

      const data = await response.json();

      if (tab === "pre-review") setPreReview(data);
      if (tab === "plagiarism") setPlagiarism(data);
      if (tab === "reviewer-match") setReviewerMatch(data);
      if (tab === "review-summary") setReviewSummary(data);

      toast.success("วิเคราะห์ข้อมูลสำเร็จ");
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    fetchAnalysis(tab);
  };

  return (
    <div className="panel" style={{ marginTop: "24px", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color, rgba(255,255,255,0.08))" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Sparkles style={{ color: "#3b82f6" }} size={22} />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>AI Peer Review Assistant</h2>
        </div>
        <button
          onClick={() => fetchAnalysis(activeTab, true)}
          disabled={loading}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", padding: "6px 12px", height: "auto" }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <RefreshCw size={14} />
          )}
          วิเคราะห์ใหม่
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => handleTabChange("pre-review")}
          type="button"
          className={`btn ${activeTab === "pre-review" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
        >
          <FileCheck2 size={16} /> Pre-Review Analysis
        </button>
        <button
          onClick={() => handleTabChange("plagiarism")}
          type="button"
          className={`btn ${activeTab === "plagiarism" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
        >
          <AlertTriangle size={16} /> Plagiarism Check
        </button>
        <button
          onClick={() => handleTabChange("reviewer-match")}
          type="button"
          className={`btn ${activeTab === "reviewer-match" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
        >
          <UserCheck size={16} /> Reviewer Matching
        </button>
        <button
          onClick={() => handleTabChange("review-summary")}
          type="button"
          className={`btn ${activeTab === "review-summary" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
        >
          <ClipboardList size={16} /> Review Summary
        </button>
      </div>

      {/* Content Container */}
      <div style={{ minHeight: "150px", position: "relative" }}>
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: "12px" }}>
            <Loader2 className="animate-spin" size={32} style={{ color: "#3b82f6" }} />
            <p className="muted" style={{ fontSize: "0.9rem" }}>AI กำลังประมวลผลการวิเคราะห์ข้อมูล...</p>
          </div>
        )}

        {!loading && activeTab === "pre-review" && (
          <div>
            {!preReview ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p className="muted">คลิกปุ่มเพื่อเริ่มทำ Pre-Review Analysis แรกเริ่มสำหรับผลงานนี้</p>
                <button type="button" className="btn btn-primary" onClick={() => fetchAnalysis("pre-review")} style={{ marginTop: "12px" }}>เริ่มวิเคราะห์</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Score Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                  <div style={{ padding: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                    <span className="muted" style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>คะแนนโครงสร้าง</span>
                    <strong style={{ fontSize: "1.5rem", color: "#3b82f6" }}>
                      {preReview.structure_score}/100
                    </strong>
                  </div>
                  <div style={{ padding: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                    <span className="muted" style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>คะแนนระเบียบวิธีวิจัย</span>
                    <strong style={{ fontSize: "1.5rem", color: "#3b82f6" }}>
                      {preReview.methodology_score}/100
                    </strong>
                  </div>
                  <div style={{ padding: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
                    <span className="muted" style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>คะแนนภาษาและวิชาการ</span>
                    <strong style={{ fontSize: "1.5rem", color: "#3b82f6" }}>
                      {preReview.language_score}/100
                    </strong>
                  </div>
                </div>

                {/* Overall Eval */}
                <div style={{ padding: "16px", borderLeft: "4px solid #3b82f6", background: "rgba(59,130,246,0.05)", borderRadius: "0 8px 8px 0" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem", fontWeight: 600 }}>บทประเมินภาพรวม</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>{preReview.overall_evaluation}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", minWidth: "0" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", color: "#10b981" }}>
                      <ThumbsUp size={16} /> จุดเด่น / ข้อดี
                    </h4>
                    <ul style={{ paddingLeft: "20px", margin: 0, fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {preReview.strengths?.map((str, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>{str}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", color: "#ef4444" }}>
                      <ThumbsDown size={16} /> จุดที่ควรระวัง / ข้อบกพร่อง
                    </h4>
                    <ul style={{ paddingLeft: "20px", margin: 0, fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {preReview.weaknesses?.map((weak, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>{weak}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Methodology Feedback */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "8px" }}>ความคิดเห็นต่อระเบียบวิธีวิจัย</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.5, background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>{preReview.methodology_feedback}</p>
                </div>

                {/* Suggestions */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "8px" }}>คำแนะนำเพื่อการปรับปรุงพัฒนา</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {preReview.suggestions?.map((sug, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "8px", fontSize: "0.85rem", lineHeight: 1.5, background: "rgba(255,255,255,0.01)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.03)" }}>
                        <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{idx + 1}.</span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "plagiarism" && (
          <div>
            {!plagiarism ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p className="muted">เริ่มระบบ Plagiarism Checking เทียบกับคลังงานวิจัยระบบภายใน</p>
                <button type="button" className="btn btn-primary" onClick={() => fetchAnalysis("plagiarism")} style={{ marginTop: "12px" }}>ตรวจสอบการคัดลอกผลงาน</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Similarity Gauge */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ position: "relative", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "4px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: plagiarism.overall_similarity_score > 30 ? "#f87171" : plagiarism.overall_similarity_score > 15 ? "#fbbf24" : "#34d399" }}>
                      {plagiarism.overall_similarity_score}%
                    </span>
                  </div>
                  <div>
                    <span className="muted" style={{ fontSize: "0.8rem", display: "block" }}>ดัชนีการลอกเลียนวรรณกรรม</span>
                    <strong style={{ fontSize: "1.2rem", display: "block", marginTop: "4px" }}>
                      คำสั่งวินิจฉัย: <span style={{ color: plagiarism.overall_similarity_score > 30 ? "#f87171" : plagiarism.overall_similarity_score > 15 ? "#fbbf24" : "#34d399" }}>{plagiarism.verdict}</span>
                    </strong>
                    <p className="muted" style={{ margin: "4px 0 0 0", fontSize: "0.8rem" }}>วิเคราะห์เปรียบเทียบข้อมูลหัวข้อและโครงเรื่องกับเอกสารอื่นภายในระบบ</p>
                  </div>
                </div>

                {/* Matched Papers */}
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "12px" }}>รายการเอกสารที่มีความสอดคล้องกันสูง</h4>
                  {plagiarism.matches?.length === 0 ? (
                    <p className="muted" style={{ fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>ไม่พบเอกสารที่มีส่วนคล้ายคลึงกันในระดับนัยสำคัญ</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {plagiarism.matches?.map((match) => (
                        <div key={match.research_id} style={{ padding: "14px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", background: "rgba(255,255,255,0.01)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#e2e8f0" }}>{match.title}</span>
                            <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", background: match.similarity_score > 30 ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: match.similarity_score > 30 ? "#f87171" : "#fbbf24" }}>
                              สอดคล้อง {match.similarity_score}%
                            </span>
                          </div>
                          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.5 }}>
                            {match.reasons?.map((reason, rIdx) => (
                              <li key={rIdx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "reviewer-match" && (
          <div>
            {!reviewerMatch ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p className="muted">เรียกให้ AI จับคู่และแนะนำที่ปรึกษาที่เหมาะสมกับเนื้อหาหัวข้อวิจัยนี้</p>
                <button type="button" className="btn btn-primary" onClick={() => fetchAnalysis("reviewer-match")} style={{ marginTop: "12px" }}>จับคู่ที่ปรึกษา</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>อาจารย์ที่ปรึกษาและผู้ตรวจที่แนะนำ</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                  {reviewerMatch.matches?.map((match) => (
                    <div key={match.advisor_id} style={{ display: "flex", gap: "16px", padding: "16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", background: "rgba(255,255,255,0.02)", alignItems: "center" }}>
                      <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "rgba(59,130,246,0.1)", border: "2px solid #3b82f6", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                        {match.score}%
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "0.95rem" }}>{match.name}</strong>
                        </div>
                        <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#94a3b8" }}>{match.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === "review-summary" && (
          <div>
            {!reviewSummary ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p className="muted">สร้างสรุปข้อแนะนำและประเด็นปรับปรุงจากประวัติการตรวจทั้งหมด</p>
                <button type="button" className="btn btn-primary" onClick={() => fetchAnalysis("review-summary")} style={{ marginTop: "12px" }}>ประมวลสรุปการประเมิน</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>สรุปความก้าวหน้า</h4>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "0.75rem",
                      background: reviewSummary.improvement_sentiment === "Positive" ? "rgba(52,211,153,0.15)" : reviewSummary.improvement_sentiment === "Negative" ? "rgba(239,68,68,0.15)" : "rgba(148,163,184,0.15)",
                      color: reviewSummary.improvement_sentiment === "Positive" ? "#34d399" : reviewSummary.improvement_sentiment === "Negative" ? "#f87171" : "#94a3b8"
                    }}>
                      ทิศทาง: {reviewSummary.improvement_sentiment}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>{reviewSummary.executive_summary}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "8px" }}>ประเด็นสำคัญที่ถูกหยิบยกขึ้นมา (Key Issues)</h4>
                  {reviewSummary.key_issues_raised?.length === 0 ? (
                    <p className="muted" style={{ fontSize: "0.85rem" }}>ไม่มีประเด็นติดค้างหรือไม่มีประวัติการประเมินประเด็นสำคัญ</p>
                  ) : (
                    <ul style={{ paddingLeft: "20px", margin: 0, fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {reviewSummary.key_issues_raised?.map((issue, idx) => (
                        <li key={idx} style={{ marginBottom: "4px" }}>{issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
