import { apiRequest } from "@/src/lib/api/client";
import { clearSession, getSessionToken } from "@/src/lib/api/session";
import type { CategoryResponse, DashboardStats, DownloadHandshake, FavoriteRemovedResponse, FavoriteResponse, ResearchParticipantsResponse, ResearchWorkResponse } from "@/src/lib/api/types";

export function getCategories(){ return apiRequest<CategoryResponse[]>("/categories/"); }
export function getStats(){ return apiRequest<DashboardStats>("/stats/"); }
export function getLatest(limit=5){ return apiRequest<ResearchWorkResponse[]>(`/home/latest?limit=${encodeURIComponent(String(limit))}`); }
export function getPopular(limit=5){ return apiRequest<ResearchWorkResponse[]>(`/home/popular?limit=${encodeURIComponent(String(limit))}`); }
export function searchResearch(input:{q?:string;categoryId?:number}){ const p=new URLSearchParams(); if(input.q)p.set("q",input.q); if(input.categoryId)p.set("category_id",String(input.categoryId)); return apiRequest<ResearchWorkResponse[]>(`/research/search${p.size?`?${p}`:""}`); }
export function getResearch(id:number){ return apiRequest<ResearchWorkResponse>(`/research/${id}`); }
export async function getResearchParticipants(){ return apiRequest<ResearchParticipantsResponse>("/research/participants",{token:await getSessionToken()}); }
export async function listFavorites(){ const result=await apiRequest<FavoriteResponse[]>("/favorites/",{token:await getSessionToken()}); if(!result.ok&&result.error.status===401)await clearSession(); return result; }
export async function getMyResearch(){ const result=await apiRequest<ResearchWorkResponse[]>("/research/my",{token:await getSessionToken()}); if(!result.ok&&result.error.status===401)await clearSession(); return result; }
export async function getPendingResearch(){ const result=await apiRequest<ResearchWorkResponse[]>("/research/pending",{token:await getSessionToken()}); if(!result.ok&&result.error.status===401)await clearSession(); return result; }
export async function toggleFavorite(id:number){ return apiRequest<FavoriteResponse|FavoriteRemovedResponse>(`/favorites/${id}`,{method:"POST",token:await getSessionToken()}); }

export async function startDownload(id:number){ return apiRequest<DownloadHandshake>(`/research/${id}/download`,{method:"POST",token:await getSessionToken()}); }

