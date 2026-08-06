# UniResearch Frontend App TSX Formatting

## Role

Act as a senior Next.js and TypeScript frontend developer.

Analyze and safely format all relevant `.tsx` files inside:

```text
D:\Project-69\UniResearch\frontend\app
```

Some files contain one-line, compressed, or poorly formatted code. Convert them into clean, readable, and maintainable TypeScript/React code without changing existing behavior.

## Main Objectives

1. Inspect every `.tsx` file under `frontend/app`.
2. Prioritize route-level files such as:

   * `page.tsx`
   * `layout.tsx`
   * `loading.tsx`
   * `error.tsx`
   * `not-found.tsx`
   * `.tsx` components stored inside route folders
3. Detect one-line, compressed, minified, or unreadable code.
4. Reformat the code into clean and maintainable TSX.
5. Preserve the existing UI, routes, logic, API calls, state, styling, and behavior.
6. Validate the edited files after formatting.
7. Finish with a concise summary of inspected and modified files.

## Project Paths

Project root:

```text
D:\Project-69\UniResearch
```

Frontend root:

```text
D:\Project-69\UniResearch\frontend
```

Primary scope:

```text
D:\Project-69\UniResearch\frontend\app
```

## Safety Rules

Run this before editing:

```bash
git status
```

Rules:

* Preserve all existing user changes.
* Do not use destructive Git commands.
* Do not run:

  * `git reset --hard`
  * `git clean -fd`
  * `git checkout .`
  * `git restore .`
* Do not delete or rename files.
* Do not move routes or folders.
* Do not install, remove, or upgrade packages.
* Do not modify backend code.
* Do not modify generated folders such as:

  * `.next`
  * `node_modules`
  * `dist`
  * `build`
  * `coverage`
* Do not perform a large refactor or architectural rewrite.

## Required Analysis

For every `.tsx` file under `frontend/app`, determine:

* File path
* Route or page represented by the file
* Main component responsibility
* Whether the code is one-line or poorly formatted
* Whether the file requires formatting
* Whether the file contains nested JSX that is difficult to read
* Whether imports, hooks, handlers, objects, or arrays are compressed
* Whether formatting can be changed safely without affecting behavior

Only modify files that need formatting or very small, clearly safe readability improvements.

## Formatting Rules

Apply the existing project style whenever configuration is available.

Required formatting:

* One statement per line.
* Use consistent indentation.
* Add appropriate line breaks between logical sections.
* Split long JSX elements into multiple lines.
* Split long JSX props into multiple lines.
* Format nested JSX clearly.
* Format long objects and arrays across multiple lines.
* Format chained method calls clearly.
* Format import statements clearly.
* Keep hooks near the beginning of the component.
* Keep event handlers separate and readable.
* Keep the return JSX visually structured.
* Remove unnecessary duplicate blank lines.
* Preserve useful comments.
* Preserve existing naming unless a name is clearly internal and unreadable.

Example before:

```tsx
"use client";import {useState} from "react";export default function Page(){const [open,setOpen]=useState(false);return <main><button onClick={()=>setOpen(!open)}>Toggle</button>{open&&<section><h1>Content</h1><p>Example text</p></section>}</main>}
```

Example after:

```tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <button onClick={() => setOpen(!open)}>
        Toggle
      </button>

      {open && (
        <section>
          <h1>Content</h1>
          <p>Example text</p>
        </section>
      )}
    </main>
  );
}
```

## Allowed Safe Improvements

The following changes are allowed only when behavior remains identical:

* Reformat one-line or compressed code.
* Organize imports using the existing project convention.
* Remove imports that are confirmed unused.
* Add missing spaces, indentation, semicolons, or line breaks.
* Move large static arrays or objects outside the component within the same file.
* Extract a small local helper function within the same file.
* Replace a complex inline handler with a named local handler.
* Add obvious TypeScript types when they do not alter behavior.
* Use early returns only when the output and behavior are exactly equivalent.
* Add a short comment for genuinely complex logic.

## Forbidden Changes

Do not change:

* UI design
* Displayed text
* Tailwind classes
* CSS class names
* Component behavior
* Business logic
* Form behavior
* Validation rules
* React state behavior
* Hook dependency arrays
* API endpoints
* Request payloads
* Response handling
* Authentication
* Authorization
* Role checks
* Route names
* Dynamic route parameters
* Navigation destinations
* Query parameters
* Cookies
* Token names
* Local storage keys
* Environment variable names

Also do not:

* Rewrite an entire page.
* Split every page into multiple new components.
* Convert server components into client components.
* Convert client components into server components.
* Add or remove `"use client"` unless required to preserve an already valid implementation.
* Replace existing libraries.
* Add new functionality.
* Fix unrelated application bugs unless necessary to preserve valid syntax after formatting.

## Next.js App Router Rules

Because this project uses the Next.js App Router:

* Preserve special filenames such as `page.tsx`, `layout.tsx`, `loading.tsx`, and `error.tsx`.
* Preserve default exports required by Next.js.
* Preserve route folder structure.
* Preserve dynamic route folders such as `[id]`.
* Preserve route groups such as `(admin)` or `(public)`.
* Preserve server/client component boundaries.
* Preserve async page components.
* Preserve metadata exports.
* Preserve `generateMetadata`, `generateStaticParams`, and route-specific exports.
* Do not move code in a way that changes rendering behavior.

## Formatter and Project Configuration

Inspect:

```text
frontend/package.json
```

Also inspect configuration files when present:

```text
.prettierrc
.prettierrc.*
prettier.config.*
eslint.config.*
.eslintrc.*
tsconfig.json
```

Use the existing formatter and lint rules.

Prefer using Prettier only on the relevant `.tsx` files when Prettier is already installed.

Possible command:

```bash
pnpm exec prettier --write "app/**/*.tsx"
```

Run this only if Prettier is already available in the project.

Do not install Prettier or any other package.

Use the package manager indicated by the lock file:

* `pnpm-lock.yaml` → pnpm
* `package-lock.json` → npm
* `yarn.lock` → Yarn

## Validation

After editing, inspect the changes:

```bash
git diff -- frontend/app
```

Confirm that:

* Changes are primarily formatting changes.
* No routes were changed.
* No API endpoints were changed.
* No business logic was changed.
* No UI text was changed.
* No CSS or Tailwind behavior was changed.
* No client/server component boundary was changed.
* No user work was overwritten.

Inspect scripts in `frontend/package.json` and run only scripts that already exist, such as:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

or:

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
```

Do not assume a script exists.

Do not run `pnpm dev` as the main validation because it starts a persistent development server.

If lint, type-check, or build fails:

* Record the command.
* Record the actual error.
* Identify the related file.
* State whether the error appears related to formatting or was pre-existing.
* Do not hide or falsely report successful validation.

## Final Response

After completing the task, provide a concise summary in this format:

```text
UniResearch frontend/app TSX formatting completed

Files inspected:
- Total number

Files modified:
- Path
- Path

Files already readable:
- Total number

Validation:
- Formatter:
- Lint:
- Type-check:
- Build:

Behavior changes:
- None

Remaining errors:
- Error details, or "None"

Important notes:
- Any files skipped and the reason
```

## Completion Criteria

The task is complete only when:

1. Every relevant `.tsx` file under `frontend/app` has been inspected.
2. One-line or compressed code has been formatted.
3. Edited files are readable and maintainable.
4. Existing UI and behavior remain unchanged.
5. No application architecture was rewritten.
6. Existing validation scripts were run when available.
7. The final response lists the actual modified files and validation results.

Start now. Do not stop after describing a plan.
