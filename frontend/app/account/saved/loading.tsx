import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
export default function Loading(){return <DashboardShell><main className="dash-main"><StatePanel kind="loading" title="Loading saved research" detail="Retrieving your personal archive index."/></main></DashboardShell>}
