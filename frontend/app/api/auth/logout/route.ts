import { clearSession } from "@/src/lib/api/session";
export async function POST(){ await clearSession(); return Response.json({authenticated:false}); }
