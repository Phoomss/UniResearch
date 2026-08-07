import { StatePanel } from "@/src/components/ui";

export default function Loading() {
  return (
      <main className="admin-main">
        <StatePanel
          kind="loading"
          title="Loading archive totals"
          detail="Retrieving the supported repository statistics."
        />
      </main>
  );
}
