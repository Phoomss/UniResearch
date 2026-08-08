import { StatePanel } from "@/src/components/ui";

export default function Loading() {
  return (
    <main className="dash-main">
      <StatePanel
        kind="loading"
        title="Loading categories"
        detail="Retrieving the category index."
      />
    </main>
  );
}
