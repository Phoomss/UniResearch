#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="${1:-$(pwd)}"
PROJECT_DIR="$WORKSPACE_DIR/frontend"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required. Install it before running this script."
  exit 1
fi

if [ -e "$PROJECT_DIR" ]; then
  echo "$PROJECT_DIR already exists. Refusing to overwrite it."
  exit 1
fi

pnpm create next-app@latest "$PROJECT_DIR" \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm

cd "$PROJECT_DIR"
pnpm add zod
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @playwright/test
pnpm exec playwright install

cp -R "$SCRIPT_DIR/frontend-template/." "$PROJECT_DIR/"

node <<'NODE'
const fs = require('node:fs');
const path = 'package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  typecheck: 'tsc --noEmit',
  test: 'vitest run',
  'test:watch': 'vitest',
  'test:e2e': 'playwright test',
  verify: 'pnpm lint && pnpm typecheck && pnpm test && pnpm build'
};
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
NODE

cp "$SCRIPT_DIR/design/DESIGN.md" "$PROJECT_DIR/DESIGN.md"
cp "$SCRIPT_DIR/AGENTS.md" "$WORKSPACE_DIR/AGENTS.md"

echo ""
echo "Frontend created at: $PROJECT_DIR"
echo "Next:"
echo "  1. Copy Stitch screenshots/export into $PROJECT_DIR/design/stitch/"
echo "  2. Copy .env.example to .env.local"
echo "  3. Run Codex from the workspace root"
echo "  4. Execute the prompt files in numerical order"
