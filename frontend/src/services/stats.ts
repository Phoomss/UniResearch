import { apiRequest } from "@/src/lib/api/client";
import type { DashboardStats, ApiResult } from "@/src/lib/api/types";

/**
 * Retrieves global system and submission statistics for the dashboard view.
 */
export async function getDashboardStats(): Promise<ApiResult<DashboardStats>> {
  return apiRequest<DashboardStats>("/stats/");
}
