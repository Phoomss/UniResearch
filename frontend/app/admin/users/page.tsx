import { AdminUserManager } from "@/src/features/admin/admin-user-manager";
import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import type { UserResponse } from "@/src/lib/api/types";

export const dynamic = "force-dynamic";


export default async function AdminUsersPage() {
  const token = await getSessionToken();
  const result = await apiRequest<UserResponse[]>('/users/', { token });
  const rawUsers = result.ok ? result.data : [];

  return (
    <main className="admin-main">
      <AdminUserManager initialUsers={rawUsers} />
    </main>
  );
}

