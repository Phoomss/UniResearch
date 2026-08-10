import { NextRequest, NextResponse } from "next/server";
import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";

export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: { message: "กรุณาเข้าสู่ระบบ", status: 401 } }, { status: 401 });
  }
  
  const body = await request.json();
  const { action, ...data } = body;
  
  // Route to different AI endpoints based on action
  const endpointMap: Record<string, string> = {
    "generate-abstract": "/ai/generate-abstract",
    "suggest-titles": "/ai/suggest-titles",  
    "suggest-keywords": "/ai/suggest-keywords",
    "check-writing": "/ai/check-writing",
    "dashboard-insights": "/ai/dashboard-insights",
  };
  
  const endpoint = endpointMap[action];
  if (!endpoint) {
    return NextResponse.json({ error: { message: "Invalid action" } }, { status: 400 });
  }
  
  const result = await apiRequest(endpoint, {
    method: "POST",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  return toRouteResponse(result);
}
