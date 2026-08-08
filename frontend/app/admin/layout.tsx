import { redirect } from "next/navigation";
import { AdminShell } from "@/src/features/admin/admin-shell";
import { hasSession } from "@/src/lib/api/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasSession())) redirect(`/login?next=${encodeURIComponent("/admin")}`);
  return <AdminShell>{children}</AdminShell>;
}
