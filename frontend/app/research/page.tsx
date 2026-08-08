import { SiteFooter, SiteHeader } from "@/src/components/shells";
import { adaptResearch } from "@/src/features/research/adapters";
import { getCategories, searchResearch } from "@/src/features/research/api";
import { ResearchExplorer } from "@/src/features/research/research-explorer";

type ResearchSearchParams = {
  q?: string;
  category_id?: string;
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<ResearchSearchParams>;
}) {
  const query = await searchParams;
  const [result, categoryResult] = await Promise.all([
    searchResearch({}),
    getCategories(),
  ]);
  
  const categories = categoryResult.ok ? categoryResult.data : [];
  const works = result.ok ? result.data.map((item) => adaptResearch(item, categories)) : [];

  return (
    <>
      <SiteHeader />
      <main className="research-explore">
        <ResearchExplorer
          initialQuery={query.q ?? ""}
          initialCategoryId={query.category_id}
          categories={categories}
          works={works}
          errorMessage={result.ok ? undefined : result.error.message}
        />
      </main>
      <SiteFooter />
    </>
  );
}

