import { NextResponse } from "next/server";
import { apiRequest } from "@/src/lib/api/client";
import { setSessionToken } from "@/src/lib/api/session";
import type { TokenResponse } from "@/src/lib/api/types";

export async function POST(request:Request){
  const input=await request.json().catch(()=>null) as {email?:string;password?:string}|null;
  if(!input?.email||!input.password) return NextResponse.json({error:{status:422,code:"validation",message:"กรุณากรอกอีเมลและรหัสผ่าน"}},{status:422});
  const form=new URLSearchParams({username:input.email,password:input.password});
  const result=await apiRequest<TokenResponse>("/auth/login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:form});
  if(!result.ok) return NextResponse.json({error:result.error},{status:result.error.status||503});
  await setSessionToken(result.data.access_token);
  return NextResponse.json({authenticated:true,token_type:result.data.token_type});
}
