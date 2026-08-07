import { apiRequest } from "@/src/lib/api/client";
import type { ResearchWorkResponse, ResearchParticipantsResponse, ReviewCommentCreate, ReviewCommentResponse, DownloadHandshake, ApiResult } from "@/src/lib/api/types";

/**
 * Creates a new research submission.
 * @param formData FormData containing title, files, and participants.
 * @param token JWT session token.
 */
export async function createResearch(formData: FormData, token: string): Promise<ApiResult<ResearchWorkResponse>> {
  return apiRequest<ResearchWorkResponse>("/research/", {
    method: "POST",
    token,
    body: formData,
  });
}

/**
 * Retrieves the details of a single research work by ID.
 * @param id The research work database ID.
 */
export async function getResearch(id: number): Promise<ApiResult<ResearchWorkResponse>> {
  return apiRequest<ResearchWorkResponse>(`/research/${id}`);
}

/**
 * Searches and filters research submissions.
 * @param q Query keyword string.
 * @param categoryId Optional category ID filter.
 */
export async function searchResearch(q?: string, categoryId?: number): Promise<ApiResult<ResearchWorkResponse[]>> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (categoryId) params.set("category_id", String(categoryId));
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<ResearchWorkResponse[]>(`/research/search${queryString}`);
}

/**
 * Retrieves lists of active participants (students and advisors).
 * @param token JWT session token.
 */
export async function getResearchParticipants(token: string): Promise<ApiResult<ResearchParticipantsResponse>> {
  return apiRequest<ResearchParticipantsResponse>("/research/participants", { token });
}

/**
 * Starts a download transaction for a research work.
 * @param id The research work ID.
 * @param token JWT session token.
 */
export async function downloadResearch(id: number, token: string): Promise<ApiResult<DownloadHandshake>> {
  return apiRequest<DownloadHandshake>(`/research/${id}/download`, {
    method: "POST",
    token,
  });
}

/**
 * Submits a review and approval decision for a research work.
 * @param id The research work ID.
 * @param reviewIn Review details (comment and result status).
 * @param token JWT session token.
 */
export async function reviewResearch(id: number, reviewIn: ReviewCommentCreate, token: string): Promise<ApiResult<ReviewCommentResponse>> {
  return apiRequest<ReviewCommentResponse>(`/research/${id}/review`, {
    method: "POST",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewIn),
  });
}
