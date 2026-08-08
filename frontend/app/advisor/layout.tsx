import { redirect } from "next/navigation";
import { AdvisorShell } from "@/src/features/advisor/advisor-shell";
import { getCurrentUser } from "@/src/features/research/api";
import { hasSession } from "@/src/lib/api/session";

export const dynamic = "force-dynamic";

export default async function AdvisorLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasSession())) redirect(`/login?next=${encodeURIComponent("/advisor")}`);

  const user = await getCurrentUser();
  if (!user.ok) redirect(`/login?next=${encodeURIComponent("/advisor")}`);
  if (user.data.role === "admin") redirect("/admin");
  if (user.data.role !== "advisor" && user.data.role !== "reviewer") redirect("/dashboard/student");

  const name = `${user.data.first_name || ""} ${user.data.last_name || ""}`.trim() || user.data.email;
  return <AdvisorShell name={name} department={user.data.department}>{children}</AdvisorShell>;
}
