import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { ResearchWorkResponse } from "@/src/lib/api/types";
import { cookies } from "next/headers";

const textFields=["title_th","title_en","category_id","abstract","department","work_type","academic_year","keywords"] as const;
function safeFile(file:File){const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").replace(/\.\.+/g,".");return new File([file],`${Date.now()}-${clean||"upload"}`,{type:file.type});}

export async function POST(request:Request){
  const token=await getSessionToken();
  if(!token)return Response.json({error:{status:401,code:"unauthorized",message:"กรุณาเข้าสู่ระบบก่อนส่งผลงาน"}},{status:401});
  const incoming=await request.formData();const outgoing=new FormData();
  for(const field of textFields){const value=incoming.get(field);if(typeof value==="string"&&value.trim()!=="")outgoing.set(field,value.trim());}
  for(const field of ["author_ids","advisor_ids"] as const){const value=incoming.get(field);outgoing.set(field,typeof value==="string"&&value?value:"[]");}
  const cover=incoming.get("cover_image");const document=incoming.get("document");
  if(cover instanceof File&&cover.size)outgoing.set("cover_image",safeFile(cover));
  if(document instanceof File&&document.size)outgoing.set("document",safeFile(document));
  
  const result = await apiRequest<ResearchWorkResponse>("/research/",{method:"POST",token,body:outgoing});
  if (result.ok && result.data?.id) {
    try {
      const cookieStore = await cookies();
      const existing = cookieStore.get("submitted_research_ids")?.value || "";
      const list = existing ? existing.split(",") : [];
      const newId = String(result.data.id);
      if (!list.includes(newId)) {
        list.push(newId);
        cookieStore.set("submitted_research_ids", list.join(","), { path: "/", maxAge: 31536000 });
      }
    } catch (e) {
      console.error("Failed to set submitted cookie", e);
    }
  }
  return toRouteResponse(result);
}
