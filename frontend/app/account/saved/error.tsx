"use client";
import { Button, StatePanel } from "@/src/components/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container route-error">
      <StatePanel kind="error" title="Saved research unavailable" detail="The saved index could not be rendered." />
      <Button type="button" onClick={reset}>Try again</Button>
    </main>
  );
}
