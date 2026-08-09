import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { developmentAdvisorUser, isDevelopmentSession } from "@/src/lib/auth/development-session";
import type { CategoryResponse, DashboardStats, DownloadHandshake, FavoriteRemovedResponse, FavoriteResponse, ResearchParticipantsResponse, ResearchWorkResponse, UserResponse } from "@/src/lib/api/types";


export function getCategories(){ return apiRequest<CategoryResponse[]>("/categories/"); }
export function getStats(){ return apiRequest<DashboardStats>("/stats/"); }
export function getLatest(limit=5){ return apiRequest<ResearchWorkResponse[]>(`/home/latest?limit=${encodeURIComponent(String(limit))}`); }
export function getPopular(limit=5){ return apiRequest<ResearchWorkResponse[]>(`/home/popular?limit=${encodeURIComponent(String(limit))}`); }
export async function searchResearch(input:{q?:string;categoryId?:number}){ const p=new URLSearchParams(); if(input.q)p.set("q",input.q); if(input.categoryId)p.set("category_id",String(input.categoryId)); return apiRequest<ResearchWorkResponse[]>(`/research/search${p.size?`?${p}`:""}`,{token:await getSessionToken()}); }
export function getResearch(id:number){ return apiRequest<ResearchWorkResponse>(`/research/${id}`); }
export async function getResearchParticipants(){ return apiRequest<ResearchParticipantsResponse>("/research/participants",{token:await getSessionToken()}); }
export async function listFavorites(){ return apiRequest<FavoriteResponse[]>("/favorites/",{token:await getSessionToken()}); }
export async function getMyResearch(){ return apiRequest<ResearchWorkResponse[]>("/research/my",{token:await getSessionToken()}); }
export async function getPendingResearch(){ return apiRequest<ResearchWorkResponse[]>("/research/pending",{token:await getSessionToken()}); }
export async function getReviewHistory(){ return apiRequest<ResearchWorkResponse[]>("/research/history",{token:await getSessionToken()}); }
export async function toggleFavorite(id:number){ return apiRequest<FavoriteResponse|FavoriteRemovedResponse>(`/favorites/${id}`,{method:"POST",token:await getSessionToken()}); }

export async function getCurrentUser(){
  const token = await getSessionToken();
  if (isDevelopmentSession(token, "advisor")) return { ok: true as const, data: developmentAdvisorUser() };
  return apiRequest<UserResponse>("/auth/" + "me",{token});
}
export async function updateCurrentUser(data: Record<string, unknown>){ return apiRequest<UserResponse>("/auth/" + "me",{method:"PUT",token:await getSessionToken(),headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}); }
export async function startDownload(id:number){ return apiRequest<DownloadHandshake>(`/research/${id}/download`,{method:"POST",token:await getSessionToken()}); }

export interface OptionsResponse {
  departments: string[];
  work_types: string[];
}

export function getOptions() {
  return apiRequest<OptionsResponse>("/options/");
}

export async function updateOptions(departments: string[], workTypes: string[]) {
  return apiRequest<{ success: boolean }>("/options/", {
    method: "POST",
    token: await getSessionToken(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ departments, work_types: workTypes }),
  });
}



