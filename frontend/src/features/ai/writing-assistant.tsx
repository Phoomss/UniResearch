"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Tag,
  CheckCircle,
  ChevronDown,
  Loader2,
  Wand2,
  RefreshCw,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/src/components/ui/Toast";
import {
  generateAbstract,
  suggestTitles,
  suggestKeywords,
  checkWriting,
  type CheckWritingResult,
} from "@/src/services/ai";

type FormValues = {
  title_th: string;
  title_en: string;
  abstract: string;
  keywords: string;
  category_id: string;
};

type Props = {
  values: FormValues;
  onUpdate: (field: string, value: string) => void;
  categories: Array<{ id: number; category_name: string }>;
  disabled?: boolean;
};

export function AIWritingAssistant({
  values,
  onUpdate,
  categories,
  disabled,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "abstract" | "title" | "keywords" | "writing"
  >("abstract");
  const [loading, setLoading] = useState<string | null>(null);

  const [abstractResult, setAbstractResult] = useState<{
    text: string;
    lang: string;
  } | null>(null);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [writingResult, setWritingResult] =
    useState<CheckWritingResult | null>(null);
  const toast = useToast();

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id.toString() === id)?.category_name || "";

  /* ─── Handlers ─── */

  const handleGenerateAbstract = async (lang: "th" | "en") => {
    if (!values.title_th && !values.title_en) {
      toast.error("กรุณาระบุชื่อผลงานอย่างน้อยหนึ่งภาษาก่อน");
      return;
    }
    setLoading(`abstract-${lang}`);
    try {
      const res = await generateAbstract({
        title_th: values.title_th,
        title_en: values.title_en,
        keywords: values.keywords || undefined,
        language: lang,
      });
      setAbstractResult({ text: res.abstract, lang: res.language });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างบทคัดย่อ";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const handleSuggestTitles = async (lang: "th" | "en") => {
    if (!values.abstract && !values.keywords) {
      toast.error("กรุณาระบุบทคัดย่อหรือคำสำคัญก่อน");
      return;
    }
    setLoading(`titles-${lang}`);
    try {
      const res = await suggestTitles({
        abstract: values.abstract || undefined,
        keywords: values.keywords || undefined,
        category: getCategoryName(values.category_id) || undefined,
        language: lang,
      });
      setTitleSuggestions(res.suggestions);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const handleSuggestKeywords = async () => {
    if (!values.title_th && !values.title_en && !values.abstract) {
      toast.error("กรุณาระบุชื่อผลงานหรือบทคัดย่อก่อน");
      return;
    }
    setLoading("keywords");
    try {
      const res = await suggestKeywords({
        title_th: values.title_th || undefined,
        title_en: values.title_en || undefined,
        abstract: values.abstract || undefined,
      });
      setKeywordSuggestions(res.keywords);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const handleCheckWriting = async () => {
    if (!values.abstract) {
      toast.error("ไม่มีเนื้อหาบทคัดย่อให้ตรวจสอบ");
      return;
    }
    setLoading("writing");
    try {
      const lang = /[\u0E00-\u0E7F]/.test(values.abstract) ? "th" : "en";
      const res = await checkWriting({ text: values.abstract, language: lang });
      setWritingResult(res);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  /* ─── Apply helpers ─── */

  const applyAbstract = () => {
    if (abstractResult) {
      onUpdate("abstract", abstractResult.text);
      toast.success("นำบทคัดย่อไปใช้แล้ว");
    }
  };

  const applyTitle = (title: string, lang: "th" | "en") => {
    onUpdate(lang === "th" ? "title_th" : "title_en", title);
    toast.success("นำชื่อผลงานไปใช้แล้ว");
  };

  const applyKeyword = (keyword: string) => {
    const current = values.keywords
      ? values.keywords.split(",").map((k) => k.trim())
      : [];
    if (!current.includes(keyword)) {
      const next = current.filter(Boolean);
      next.push(keyword);
      onUpdate("keywords", next.join(", "));
    }
  };

  const applyAllKeywords = () => {
    const current = values.keywords
      ? values.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];
    const newKw = keywordSuggestions.filter((k) => !current.includes(k));
    onUpdate("keywords", [...current, ...newKw].join(", "));
    toast.success("เพิ่มคำสำคัญทั้งหมดแล้ว");
  };

  const applyWritingFix = () => {
    if (writingResult?.improved_text) {
      onUpdate("abstract", writingResult.improved_text);
      setWritingResult(null);
      toast.success("ปรับปรุงการเขียนแล้ว");
    }
  };

  const scoreClass = (score: number) =>
    score >= 80 ? "high" : score >= 50 ? "medium" : "low";

  /* ─── Loading indicator ─── */
  const renderLoading = () => (
    <div className="ai-loading">
      <Loader2 size={18} />
      <span>กำลังประมวลผล AI...</span>
    </div>
  );

  /* ─── Tab: Abstract ─── */
  const renderAbstractTab = () => (
    <div>
      <p className="ai-assistant-section-title">สร้างบทคัดย่ออัตโนมัติ</p>
      <p className="ai-assistant-section-desc">
        AI จะสร้างบทคัดย่อจากชื่อผลงานและคำสำคัญที่ระบุไว้
      </p>
      <div className="ai-action-row">
        <button
          type="button"
          className="ai-action-btn"
          disabled={disabled || loading !== null}
          onClick={() => handleGenerateAbstract("th")}
        >
          {loading === "abstract-th" ? (
            <Loader2 size={14} />
          ) : (
            <Wand2 size={14} />
          )}
          สร้างบทคัดย่อ (TH)
        </button>
        <button
          type="button"
          className="ai-action-btn"
          disabled={disabled || loading !== null}
          onClick={() => handleGenerateAbstract("en")}
        >
          {loading === "abstract-en" ? (
            <Loader2 size={14} />
          ) : (
            <Wand2 size={14} />
          )}
          สร้างบทคัดย่อ (EN)
        </button>
      </div>

      {(loading === "abstract-th" || loading === "abstract-en") &&
        renderLoading()}

      {abstractResult && !loading && (
        <div className="ai-assistant-result">
          <div className="ai-result-header">
            <span className="ai-result-label">
              ผลลัพธ์ ({abstractResult.lang === "th" ? "ภาษาไทย" : "English"})
            </span>
            <div className="ai-result-actions">
              <button
                type="button"
                className="ai-regenerate-btn"
                onClick={() =>
                  handleGenerateAbstract(
                    abstractResult.lang === "th" ? "th" : "en",
                  )
                }
              >
                <RefreshCw size={12} /> สร้างใหม่
              </button>
              <button
                type="button"
                className="ai-apply-btn"
                onClick={applyAbstract}
              >
                <Check size={12} /> นำไปใช้
              </button>
            </div>
          </div>
          <p className="ai-result-text">{abstractResult.text}</p>
        </div>
      )}
    </div>
  );

  /* ─── Tab: Titles ─── */
  const renderTitleTab = () => (
    <div>
      <p className="ai-assistant-section-title">แนะนำชื่อผลงาน</p>
      <p className="ai-assistant-section-desc">
        AI จะแนะนำชื่อผลงานจากบทคัดย่อและคำสำคัญที่ระบุไว้
      </p>
      <div className="ai-action-row">
        <button
          type="button"
          className="ai-action-btn"
          disabled={disabled || loading !== null}
          onClick={() => handleSuggestTitles("th")}
        >
          {loading === "titles-th" ? (
            <Loader2 size={14} />
          ) : (
            <Wand2 size={14} />
          )}
          แนะนำชื่อ (TH)
        </button>
        <button
          type="button"
          className="ai-action-btn"
          disabled={disabled || loading !== null}
          onClick={() => handleSuggestTitles("en")}
        >
          {loading === "titles-en" ? (
            <Loader2 size={14} />
          ) : (
            <Wand2 size={14} />
          )}
          แนะนำชื่อ (EN)
        </button>
      </div>

      {(loading === "titles-th" || loading === "titles-en") && renderLoading()}

      {titleSuggestions.length > 0 && !loading && (
        <div className="ai-suggestion-list">
          {titleSuggestions.map((title, idx) => {
            const isTh = /[\u0E00-\u0E7F]/.test(title);
            return (
              <div
                key={idx}
                className="ai-suggestion-item"
                onClick={() => applyTitle(title, isTh ? "th" : "en")}
              >
                <span className="ai-suggestion-number">{idx + 1}</span>
                <span className="ai-suggestion-text">{title}</span>
                <button
                  type="button"
                  className="ai-suggestion-apply"
                  title="นำไปใช้"
                >
                  <Check size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ─── Tab: Keywords ─── */
  const renderKeywordsTab = () => {
    const currentKwList = values.keywords
      ? values.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

    return (
      <div>
        <p className="ai-assistant-section-title">แนะนำคำสำคัญ</p>
        <p className="ai-assistant-section-desc">
          AI จะวิเคราะห์ชื่อผลงานและบทคัดย่อเพื่อแนะนำคำสำคัญที่เหมาะสม
        </p>
        <div className="ai-action-row">
          <button
            type="button"
            className="ai-action-btn"
            disabled={disabled || loading !== null}
            onClick={handleSuggestKeywords}
          >
            {loading === "keywords" ? (
              <Loader2 size={14} />
            ) : (
              <Tag size={14} />
            )}
            สร้างคำสำคัญ
          </button>
        </div>

        {loading === "keywords" && renderLoading()}

        {keywordSuggestions.length > 0 && !loading && (
          <>
            <div className="ai-keyword-chips">
              {keywordSuggestions.map((kw, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`ai-keyword-chip ${currentKwList.includes(kw) ? "selected" : ""}`}
                  onClick={() => applyKeyword(kw)}
                >
                  {kw}
                  {currentKwList.includes(kw) ? (
                    <Check size={10} />
                  ) : (
                    <span>+</span>
                  )}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button
                type="button"
                className="ai-apply-btn"
                onClick={applyAllKeywords}
              >
                <Check size={12} /> เพิ่มทั้งหมด
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  /* ─── Tab: Writing Check ─── */
  const renderWritingTab = () => (
    <div>
      <p className="ai-assistant-section-title">ตรวจสอบคุณภาพการเขียน</p>
      <p className="ai-assistant-section-desc">
        AI จะตรวจไวยากรณ์ ความชัดเจน
        และรูปแบบการเขียนเชิงวิชาการของบทคัดย่อ
      </p>
      <div className="ai-action-row">
        <button
          type="button"
          className="ai-action-btn"
          disabled={disabled || loading !== null || !values.abstract}
          onClick={handleCheckWriting}
        >
          {loading === "writing" ? (
            <Loader2 size={14} />
          ) : (
            <CheckCircle size={14} />
          )}
          ตรวจสอบบทคัดย่อ
        </button>
      </div>

      {loading === "writing" && renderLoading()}

      {writingResult && !loading && (
        <div className="ai-assistant-result">
          {/* Score */}
          <div className={`ai-score-badge ${scoreClass(writingResult.score)}`}>
            {writingResult.score}
            <span className="ai-score-label">/ 100 คะแนน</span>
          </div>

          {/* Issues */}
          {writingResult.issues.length > 0 && (
            <div className="ai-issues-list">
              {writingResult.issues.map((issue, idx) => (
                <div key={idx} className="ai-issue-card">
                  <p className="ai-issue-original">
                    <AlertCircle
                      size={12}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                        marginRight: 4,
                      }}
                    />
                    {issue.original}
                  </p>
                  <p className="ai-issue-suggestion">→ {issue.suggestion}</p>
                  <p className="ai-issue-reason">{issue.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improved text */}
          {writingResult.improved_text && (
            <div style={{ marginTop: 12 }}>
              <div className="ai-result-header">
                <span className="ai-result-label">ฉบับปรับปรุง</span>
                <button
                  type="button"
                  className="ai-apply-btn"
                  onClick={applyWritingFix}
                >
                  <Check size={12} /> นำไปใช้
                </button>
              </div>
              <p className="ai-result-text">{writingResult.improved_text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  /* ─── Render ─── */
  const tabs = [
    { key: "abstract" as const, label: "บทคัดย่อ", icon: FileText },
    { key: "title" as const, label: "ชื่อผลงาน", icon: Wand2 },
    { key: "keywords" as const, label: "คำสำคัญ", icon: Tag },
    { key: "writing" as const, label: "ตรวจสอบ", icon: CheckCircle },
  ];

  return (
    <div style={{ marginTop: 16 }}>
      {/* Toggle */}
      <button
        type="button"
        className={`ai-assistant-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span className="sparkle-icon">
          <Sparkles size={16} />
        </span>
        AI ผู้ช่วยเขียน
        <ChevronDown
          size={14}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s",
            marginLeft: 4,
          }}
        />
      </button>

      {/* Panel */}
      <div className={`ai-assistant-panel ${isOpen ? "open" : ""}`}>
        <div className="ai-assistant-panel-inner">
          <div className="ai-assistant-panel-content">
            {/* Tabs */}
            <div className="ai-assistant-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`ai-assistant-tab ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "abstract" && renderAbstractTab()}
            {activeTab === "title" && renderTitleTab()}
            {activeTab === "keywords" && renderKeywordsTab()}
            {activeTab === "writing" && renderWritingTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
