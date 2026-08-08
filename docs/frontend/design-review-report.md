# Frontend design review report

Review date: 2026-08-03.

## Pages reviewed

The review covered every implemented page surface and compatibility route: `/`, `/login`, `/register`, `/research`, `/research/[id]`, `/student/research/new`, `/advisor/reviews/[id]`, `/account/saved`, `/admin`, `/admin/categories`, `/dashboard/reviewer`, plus the redirect-only `/dashboard/student`, `/dashboard/student/submit`, and `/dashboard/admin` routes. Loading, error, empty, and not-found boundaries were reviewed with their parent shells.

Representative screenshots were generated in `frontend/test-results/design-review/` at 1440×1000 and 390×844. Public, authentication, dashboard, form, management, empty, and backend-unavailable states were included. The screenshot runner used a dummy frontend-only cookie to reveal protected layouts and did not perform backend writes.

## Inconsistencies found

- Public navigation could exceed the available width near 1024px because desktop navigation and both header actions remained visible until the 900px mobile breakpoint.
- Dashboard content had no maximum reading width on very large screens.
- Panels, form surfaces, and empty states shared similarly rounded, equally weighted containers, weakening the editorial hierarchy.
- Loading panels displayed skeletons but did not expose their supplied title/detail to screen readers.
- Field hint text was visually adjacent but not connected through `aria-describedby`.
- Disabled styling covered inputs but not selects and textareas.
- Fixed mobile Index Rail clearance was marginal on long forms and management pages.
- Large page headings lacked consistent default margins and balanced wrapping across Thai and Latin titles.
- Horizontally scrollable category tables were not keyboard-focusable regions.
- The language indicator used an excessive pill radius compared with the archive-tab shape language.

## Changes made

- Added a 1120px compact-header breakpoint while preserving the 900px rail-to-bottom-navigation transition.
- Added a 1500px dashboard content maximum and consistent heading margins/balanced wrapping.
- Reduced general panel/state radius and tonal weight. Active forms now receive the permitted restrained shadow and a mulberry folio rule, making them distinct from passive information panels.
- Added responsive bottom clearance, tighter mobile panel/state padding, and maintained one-column form/table strategies.
- Added visible consistent disabled styling for input, select, and textarea controls.
- Converted state headings to a dedicated, smaller editorial scale instead of reusing full section headings.
- Made category tables keyboard-focusable labeled scroll regions.
- Associated field hints with their controls and made loading-state context screen-reader accessible.
- Replaced the language indicator's fully pill-shaped container with the established 8px archive radius.

## Shared components updated

- `Field`: retains name/id label association and now connects hint text with `aria-describedby`; required marks are decorative to assistive technology because the native control remains authoritative.
- `StatePanel`: adds state-specific classes, screen-reader loading text, and a dedicated state-title hierarchy.
- `CategoryTable`: adds an accessible region label and keyboard focus for horizontal scrolling.
- Global styles: typography rhythm, tablet header strategy, dashboard width, active-form elevation, control states, mobile safe area, and table focus behavior.

## Responsive issues fixed

- At approximately 1024px, primary navigation now collapses before it can collide with brand/actions.
- At 768px, dashboard grids remain one column and tables retain a deliberate horizontal-scroll strategy.
- At 390px, panels and state surfaces use smaller internal padding, action groups remain reachable, and dashboard pages retain 112px of bottom clearance above the 64px Index Rail.
- Thai headings use balanced wrapping with the existing generous line height; no clipped glyphs were observed in the desktop/mobile screenshot set.

## Accessibility issues fixed

- Persistent programmatic labels remain in place.
- Hint text is announced with its control.
- Loading state purpose and detail are announced rather than represented by silent skeletons.
- Scrollable tables can receive keyboard focus and have a region name.
- Focus rings, semantic status/error roles, non-color status text, 46px button targets, and reduced-motion rules remain intact.

## Remaining visual differences and manual review

- Backend-dependent success/data-rich states could not be visually captured without the disposable real backend, so populated folios, populated favorites/categories, successful mutations, and review success still require manual visual review in that environment.
- Screenshots were captured at 1440px and 390px. The 1120px/900px/520px CSS strategies and production build were verified statically, but exact 1024px, 768px, and device-font rendering should receive a final human browser pass.
- Several dashboard/P1 surfaces use English copy while public/auth surfaces are Thai-first. This is a content-localization difference, not a new design system; translation requires product-approved copy.
- The non-functional language indicator and static legal/help text remain product/content gaps.
- No data-rich `/research/[id]` screenshot was possible without a seeded backend ID.

## Verification

- Frontend tests: 17 passed after the review.
- TypeScript strict check: passed.
- ESLint: passed.
- Production build: passed.
- Screenshot artifacts: generated for nine major rendered routes at desktop and mobile sizes. The capture command wrote all artifacts but did not exit cleanly while backend-dependent requests remained unavailable, so it was terminated after files were produced and inspected.

No API path, request field, response adapter, session behavior, permission behavior, or backend file was changed.
