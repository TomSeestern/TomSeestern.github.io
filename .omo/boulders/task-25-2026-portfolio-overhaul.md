# Task 25 — Simple component Jest coverage

- status: completed
- owner: Sisyphus-Junior
- scope: `components/{Button,Footer,Header,PersonTeaser,TimelineEntry,Tooltip}/*.test.tsx`, task evidence, portfolio learnings
- file lock: Task owns six listed component test files and specified `.omo/` records; production components remain read-only unless a test proves a defect.
- dependencies: Task 23 complete; Task 7 Footer accessible-name regression complete.
- verification: Nix `pnpm` commands with `PNPM_HOME` and `npm_config_prefix` unset; focused Jest must show at least five behavioral tests for each component; then full Jest and Storybook build when viable.
