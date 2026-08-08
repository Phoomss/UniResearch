import { apiRequest } from "@/src/lib/api/client";
import type { FavoriteResponse, FavoriteRemovedResponse, ApiResult } from "@/src/lib/api/types";

/**
 * Toggles a research submission saved state in the user's favorites list.
 * @param id The research work ID.
 * @param token JWT session token.
 */
export async function toggleFavorite(id: number, token: string): Promise<ApiResult<FavoriteResponse | FavoriteRemovedResponse>> {
  return apiRequest<FavoriteResponse | FavoriteRemovedResponse>(`/favorites/${id}`, {
    method: "POST",
    token,
  });
}

/**
 * Lists all bookmarked/favorited items of the authenticated user.
 * @param token JWT session token.
 */
export async function listFavorites(token: string): Promise<ApiResult<FavoriteResponse[]>> {
  return apiRequest<FavoriteResponse[]>("/favorites/", { token });
}
