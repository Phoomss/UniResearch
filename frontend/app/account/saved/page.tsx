import { redirect } from "next/navigation";
import { DashboardShell } from "@/src/components/shells";
import { StatePanel } from "@/src/components/ui";
import { listFavorites } from "@/src/features/research/api";
import { SavedResearchList } from "@/src/features/research/saved-research-list";
import { hasSession } from "@/src/lib/api/session";

export default async function SavedResearchPage() {
  if (!await hasSession()) redirect(`/login?next=${encodeURIComponent("/account/saved")}`);

  const favorites = await listFavorites();

  if (!favorites.ok && favorites.error.status === 401) redirect(`/login?next=${encodeURIComponent("/account/saved")}`);

  return (
    <DashboardShell>
      <main className="dash-main">
        <p className="eyebrow">[ Personal archive ]</p>
        <h1 className="title">Saved research</h1>
        <p className="muted">Favorites are available to every active account. The backend returns research IDs and saved dates only, so this index does not invent titles or metadata.</p>
        {!favorites.ok ? (
          <StatePanel kind="error" title="Saved research unavailable" detail={`${favorites.error.message} [${favorites.error.code}]`} />
        ) : favorites.data.length === 0 ? (
          <StatePanel kind="empty" title="No saved research" detail="Open a research folio and use Save research to add it to this index." />
        ) : (
          <SavedResearchList items={favorites.data} />
        )}
      </main>
    </DashboardShell>
  );
}
