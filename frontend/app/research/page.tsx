import { SiteFooter, SiteHeader } from "@/src/components/shells";
import { adaptResearch } from "@/src/features/research/adapters";
import { searchResearch } from "@/src/features/research/api";
import { ResearchExplorer } from "@/src/features/research/research-explorer";

type ResearchSearchParams = {
  q?: string;
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<ResearchSearchParams>;
}) {
  const query = await searchParams;
  const result = await searchResearch({});
  const works = result.ok ? result.data.map((item) => adaptResearch(item)) : [];

  return (
    <>
      <SiteHeader />
      <main className="research-explore">
        <ResearchExplorer
          initialQuery={query.q ?? ""}
          works={works}
          errorMessage={result.ok ? undefined : result.error.message}
        />
      </main>
      <SiteFooter />
    </>
  );
}
