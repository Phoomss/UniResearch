import { Download, UserPlus } from "lucide-react";
import { AdminUserManager } from "@/src/features/admin/admin-user-manager";

export default function AdminUsersPage() {
  return <main className="admin-main"><header className="admin-page-heading admin-heading-actions admin-users-heading"><div><p>การจัดการระบบ</p><h1>จัดการผู้ใช้งาน</h1><span>ข้อมูลและสิทธิ์การเข้าถึงคลังข้อมูลดิจิทัลสำหรับบุคลากรและนักศึกษา จัดการสถานะและการเชื่อมโยงกับภาควิชา [Active Users: 1,248]</span></div><div><button className="admin-secondary-action" disabled title="Backend ยังไม่มี Export users endpoint"><Download size={17} />Export CSV</button><button className="admin-primary-action" disabled title="Backend ยังไม่มี Admin create-user endpoint"><UserPlus size={17} />เพิ่มผู้ใช้ใหม่</button></div></header><AdminUserManager /></main>;
}
