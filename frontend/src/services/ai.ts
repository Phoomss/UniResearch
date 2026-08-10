import { apiJson } from "@/src/lib/api/client";

export interface GenerateAbstractParams {
  title_th: string;
  title_en: string;
  keywords?: string;
  language: "th" | "en";
}

export interface SuggestTitlesParams {
  abstract?: string;
  keywords?: string;
  category?: string;
  language: "th" | "en";
}

export interface SuggestKeywordsParams {
  title_th?: string;
  title_en?: string;
  abstract?: string;
}

export interface CheckWritingParams {
  text: string;
  language: "th" | "en";
}

export interface WritingIssue {
  original: string;
  suggestion: string;
  reason: string;
}

export interface CheckWritingResult {
  issues: WritingIssue[];
  improved_text: string;
  score: number;
}

// ใช้ fetch ยิงหา Next.js Proxy Route บน Port 3000 เสมอ เพื่อไม่ให้เรียกตรงไปหลังบ้านและหลีกเลี่ยง CORS
async function callAI<T>(action: string, data: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || err.error?.detail || "AI ไม่สามารถดำเนินการได้");
  }
  
  return response.json();
}

export async function generateAbstract(params: GenerateAbstractParams): Promise<{ abstract: string; language: string }> {
  return callAI("generate-abstract", params as unknown as Record<string, unknown>);
}

export async function suggestTitles(params: SuggestTitlesParams): Promise<{ suggestions: string[] }> {
  return callAI("suggest-titles", params as unknown as Record<string, unknown>);
}

export async function suggestKeywords(params: SuggestKeywordsParams): Promise<{ keywords: string[] }> {
  return callAI("suggest-keywords", params as unknown as Record<string, unknown>);
}

export async function checkWriting(params: CheckWritingParams): Promise<CheckWritingResult> {
  return callAI("check-writing", params as unknown as Record<string, unknown>);
}

export interface AIDashboardInsights {
  overview_analysis: string;
  trending_topics: Array<{
    topic: string;
    momentum: "High" | "Medium" | "Low";
    reason: string;
  }>;
  reviewer_workload_analysis: string;
  strategic_recommendations: string[];
}

export async function getDashboardInsights(params: {
  stats: Record<string, unknown>;
  categories: Array<{ id: number; category_name: string }>;
  research_list: Array<Record<string, unknown>>;
}): Promise<AIDashboardInsights> {
  return callAI("dashboard-insights", params as unknown as Record<string, unknown>);
}

