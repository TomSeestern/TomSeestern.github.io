# Task 28 — Static Playwright coverage

- status: blocked
- owner: Sisyphus-Junior
- scope: `e2e/static-routes.spec.ts`, `playwright.config.ts`, `env.mjs`, `lib/sendEmail.tsx`, task evidence, portfolio learnings
- file lock: Task owns static E2E coverage and Task 28 `.omo/` records; no content repair or Nix runtime dependency changes
- dependencies: Task 9 complete
- verification: Chromium static suite attempted through Nix pnpm with `PNPM_HOME` and `npm_config_prefix` unset; blocked by missing `libglib-2.0.so.0` before test navigation
- evidence: `.omo/evidence/task-28-2026-portfolio-overhaul.txt`
- blockers: malformed Markdown frontmatter makes `/` return HTTP 500; Nix shell lacks Playwright Chromium runtime library `libglib-2.0.so.0`
- next action: repair project Markdown YAML and/or browser runtime, then run Chromium suite and `pnpm e2e:headless`
