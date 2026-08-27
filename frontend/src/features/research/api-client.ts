import { apiRequest } from "@/src/lib/api/client";

export interface SearchSuggestions {
  keywords: string[];
  titles: Array<{ id: number; title_th: string; title_en: string }>;
}

export function getSearchSuggestions(q?: string) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  return apiRequest<SearchSuggestions>(`/research/search/suggestions${p.size ? `?${p}` : ""}`);
}
