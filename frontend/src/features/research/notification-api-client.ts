import { networkError, normalizeApiError } from "@/src/lib/api/errors";
import type { ApiResult } from "@/src/lib/api/types";

interface Notification {
  id: number; user_id: number; title: string; message: string;
  type: string; is_read: boolean; created_at: string;
}

// Browser requests use the same-origin proxy, which attaches the HttpOnly session.
async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, { ...options, cache: "no-store", credentials: "same-origin" });
    const body = await response.json();
    if (!response.ok) return { ok: false, error: body.error ?? normalizeApiError(response.status, body) };
    return { ok: true, data: body as T };
  } catch {
    return { ok: false, error: networkError() };
  }
}

export async function getNotifications() {
  return request<Notification[]>("/api/notifications");
}
export async function markAsRead(id: number) {
  return request<Notification>("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
export async function markAllAsRead() {
  return request<{ status: string }>("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "read-all" }),
  });
}
