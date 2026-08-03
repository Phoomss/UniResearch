import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
export default function Loading(){return <DashboardShell active="02"><main className="dash-main"><StatePanel kind="loading" title="Loading review workspace" detail="Retrieving the research record."/></main></DashboardShell>}
