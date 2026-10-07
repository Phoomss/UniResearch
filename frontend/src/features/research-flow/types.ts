export interface FlowTask {
  id: string; agent_type: string; status: string; retry_count: number;
  depends_on: string | null; error: string | null; duration_ms: number | null;
}
export interface FlowSource {
  id: string; title: string; authors: string[]; url: string; provider: string;
  document_id: number; year: number | null; doi: string | null; retrieved_at: string;
  chunk_ref: string; page: number | null; retrieval_score: number; content: string;
}
export interface FlowClaim { id: string; text: string; strength: string; verified: number }
export interface FlowEvidence {
  id: string; claim_id: string; source_id: string; quote: string;
  relation: string; locator: string; support_verified: number;
}
export interface FlowSentence { section: string; text: string; claim_id: string; source_ids: string[] }
export interface FlowPaper {
  id: string; source_id: string;
  summary: { interpretation: string; objective: { text: string; quote: string } | null;
    methodology: { text: string; quote: string } | null; dataset: { text: string; quote: string } | null;
    findings: { text: string; quote: string }[]; limitations: { text: string; quote: string }[];
    conclusions: { text: string; quote: string }[] };
}
export interface Flow {
  id: string; research_question: string; depth: string; status: string; started_at: string | null;
  plan: { sub_questions?: string[]; queries?: string[]; summary?: string };
  draft: { sentences?: FlowSentence[] }; limitations: string[];
  iteration: number; search_rounds: number; confidence: number;
  llm_calls: number; input_tokens: number; output_tokens: number;
  metrics: Record<string, number | boolean>;
  critic_feedback: { status?: string; action?: string; issues?: { type: string; reason: string; recommended_action: string }[] };
  tasks: FlowTask[]; sources: FlowSource[]; papers: FlowPaper[]; claims: FlowClaim[];
  evidence: FlowEvidence[]; citations: { id: string; claim_id: string; source_id: string; evidence_id: string; sentence_index: number }[];
  events: { id: number; event_type: string; summary: string }[];
}
