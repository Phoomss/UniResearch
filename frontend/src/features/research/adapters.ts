import type { CategoryResponse, ResearchWorkResponse } from "@/src/lib/api/types";

export type ResearchStatus="pending"|"approved"|"rejected"|"revision_needed"|"unknown";
export interface ResearchViewModel { id:number;ref:string;category:string;titleTh:string;titleEn:string;abstract:string;department:string;workType:string;year:string;keywords:string[];status:ResearchStatus;statusRaw:string;views:number;downloads:number;published:string;created:string;coverUrl:string|null;hasDocument:boolean; authors?: ResearchWorkResponse["authors"]; advisors?: ResearchWorkResponse["advisors"]; reviews?: ResearchWorkResponse["reviews"]; }

function knownStatus(value:string):ResearchStatus { return new Set<string>(["pending","approved","rejected","revision_needed"]).has(value) ? value as ResearchStatus : "unknown"; }
export function adaptResearch(value:ResearchWorkResponse,categories:CategoryResponse[]=[]):ResearchViewModel {
  const category=categories.find(x=>x.id===value.category_id)?.category_name ?? `หมวดหมู่ #${value.category_id}`;
  return {id:value.id,ref:`RES-${String(value.id).padStart(4,"0")}`,category,titleTh:value.title_th,titleEn:value.title_en,abstract:value.abstract ?? "ไม่มีบทคัดย่อ",department:value.department ?? "ไม่ระบุ",workType:value.work_type ?? "ไม่ระบุ",year:value.academic_year?.toString() ?? "ไม่ระบุ",keywords:value.keywords?.split(",").map(x=>x.trim()).filter(Boolean) ?? [],status:knownStatus(value.status),statusRaw:value.status,views:value.view_count,downloads:value.download_count,published:value.published_at ? new Intl.DateTimeFormat("th-TH",{dateStyle:"medium"}).format(new Date(value.published_at)) : "ยังไม่ระบุวันเผยแพร่",created:new Intl.DateTimeFormat("th-TH",{dateStyle:"medium"}).format(new Date(value.created_at)),coverUrl:value.cover_image_path ? `/api/assets?path=${encodeURIComponent(value.cover_image_path)}` : null,hasDocument:Boolean(value.file_path), authors:value.authors, advisors:value.advisors, reviews:value.reviews};
}
