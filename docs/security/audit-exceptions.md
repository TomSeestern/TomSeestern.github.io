# Dependency-audit exceptions

`pnpm audit --prod --audit-level=high` runs in `.forgejo/workflows/check.yml`.
Anything new at high or critical fails the build. The advisories below are
accepted, with a reason and a review date, and are passed to the step as
`--ignore`.

Removing an entry is the goal; adding one needs a reason that explains why the
vulnerable code path is not reachable in production, not merely that a fix is
inconvenient.

## Accepted on 2026-10-24

| Advisory             | Package | Severity | Why accepted                                                                                                                                                                                                 | Review by  |
| -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| GHSA-mrhx-c7xc-m3w5  | `zod`   | high     | "Zod can exhaust memory while validating oversized constrained collections." Fixed in `zod@4.6.6`; this repo is on `zod@3.x`, so the fix is a major migration. Every schema that touches untrusted input is length-bounded (contact form: `name` ≤ 100, `message` ≤ 5000), so the oversized-collection path is not reachable. Tracked as a follow-up, not fixed here. | 2027-01-31 |
| GHSA-6g55-p6wh-862q  | `postcss` | high   | Reached only through `next@15.5.28`'s own `postcss@8.4.31`. PostCSS runs at build time and parses the project's own Tailwind output — no untrusted CSS reaches it at runtime. Overriding a framework-internal pin was judged riskier than the exposure. | 2027-01-31 |
| GHSA-r28c-9q8g-f849  | `postcss` | high   | Same path and same reasoning as above.                                                                                                                                                                        | 2027-01-31 |

## Fixed while adding the scan

- **GHSA-2464-fhr4-w9xw** (`next`, critical) and **GHSA-p3m5-59mp-jv5r**
  (`next`, high): patched by moving `next` and `eslint-config-next` from
  `15.5.24` to `15.5.28`.
- The remaining advisories present on 2026-10-24 (`brace-expansion`,
  `browserslist`, `js-yaml`, `nanoid`, `source-map-js`,
  `baseline-browser-mapping`, `sharp`) cleared with an in-range
  `pnpm update`. The audit went from 22 findings (1 critical, 15 high) to 5
  (0 critical, 3 high), all three of which are listed above.

## Re-check

Run `pnpm audit --prod --audit-level=high` without the ignores. When an entry
no longer appears, delete it from this file and from the workflow step.
