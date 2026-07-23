# Task 7 visual closure boulder

- Status: completed
- Owner: Sisyphus-Junior
- Scope: replace failed V1 marquee edge-guard strategy with CSS-only whole-card project collection; preserve existing font/token work, descendant Motion settlement, configurable production audit URL, and two-run raw evidence contracts.
- Files locked: released.
- Dependencies: Visual QA oracle PASS (bg_6e19b9c4 PASS HIGH, bg_cf42786d PASS HIGH) — both returned no blocking findings.
- Evidence: `.omo/evidence/task-7-collection-replacement.txt` — all gates green.
- Root cause: any continuously translated fixed-width track crosses viewport boundaries between cards. Opaque guards can conceal fragments but cannot make underlying title/body geometry whole.

## Verification results (2026-07-23)

- Prettier: PASS
- ESLint: PASS
- Jest: 91/91 PASS
- Build: 47/47 static pages, no errors
- Axe audit: 0 contrast violations at 375/1280 light/dark; all cards fullyInside: true
- E2E run 1: 43/43 PASS (32.1s)
- E2E run 2: 43/43 PASS (27.0s)
- Screenshots: fresh at `.omo/evidence/task-7-production-{375,1280}-{light,dark}.png`
- Visual QA Pass A (design-system): PASS, HIGH confidence, no blocking findings
- Visual QA Pass B (visual fidelity): PASS, HIGH confidence, no blocking findings
- Server cleanup: port 3199 process killed via trap, verified no listener remains
