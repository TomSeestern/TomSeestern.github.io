# ESLint 9 flat-config migration evidence

Timestamp: 2026-07-22
Task: `T-fd196dbd-bd3e-4ccd-85d5-d01335ed9d40`
Model: `9router/default`

## Delivered

- Replaced legacy `.eslintrc.js` with `eslint.config.js`.
- Removed unsupported `.eslintignore`; flat config owns ignore patterns.
- Moved `lint` and `lint:fix` from deprecated `next lint` to ESLint CLI, scoped to `app`, `components`, and `lib`.
- Upgraded ESLint ecosystem to ESLint `9.39.5`; removed stale `eslint-config-react-app`.
- Preserved project rule overrides and baseline warning-only behavior: 55 warnings, zero errors.
- Updated README lint command/config-file references.

## Reproducible verification

Environment: Node `v22.23.1`, pnpm `10.15.1`. Run each command after `unset PNPM_HOME npm_config_prefix`.

```sh
pnpm lint
# PASS: 0 errors, 55 existing warnings

pnpm prettier
# PASS: all matching JS/JSX/TS/TSX files formatted

pnpm test
# PASS: 15 suites, 91 tests

pnpm build
# PASS: Next.js 15.5.21 production build, 47 static pages

pnpm e2e:headless
# PASS: 40 Chromium tests

git diff --check
# PASS: no whitespace errors
```

LSP diagnostics unavailable: TypeScript and Biome language servers were previously declined/not installed. Production build performed type validation.

## Notes

- `eslint-config-prettier` compatibility probe cannot run directly because `eslint-config-next` applies `@rushstack/eslint-patch` only when invoked through ESLint. Normal `pnpm lint` and `pnpm build` both load configuration successfully.
- Playwright emitted an informational Next development warning about future `allowedDevOrigins` configuration; all tests passed.
