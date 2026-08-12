# UniResearch frontend design system

The implementation follows **The Living Research Index**: an editorial archive grounded in warm paper, deep mulberry, scholarly periwinkle, folio references, restrained rules, and generous reading space. Stitch exports remain visual references; reusable React components are the implementation source of truth.

## Foundations

- Thai-first body and display typography uses Kanit; Latin metadata and UI labels use Plus Jakarta Sans.
- Thai roles are approximately 10–12% larger with more line height than equivalent Latin text.
- Layout uses a 12-column editorial grid, 24px gutters, 48px desktop margins, and 16px mobile margins.
- The 64px Research Index Rail becomes bottom navigation below 900px.
- Depth is tonal. Only active folios/forms receive the restrained `0 8px 24px rgba(38,36,52,.06)` shadow.
- All controls have visible keyboard focus, hover, disabled, and reduced-motion behavior.

## Tokens and components

Tokens live in `app/globals.css`. Shared primitives live in `src/components/ui.tsx`; public/auth/dashboard shells in `src/components/shells.tsx`; research folios and compact rows in `src/components/research.tsx`.

Implemented patterns include primary/secondary/ghost buttons, input/select/textarea/checkbox, archive tabs, status indicators, loading/empty/success/error states, public header/footer, authentication split shell, dashboard shell, responsive Index Rail, Research Folio Card, compact research row, archive motif, citation connection, metrics, panels, stepper, and accessible tables.

## Routes

- `/` homepage
- `/login`, `/register`
- `/research`, `/research/[id]`
- `/admin` dashboard
- `/advisor` dashboard
- `/student` dashboard
- `/account` settings

All content is a local design fixture for Phase 2. There are no mock endpoints, raw fetch calls, tokens, sessions, or backend integration. Unsupported Google login and password recovery are visibly disabled rather than represented as working features.
