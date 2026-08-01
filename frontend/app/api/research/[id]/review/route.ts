import { apiJson } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { ReviewCommentCreate, ReviewCommentResponse } from "@/src/lib/api/types";

const supported=new Set(["approved","rejected"]);
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const token=await getSessionToken();if(!token)return Response.json({error:{status:401,code:"unauthorized",message:"กรุณาเข้าสู่ระบบ"}},{status:401});const id=Number((await params).id);const input=await request.json().catch(()=>null) as ReviewCommentCreate|null;if(!Number.isInteger(id)||!input?.comment_text||!supported.has(input.status_result))return Response.json({error:{status:422,code:"validation",message:"กรุณาระบุรหัสงานวิจัย ความเห็น และผลการตรวจสอบ"}},{status:422});return toRouteResponse(await apiJson<ReviewCommentResponse>(`/research/${id}/review`,"POST",input,token));}
