import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFileSync(new URL(path, root), "utf8");
const css = source("app/globals.css");

test("advisor shell uses the accessible stateful mobile drawer", () => {
  const shell = source("src/features/advisor/advisor-shell.tsx");
  assert.match(shell, /admin-mobile-menu-trigger/);
  assert.match(shell, /aria-expanded=\{mobileMenuOpen\}/);
  assert.match(shell, /aria-controls="advisor-mobile-navigation"/);
  assert.match(shell, /event\.key === "Escape"/);
  assert.match(shell, /advisor-menu-open/);
  assert.doesNotMatch(shell, /<details className="admin-mobile-menu">/);
});

test("advisor drawer uses the same ordered navigation structure as admin", () => {
  const advisor = source("src/features/advisor/advisor-shell.tsx");
  const admin = source("src/features/admin/admin-shell.tsx");
  for (const hook of [
    "admin-mobile-menu--admin",
    "admin-mobile-menu-header",
    "admin-mobile-menu-body",
    "admin-mobile-menu-close",
    "admin-mobile-menu-footer",
  ]) {
    assert.match(advisor, new RegExp(hook));
    assert.match(admin, new RegExp(hook));
  }
  assert.match(advisor, /<\/header>\s*\{mobileMenuOpen && \(/);
  assert.match(advisor, /<footer className="admin-mobile-menu-footer">/);
});

test("advisor dashboard, directory, profile and forms define phone layouts", () => {
  for (const selector of [
    ".advisor-app .adv-quick-filters",
    ".advisor-app .advisor-participant-table.admin-table-row",
    ".advisor-profile-grid",
    ".advisor-app .submission-workflow",
    ".advisor-app .adv-sidebar-panel",
  ]) {
    assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));
  }
  assert.match(css, /@media \(max-width: 480px\)/);
});

test("advisor inline desktop grids expose responsive class hooks", () => {
  assert.match(source("src/features/advisor/profile-form.tsx"), /advisor-profile-grid/);
  assert.match(source("app/advisor/profile/page.tsx"), /advisor-profile-card/);
  assert.match(css, /\.advisor-profile-grid\s*\{[\s\S]*?grid-template-columns: 1fr !important/);
  assert.match(css, /\.advisor-directory-metrics\s*\{[\s\S]*?grid-template-columns: 1fr !important/);
});

test("every advisor route remains present after responsive integration", () => {
  const routes = [
    "app/advisor/page.tsx",
    "app/advisor/advisees/page.tsx",
    "app/advisor/history/page.tsx",
    "app/advisor/new/page.tsx",
    "app/advisor/participants/page.tsx",
    "app/advisor/profile/page.tsx",
    "app/advisor/research/page.tsx",
    "app/advisor/reviews/page.tsx",
    "app/advisor/reviews/[id]/page.tsx",
    "app/advisor/submissions/page.tsx",
    "app/advisor/submissions/[id]/page.tsx",
  ];
  for (const route of routes) assert.match(source(route), /export default/);
});
