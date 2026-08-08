"use client";
import { Button, StatePanel } from "@/src/components/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container route-error">
      <StatePanel kind="error" title="Review workspace unavailable" detail="The workspace could not be rendered. Your account permissions were not inferred." />
      <Button type="button" onClick={reset}>Try again</Button>
    </main>
  );
}
