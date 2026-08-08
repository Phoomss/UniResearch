import { Download, UserPlus } from "lucide-react";
import { AdminUserManager } from "@/src/features/admin/admin-user-manager";
import { apiRequest } from "@/src/lib/api/client";
import { getSessionToken } from "@/src/lib/api/session";
import type { UserResponse } from "@/src/lib/api/types";

export default async function AdminUsersPage() {
  const token = await getSessionToken();
  const result = await apiRequest<UserResponse[]>('/users/', { token });
  const rawUsers = result.ok ? result.data : [];
  const users = rawUsers.map((u) => ({
    name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
    subtitle: u.role,
    email: u.email,
    id: u.student_id ?? `${u.id}`,
    department: u.department ?? '-',
    role: u.role,
    active: u.is_active,
  }));

  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-heading-actions admin-users-heading">
        <div>
          <p>การจัดการระบบ</p>
          <h1>จัดการผู้ใช้งาน</h1>
          <span>ข้อมูลและสิทธิ์การเข้าถึงคลังข้อมูลดิจิทัลสำหรับบุคลากรและนักศึกษา จัดการสถานะและการเชื่อมโยงกับภาควิชา [Active Users: {users.length}]</span>
        </div>
        <div>
          <button className="admin-secondary-action" disabled title="Backend ยังไม่มี Export users endpoint"><Download size={17} />Export CSV</button>
          <button className="admin-primary-action" disabled title="Backend ยังไม่มี Admin create-user endpoint"><UserPlus size={17} />เพิ่มผู้ใช้ใหม่</button>
        </div>
      </header>
      <AdminUserManager users={users} />
    </main>
  );
}

