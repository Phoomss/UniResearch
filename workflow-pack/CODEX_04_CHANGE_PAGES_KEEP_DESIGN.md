# Prompt 04 — Add or revise pages without breaking the design system

Read `AGENTS.md`, `frontend/DESIGN.md`, existing shared components, and the target page before editing.

Modify `frontend/` only.

Implement the requested page or revision while preserving the existing Mulberry Library pattern.

Before coding:

1. Identify reusable components already present.
2. Identify backend endpoints and schemas required by the page.
3. Identify unsupported actions that must be disabled or documented.
4. State which Server Components and Client Components are needed.

During implementation:

- Reuse tokens and components.
- Do not create a new visual language for one page.
- Do not introduce generic SaaS card grids, large gradients, glassmorphism, or unrelated dependencies.
- Preserve Thai typography, spacing, responsiveness, accessibility, loading, empty, and error states.
- Preserve the immutable backend contract.

After implementation:

- Add/update unit and E2E tests.
- Run lint, typecheck, tests, and build.
- Compare desktop and mobile output with Stitch references.
- Confirm backend source is unchanged.
- Update `frontend/docs/backend-integration-matrix.md` and the integration report.
