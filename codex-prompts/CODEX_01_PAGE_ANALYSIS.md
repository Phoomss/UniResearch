PHASE 1 — Create the page implementation plan

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/backend-capability-map.md
frontend/docs/frontend-current-route-inventory.md
frontend/docs/frontend-page-gap-analysis.md
frontend/docs/frontend-route-plan.md
frontend/docs/frontend-page-test-plan.md
frontend/docs/unsupported-design-features.md
frontend/src/app/
frontend/src/components/
frontend/src/features/
frontend/src/lib/
frontend/design/stitch/ if present

Do not modify application code during this phase.

Objective

Create a detailed implementation plan for all remaining frontend pages that are supported by the existing backend.

The backend is immutable.

Never modify:

backend routes
backend schemas
backend services
backend models
backend tests
backend configuration
backend database
backend static files

Use the completed backend analysis as the source of truth.

Do not invent an endpoint because a button exists in the design.

Page selection

Classify all missing or incomplete pages into:

P0: required for the core user workflow
P1: required for complete system management
P2: optional or future enhancement
Blocked: visible in the design but not supported by the backend

For every page, determine:

Proposed route
User role
User goal
Backend endpoints
Authentication requirement
Required permission
Existing reusable components
New components required
Form fields
Loading state
Empty state
Error state
Success state
Responsive behavior
Required tests
Design references
Implementation dependencies
Design requirements

Read frontend/DESIGN.md completely.

Do not copy only colors from DESIGN.md.

Follow its complete design language, including:

Typography
Color tokens
Spacing
Layout grid
Container widths
Border radius
Elevation
Responsive behavior
Interaction states
Accessibility
Editorial composition
Research archive visual language

Inspect existing completed pages and reuse their visual patterns.

New pages must appear to belong to the same product.

Do not create a different dashboard style for each role.

Do not introduce:

New random colors
New font families
Generic SaaS card grids
Full-page gradients
Glassmorphism
Excessive shadows
Excessive pill components
Unnecessary animations
Duplicate design components
Required output

Create:

frontend/docs/page-implementation-plan.md

The document must contain:

Current implementation status
Remaining supported pages
Pages ordered by implementation priority
Page dependencies
Reusable component map
API endpoint map
Testing requirements
Blocked pages
Recommended implementation batches
Definition of done for each page

Also create:

frontend/docs/page-implementation-progress.md

Initial status values:

Not started
In progress
Implemented
Integrated
Tested
Blocked

Do not implement pages yet.

Confirm at the end that no backend file changed.