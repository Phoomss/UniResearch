import { test, expect } from "@playwright/test";
test.skip(process.env.RESEARCH_FLOW_UI_TEST !== "1", "Opt in to isolated ResearchFlow UI fixtures");
const id = "11111111-1111-4111-8111-111111111111";
const quote = "This is an explicitly labeled test corpus excerpt for interface verification.";
function fixture(status = "COMPLETED") {
  return { id, research_question: "Inspect traceable evidence in the test corpus", depth: "QUICK", status,
    started_at: "2026-10-07T00:00:00", plan: { sub_questions: ["Inspect evidence"], summary: "Test plan" },
    draft: status === "COMPLETED" ? { sentences: [{ section: "Key Findings", text: quote, claim_id: "claim", source_ids: ["source"] }] } : {},
    limitations: ["This interface test uses fixture data."], iteration: 0, search_rounds: 1, confidence: .5,
    llm_calls: 7, input_tokens: 70, output_tokens: 70,
    metrics: { evidence_coverage: 1, citation_coverage: 1, source_agreement: 1, source_quality: .5 },
    critic_feedback: { issues: [] },
    tasks: ["planner", "search", "paper", "evidence", "verifier", "critic", "writer", "citation"].map(agent => ({ id: agent, agent_type: agent, status: "COMPLETED", retry_count: 0, depends_on: null, error: null })),
    sources: [{ id: "source", title: "Test corpus excerpt", authors: ["Test author"], url: "/research/1", provider: "uniresearch", document_id: 1, retrieved_at: "2026-10-07T00:00:00", chunk_ref: "abstract", content: quote }],
    papers: [], claims: [{ id: "claim", text: quote, strength: "weak", verified: 1 }],
    evidence: [{ id: "evidence", claim_id: "claim", source_id: "source", relation: "supporting", quote, locator: "abstract", support_verified: 1 }],
    citations: [{ id: "citation", claim_id: "claim", source_id: "source", evidence_id: "evidence", sentence_index: 0 }],
    events: [{ id: 1, event_type: "workflow.completed", summary: "Research report validated." }] };
}
async function authenticated(context) {
  // UI fixture only. Backend JWT validation is covered by FastAPI tests.
  await context.addCookies([{ name: "uniresearch_access_token", value: "ui-fixture-only", domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Lax" }]);
}
test("unauthenticated page redirects and proxy rejects unauthenticated requests", async ({ page, request }) => {
  await page.goto("/research-flow");
  await expect(page).toHaveURL(/\/login\?next=/);
  expect((await request.get("/api/research-flow")).status()).toBe(401);
});
test("validated report links to evidence and source excerpts on desktop and phone", async ({ page, context }) => {
  await authenticated(context);
  await page.route("**/api/research-flow**", route => route.fulfill({ json: route.request().url().split("?")[0].endsWith("/api/research-flow") ? [fixture()] : fixture() }));
  await page.goto(`/research-flow?workflow=${id}`);
  await expect(page.getByRole("heading", { name: "Final research report", exact: true })).toBeVisible();
  await page.getByText("Inspect evidence (1)", { exact: true }).click();
  await expect(page.getByText("Locator: abstract", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "[Evidence]", exact: true })).toHaveAttribute("href", "#claim-claim");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "test-results/research-flow-preview.png", fullPage: false });
  await page.screenshot({ path: "test-results/research-flow-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "ResearchFlow AI", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "test-results/research-flow-phone.png", fullPage: true });
});
test("human review and creation controls submit request shapes", async ({ page, context }) => {
  await authenticated(context);
  const captured = [];
  await page.route("**/api/research-flow**", route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (req.method() === "POST") captured.push({ path, body: req.postDataJSON() });
    return route.fulfill({ json: req.method() === "GET" && path === "/api/research-flow" ? [fixture("WAITING_FOR_HUMAN")] : fixture("WAITING_FOR_HUMAN") });
  });
  await page.goto(`/research-flow?workflow=${id}`);
  await expect(page.getByRole("heading", { name: "Human review required", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Accept current evidence", exact: true }).click();
  await expect.poll(() => captured.length).toBe(1);
  expect(captured[0].body.action).toBe("ACCEPT_CURRENT");
  await page.getByLabel("What would you like to investigate?", { exact: true }).fill("Inspect evidence from approved repository abstracts");
  await page.getByLabel("Research depth", { exact: true }).selectOption("QUICK");
  await page.getByRole("button", { name: "Start research", exact: true }).click();
  await expect.poll(() => captured.length).toBe(3);
  expect(captured[1].body.depth).toBe("QUICK");
  expect(captured[2].path).toBe(`/api/research-flow/${id}/start`);
});

test("authenticated proxy rejects cross-site commands and malformed routes or JSON", async ({ context }) => {
  await authenticated(context);
  expect((await context.request.post("/api/research-flow", { headers: { Origin: "https://untrusted.invalid" }, data: { research_question: quote } })).status()).toBe(403);
  expect((await context.request.get("/api/research-flow/not-a-workflow-id")).status()).toBe(404);
  expect((await context.request.post(`/api/research-flow/${id}/continue`, { headers: { "Content-Type": "application/json" }, data: Buffer.from("{") })).status()).toBe(422);
  expect((await context.request.get(`/api/research-flow/${id}/events?after=invalid`)).status()).toBe(422);
});
