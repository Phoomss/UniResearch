import { apiJson } from "@/src/lib/api/client";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { UserCreate, UserResponse } from "@/src/lib/api/types";

export async function POST(request:Request){
  const input=await request.json().catch(()=>null) as Partial<UserCreate>|null;
  if(!input?.email||!input.password) return Response.json({error:{status:422,code:"validation",message:"กรุณากรอกอีเมลและรหัสผ่าน"}},{status:422});
  const safe:UserCreate={email:input.email,password:input.password,role:"student",first_name:input.first_name??null,last_name:input.last_name??null};
  return toRouteResponse(await apiJson<UserResponse>("/auth/register","POST",safe));
}
