import { apiRequest } from "@/src/lib/api/client";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  return toRouteResponse(await apiRequest<ResearchWorkResponse>(`/research/${id}`));
}
