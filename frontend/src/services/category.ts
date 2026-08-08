import { apiJson, apiRequest } from "@/src/lib/api/client";
import type { CategoryCreate, CategoryResponse, ApiResult } from "@/src/lib/api/types";

/**
 * Creates a new category. Restricted to Admin.
 * @param categoryIn Category creation parameters.
 * @param token JWT session token.
 */
export async function createCategory(categoryIn: CategoryCreate, token: string): Promise<ApiResult<CategoryResponse>> {
  return apiJson<CategoryResponse>("/categories/", "POST", categoryIn, token);
}

/**
 * Retrieves all registered research categories.
 */
export async function getCategories(): Promise<ApiResult<CategoryResponse[]>> {
  return apiRequest<CategoryResponse[]>("/categories/");
}
