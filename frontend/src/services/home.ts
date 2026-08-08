import { apiRequest } from "@/src/lib/api/client";
import type { ResearchWorkResponse, ApiResult } from "@/src/lib/api/types";

/**
 * Retrieves the latest approved research submissions.
 * @param limit The maximum number of records to return.
 */
export async function getLatestResearch(limit = 5): Promise<ApiResult<ResearchWorkResponse[]>> {
  return apiRequest<ResearchWorkResponse[]>(`/home/latest?limit=${encodeURIComponent(String(limit))}`);
}

/**
 * Retrieves the most popular approved research submissions.
 * @param limit The maximum number of records to return.
 */
export async function getPopularResearch(limit = 5): Promise<ApiResult<ResearchWorkResponse[]>> {
  return apiRequest<ResearchWorkResponse[]>(`/home/popular?limit=${encodeURIComponent(String(limit))}`);
}
