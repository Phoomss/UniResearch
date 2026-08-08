import { toRouteResponse } from "@/src/lib/api/route-response";
import { toggleFavorite } from "@/src/features/research/api";
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){const id=Number((await params).id);if(!Number.isInteger(id)||id<1)return Response.json({error:{status:422,code:"validation",message:"รหัสงานวิจัยไม่ถูกต้อง"}},{status:422});return toRouteResponse(await toggleFavorite(id));}
