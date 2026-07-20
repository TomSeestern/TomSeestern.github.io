# Task 24 — Lib unit coverage

- status: completed
- owner: Sisyphus-Junior
- scope: `lib/markdown.test.ts`, `lib/sendEmail.test.tsx`, `lib/sendEmail.tsx`, `package.json`, task evidence, portfolio learnings
- file lock: Task owns lib test coverage and specified `.omo/` records; no components or Markdown content changes
- dependencies: Task 11 complete
- verification: Nix `pnpm` commands with `PNPM_HOME` and `npm_config_prefix` unset; focused Jest (2 suites / 15 tests) and full Jest (8 suites / 29 tests) pass. Build compiles then fails on inherited malformed content YAML; evidence records exact commands and cleanup receipt.
