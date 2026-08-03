import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
export default function Loading(){return <DashboardShell active="03"><main className="dash-main"><StatePanel kind="loading" title="Loading submission form" detail="Retrieving required categories."/></main></DashboardShell>}
