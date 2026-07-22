# Decision — pnpm override configuration location

**Date:** 2026-07-22
**Status:** Accepted
**Task:** Task 3 transitive vulnerability remediation

## Context

`pnpm@10.15.1` ignores `package.json#pnpm.overrides` and warned that this
setting now belongs in workspace configuration. Root-level `overrides` in
`package.json` also did not affect audited transitive paths.

## Decision

Add root `pnpm-workspace.yaml` with only four exact scoped overrides:

```yaml
overrides:
  "@next/eslint-plugin-next>glob": "10.5.0"
  "@typescript-eslint/typescript-estree>minimatch": "9.0.7"
  "concurrently>shell-quote": "1.9.0"
  "next>postcss": "8.5.10"
```

No `packages` field. In pnpm workspace configuration, omission includes root
project. No broad or speculative overrides are allowed.

## Consequences

`pnpm install` records overrides in `pnpm-lock.yaml`, removes four audited
transitive vulnerable paths, and lowers local audit count from 26 to 20.
Remaining Next advisories require planned Task 5; `next-compose-plugins`
remains unchanged until then.
