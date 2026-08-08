import { SiteHeader } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="detail-page"><div className="detail"><StatePanel kind="loading" title="Loading research" detail="Retrieving the research folio." /></div></main>
    </>
  );
}
