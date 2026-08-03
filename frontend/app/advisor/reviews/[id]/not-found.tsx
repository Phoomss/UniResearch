import { ButtonLink, StatePanel } from "@/src/components/ui";
export default function NotFound(){return <main className="container route-error"><StatePanel kind="empty" title="Research not found" detail="The requested research ID does not exist or is invalid."/><ButtonLink href="/dashboard/reviewer" variant="secondary">Return to reviewer entry</ButtonLink></main>}
