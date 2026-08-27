import { apiRequest } from "@/src/lib/api/client";

export async function getNotifications() {
  return apiRequest<any[]>("/api/notifications");
}
export async function markAsRead(id: number) {
  return apiRequest<any>("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}
export async function markAllAsRead() {
  return apiRequest<any>("/api/notifications/read-all", {
    method: "POST",
  });
}
