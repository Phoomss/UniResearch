import { apiJson } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { CategoryCreate, CategoryResponse } from "@/src/lib/api/types";
export async function POST(request:Request){const token=await getSessionToken();if(!token)return Response.json({error:{status:401,code:"unauthorized",message:"กรุณาเข้าสู่ระบบ"}},{status:401});const input=await request.json().catch(()=>null) as CategoryCreate|null;if(!input?.category_name)return Response.json({error:{status:422,code:"validation",message:"กรุณาระบุชื่อหมวดหมู่"}},{status:422});return toRouteResponse(await apiJson<CategoryResponse>("/categories/","POST",{category_name:input.category_name,description:input.description??null},token));}
