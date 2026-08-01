# Prompt 02 — Implement Stitch design as reusable Next.js components

Read `AGENTS.md`, `frontend/DESIGN.md`, every file in `frontend/design/stitch/`, and the current frontend code.

Modify `frontend/` only.

Convert the Stitch design into a maintainable Next.js component system. Treat exported HTML/CSS as visual reference, not final architecture.

First create or refine:

- design tokens
- typography
- page container and grid
- buttons, inputs, select, checkbox, badges, status indicators
- header, footer, authentication shell, dashboard shell
- Research Index Rail
- Research Folio Card and compact research row
- archive tab and citation motif
- loading, empty, success, error, disabled, hover, focus, and mobile states

Then implement screens in the order supported by the design files:

1. Homepage
2. Login and registration
3. Research search/results
4. Research detail
5. Student dashboard/submission
6. Reviewer dashboard
7. Administrator dashboard

Requirements:

- Preserve Mulberry Library colors and Thai-first typography.
- Reuse existing components before creating new variants.
- Use Server Components by default.
- Use Client Components only for interactions requiring browser state.
- Do not connect mock endpoints during this phase.
- Do not redesign backend-driven fields before contract analysis is complete.
- Keep pages responsive at approximately 1440px and 390px.
- Preserve accessibility and visible keyboard focus.

Run lint, typecheck, unit tests, and build. Confirm backend git status is unchanged.
