PHASE 4 — Review and refine the design

Read:

AGENTS.md
frontend/DESIGN.md
frontend/docs/page-implementation-plan.md
frontend/docs/page-implementation-progress.md
frontend/design/stitch/
All frontend routes
All shared frontend components

Run the frontend and inspect every completed page.

Objective

Review and refine the visual quality of the entire frontend without changing backend behavior or API contracts.

Modify frontend only.

Do not redesign the product from scratch.

Preserve the design identity defined in frontend/DESIGN.md.

Design review areas

Review each page for:

Visual consistency
Typography hierarchy
Thai font rendering
Text line height
Page width
Grid alignment
Spacing rhythm
Section spacing
Border radius
Border usage
Shadow usage
Color usage
Icon sizes
Status appearance
Button hierarchy
Form consistency
Table consistency
Card consistency
Product identity

Ensure every page preserves:

UniResearch identity
Mulberry Library design language
Living Research Index concept
Editorial academic character
Warm and credible visual tone
Consistent archive and research motifs

Remove generic AI-generated patterns.

Avoid turning every group of content into a rounded card.

Use typography, dividers, alignment, structured whitespace, and document-like metadata to create hierarchy.

Existing-page consistency

Compare newly created pages with completed reference pages.

Match:

Header height
Sidebar width
Page padding
Container width
Breadcrumb style
Page heading style
Form layout
Button sizing
Filter layout
Table density
Status badges
Loading states
Empty states
Error states

Do not change a shared pattern on one page without checking every page that uses it.

Responsive design

Inspect at approximately:

1440px
1024px
768px
390px

Verify:

No horizontal overflow
No clipped Thai text
No inaccessible controls
Tables have an appropriate mobile strategy
Filters have a mobile strategy
Sidebars transform correctly
Forms remain readable
Buttons remain reachable
Decorative elements do not obscure content
Accessibility

Verify:

Visible keyboard focus
Logical tab order
Persistent labels
Error associations
Sufficient contrast
Minimum target sizes
Screen-reader labels
Status does not depend on color alone
Reduced-motion support
Refactoring rules

You may:

Fix spacing
Improve responsive layouts
Refactor duplicated UI
Extend shared component variants
Correct inconsistent typography
Improve form usability
Add missing UI states
Improve accessibility
Align new pages with existing pages

You must not:

Change backend contracts
Change working business logic without evidence
Remove required fields
Rename API fields
Change role behavior
Introduce a new design system
Install a large UI library only to replace existing components
modify backend files
Visual verification

Create Playwright screenshots for major completed routes at desktop and mobile sizes.

Store generated test artifacts in the existing test output directory.

Do not commit unnecessary temporary screenshots unless the project policy requires them.

Required output

Create:

frontend/docs/design-review-report.md

Include:

Pages reviewed
Design inconsistencies found
Changes made
Shared components updated
Responsive issues fixed
Accessibility issues fixed
Remaining visual differences
Pages requiring manual review
Confirmation that backend remained unchanged

Update:

frontend/docs/page-implementation-progress.md