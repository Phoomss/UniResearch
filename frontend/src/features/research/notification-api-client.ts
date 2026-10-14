import { networkError, normalizeApiError } from "@/src/lib/api/errors";
import type { ApiResult } from "@/src/lib/api/types";

interface NotificationResponse {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

// Browser requests use the same-origin proxy, which supplies the session token.
async function notificationRequest<T>(options: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch("/api/notifications", {
      ...options,
      cache: "no-store",
    });
    const body = await response.json();
    if (!response.ok) {
      return { ok: false, error: normalizeApiError(response.status, body) };
    }
    return { ok: true, data: body as T };
  } catch {
    return { ok: false, error: networkError() };
  }
}

export async function getNotifications() {
  return notificationRequest<NotificationResponse[]>();
}
export async function markAsRead(id: number) {
  return notificationRequest<NotificationResponse>({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
export async function markAllAsRead() {
  return notificationRequest<{ status: string }>({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ all: true }),
  });
}
