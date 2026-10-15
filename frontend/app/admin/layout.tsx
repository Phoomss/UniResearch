import { redirect } from "next/navigation";
import { AdminShell } from "@/src/features/admin/admin-shell";
import { getCurrentUser } from "@/src/features/research/api";
import { hasSession } from "@/src/lib/api/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasSession())) redirect(`/login?next=${encodeURIComponent("/admin")}`);

  const user = await getCurrentUser();
  if (!user.ok || user.data.role !== "admin") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
