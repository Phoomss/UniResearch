import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFileSync(new URL(path, root), "utf8");
const css = source("app/globals.css");

test("admin shell exposes an accessible mobile drawer", () => {
  const shell = source("src/features/admin/admin-shell.tsx");
  assert.match(shell, /admin-mobile-menu-trigger/);
  assert.match(shell, /aria-expanded=\{mobileMenuOpen\}/);
  assert.match(shell, /aria-controls="admin-mobile-navigation"/);
  assert.match(shell, /event\.key === "Escape"/);
  assert.match(shell, /admin-mobile-backdrop/);
  assert.match(css, /body\.admin-menu-open/);
});

test("admin hamburger and drawer stay on the right above dashboard content", () => {
  const shell = source("src/features/admin/admin-shell.tsx");
  assert.match(css, /\.admin-app \.admin-topbar\s*\{[\s\S]*?z-index: 1000/);
  assert.match(css, /\.admin-mobile-menu-trigger\s*\{[\s\S]*?z-index: 1030[\s\S]*?margin-left: auto/);
  assert.match(css, /\.admin-mobile-backdrop\s*\{[\s\S]*?z-index: 1010/);
  assert.match(css, /\.admin-mobile-menu\s*\{[\s\S]*?right: 0;[\s\S]*?left: auto;[\s\S]*?z-index: 1020/);
  assert.match(css, /\.admin-mobile-menu-close\s*\{[\s\S]*?position: absolute/);
  assert.match(shell, /<\/header>\s*\{mobileMenuOpen && \(/);
  assert.match(shell, /admin-mobile-menu-close/);
});

test("admin hamburger navigation has grouped touch-friendly tab states", () => {
  const shell = source("src/features/admin/admin-shell.tsx");
  assert.match(shell, /admin-mobile-menu admin-mobile-menu--admin/);
  assert.match(shell, /admin-mobile-menu-header/);
  assert.match(shell, /admin-mobile-menu-body/);
  assert.match(shell, /<footer className="admin-mobile-menu-footer">/);
  assert.match(css, /\.admin-mobile-menu--admin \.admin-nav-group\s*\{/);
  assert.match(css, /\.admin-mobile-menu--admin \.admin-mobile-menu-body\s*\{[\s\S]*?overflow-y: auto/);
  assert.match(css, /\.admin-mobile-menu--admin \.admin-nav-group > a\s*\{[\s\S]*?min-height: 48px/);
  assert.match(css, /\.admin-mobile-menu--admin \.admin-nav-group > a\.active\s*\{[\s\S]*?background: #ece3f3/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});

test("all admin density patterns have phone layouts", () => {
  assert.match(css, /@media \(max-width: 700px\)/);
  for (const selector of [
    ".admin-users-grid.admin-user-row",
    ".admin-research-table.admin-table-row",
    ".admin-modal-field-grid",
    ".adv-item-card",
    ".admin-analytics-metrics",
    ".admin-decision-actions",
  ]) {
    assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));
  }
});

test("inline desktop grids opt into responsive overrides", () => {
  assert.match(source("app/admin/options/page.tsx"), /admin-options-grid/);
  assert.match(source("app/admin/profile/page.tsx"), /admin-profile-card/);
  assert.match(source("src/features/admin/admin-user-manager.tsx"), /admin-modal-field-grid/);
  assert.match(css, /\.admin-options-grid\s*\{[\s\S]*?grid-template-columns: 1fr !important/);
});

test("deep audit covers controls, long text, charts, actions and modal viewport", () => {
  const analytics = source("src/features/admin/admin-analytics-dashboard.tsx");
  const users = source("src/features/admin/admin-user-manager.tsx");
  const options = source("app/admin/options/page.tsx");
  assert.match(analytics, /admin-custom-date-range/);
  assert.match(analytics, /admin-chart-legend/);
  assert.match(users, /admin-user-row-actions/);
  assert.match(users, /admin-modal-actions/);
  assert.match(users, /aria-label=\{`แก้ไขข้อมูล/);
  assert.match(options, /admin-options-row/);
  assert.match(options, /admin-options-actions/);
  assert.match(options, /aria-label=\{`เลื่อน \$\{name\} ขึ้น`\}/);
  assert.match(css, /\.modal-content\s*\{[\s\S]*?max-height: calc\(100dvh - 32px\)/);
  assert.match(css, /\.admin-row-actions > a[\s\S]*?width: 44px !important/);
  assert.match(css, /\.admin-custom-date-range\s*\{[\s\S]*?max-width: 100%/);
});
