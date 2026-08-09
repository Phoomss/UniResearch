import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import { toRouteResponse } from "@/src/lib/api/route-response";
import type { ResearchWorkResponse } from "@/src/lib/api/types";

const textFields=["title_th","title_en","category_id","abstract","department","work_type","academic_year","keywords"] as const;
function safeFile(file:File){const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").replace(/\.\.+/g,".");return new File([file],`${Date.now()}-${clean||"upload"}`,{type:file.type});}

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getSessionToken();
  if (!token) return Response.json({ error: { status: 401, code: "unauthorized", message: "กรุณาเข้าสู่ระบบก่อนแก้ไขผลงาน" } }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  const incoming = await request.formData();
  const outgoing = new FormData();
  for (const field of textFields) {
    const value = incoming.get(field);
    if (typeof value === "string" && value.trim() !== "") outgoing.set(field, value.trim());
  }
  for (const field of ["author_ids", "advisor_ids"] as const) {
    const value = incoming.get(field);
    outgoing.set(field, typeof value === "string" && value ? value : "[]");
  }
  const cover = incoming.get("cover_image");
  const document = incoming.get("document");
  if (cover instanceof File && cover.size) outgoing.set("cover_image", safeFile(cover));
  if (document instanceof File && document.size) outgoing.set("document", safeFile(document));

  return toRouteResponse(await apiRequest<ResearchWorkResponse>(`/research/${id}`, { method: "PUT", token, body: outgoing }));
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getSessionToken();
  if (!token) return Response.json({ error: { status: 401, code: "unauthorized", message: "กรุณาเข้าสู่ระบบก่อนลบผลงาน" } }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }
  return toRouteResponse(await apiRequest<unknown>(`/research/${id}`, { method: "DELETE", token }));
}
