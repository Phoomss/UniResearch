# Proposed frontend route plan

This tree uses App Router route groups for layouts/organization; route groups do not alter URLs. It intentionally omits routes whose workflows have no backend contract.

```text
app/
├─ (public)/
│  ├─ layout.tsx                    # SiteHeader + SiteFooter
│  ├─ page.tsx                      # /
│  ├─ research/
│  │  ├─ page.tsx                  # /research
│  │  └─ [id]/
│  │     ├─ page.tsx               # /research/[id]
│  │     ├─ loading.tsx
│  │     └─ not-found.tsx
│  └─ categories/
│     └─ page.tsx                  # /categories (P2 optional)
├─ (auth)/
│  ├─ layout.tsx                    # AuthShell
│  ├─ login/page.tsx               # /login
│  └─ register/page.tsx            # /register
├─ (account)/
│  └─ account/
│     └─ saved/page.tsx            # /account/saved (P1)
├─ (student)/
│  └─ student/
│     └─ research/
│        └─ new/page.tsx            # /student/research/new; migrate current submit page
├─ (advisor)/
│  └─ advisor/
│     └─ reviews/
│        └─ [id]/page.tsx           # /advisor/reviews/[id] (P0)
├─ (admin)/
│  └─ admin/
│     ├─ page.tsx                   # /admin; supported totals only
│     └─ categories/page.tsx        # /admin/categories (P1)
└─ api/
   ├─ auth/{login,logout,register}/route.ts
   ├─ categories/route.ts
   └─ research/
      ├─ route.ts
      └─ [id]/{download,favorite,review}/route.ts
```

## Navigation and redirect rules

- Public header: Home, Research, optional Categories, Login; authenticated state may show Saved and Logout.
- Do not guess a dashboard from cookie presence. The backend has no current-user endpoint, so login cannot authoritatively route by role.
- Server-side protected pages may confirm only that a token exists; the backend remains the authority and mutations must handle 401/403.
- Keep the current URLs as temporary redirects while migrating: `/dashboard/student/submit` → `/student/research/new`, `/dashboard/admin` → `/admin`. Do not redirect `/dashboard/reviewer` to a fabricated queue.

## Explicitly excluded routes

`/forgot-password`, `/reset-password`, `/verify-email`, `/account` profile, student own-submission/edit/revision/feedback routes, advisor queue/history, admin research/users/reviews, and admin analytics subroutes are excluded until matching backend operations exist.

## Surface placement

- Search filters: section/aside on `/research`.
- Authors/advisors: future sections inside the submission form, never standalone pages.
- PDF action/preview: section inside detail/review workspace when a safe contract exists.
- Approve/reject: confirmation dialog inside review workspace.
- Category creation: section or modal inside `/admin/categories`.
- Review comments: section inside review workspace.

