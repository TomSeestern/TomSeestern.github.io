---
slug: 2026-audit-remediation
status: approved-for-execution
intent: unclear
review-required: true
approval-source: explicit /start-work 2026-audit-remediation
pending-action: execute .omo/plans/2026-audit-remediation.md
approach: rebaseline every CRITICAL and HIGH finding, prove reproducible failures first, make the smallest evidence-backed fix, and record stale or blocked findings without product edits
---

# Draft: 2026-audit-remediation

## Components (topology ledger)

| id | outcome | status | evidence path |
| --- | --- | --- | --- |
| S1 | Theme, headers, SEO, and root-layout accessibility are secure and browser-compatible | active | `.omo/evidence/task-01-2026-audit-remediation.txt` through `task-04` |
| S2 | Contact submission has validated, typed, privacy-preserving failure behavior without fake protections | active | `.omo/evidence/task-05-2026-audit-remediation.txt` |
| S3 | Markdown detail routes share one safe loader/renderer and emit correct 404 and metadata behavior | active | `.omo/evidence/task-06-2026-audit-remediation.txt` and `task-07` |
| S4 | Public components, pages, images, tokens, and interaction states meet approved accessibility and design findings | active | `.omo/evidence/task-08-2026-audit-remediation.txt` through `task-14` |
| S5 | Project and blog content receives only source-authorized mechanical corrections | active | `.omo/evidence/task-15-2026-audit-remediation.txt` and `task-16` |
| S6 | Dependency, generated-artifact, documentation, and coverage claims are rebaselined and verified | active | `.omo/evidence/task-17-2026-audit-remediation.txt` through `task-20` |

## Open assumptions (announced defaults)

| assumption | adopted default | rationale | reversible? |
| --- | --- | --- | --- |
| Candidate inventory may be stale | Every TODO starts with current-state characterization; stale/already-fixed means evidence-only, no product change | Decision source explicitly contains contradictory labels and current code already disproves some claims | yes |
| CSP compatibility unknown | Capture report-only/rebaseline observations first, then enforce least-permissive production-compatible policy; don't add nonce infrastructure | `next.config.mjs` has no headers and `app/layout.tsx` has no nonce path | yes |
| Contact rate limiting desired | Add no dependency. Use bounded in-process rate-limit hook only if runtime ownership and stable client key are proved; otherwise mark C20 blocked/deferred | README describes Vercel/server-action deployment, where process-local counters may not provide real distributed protection | yes |
| Next target ambiguous | Verify advisory and installed state, then align `next`, `@next/bundle-analyzer`, and `eslint-config-next` to lock-resolved supported secure `14.2.35` only if still applicable | Manifest says `next ^14.0.3`; lock resolves `next 14.2.35` and bundle analyzer `14.2.35`, while eslint config remains `14.0.3` | yes |
| Storybook output ownership unclear | Treat `storybook-static/**` as disposable QA output unless `git ls-files` proves ownership; clean it after QA | Current `git ls-files "storybook-static/**"` returned no tracked files | yes |
| Public factual content may lack source | Preserve text when no primary source exists; record H3/H4/H5/H6 as blocked or stale rather than invent CPU specs, dates, IDs, images, or claims | Source risk matrix itself says factual change needs verification | yes |
| Completed YAML repair may overlap content | Keep it prerequisite-only; never rerun its task or change its state; run existing validator after project-content tasks | Boulder and evidence mark it completed and prove 21 parseable project files | yes |
| Dirty worktree is inherited | Each task records `git status --short`, claims exact file ownership, and rejects unrelated diffs before commit | Baseline has 4 modified and 23 untracked paths, including unrelated Footer test and `.omo` state | yes |
| MEDIUM audit findings | Defer all MEDIUM findings exactly as source lead states; don't silently promote them | Decision inventory scope says `MEDIUM deferred per lead` | yes |

## Findings (cited - path:lines)

- Candidate inventory and global deferral: `.omo/decisions/2026-remediation-architecture.md:1-4`.
- Hot-file ownership and C/H surface inventory: `.omo/decisions/2026-remediation-architecture.md:6-28`.
- Contradictory old dependencies requiring rebaseline: `.omo/decisions/2026-remediation-architecture.md:30-56`, `311-322`.
- Proposed changes and original acceptance hints: `.omo/decisions/2026-remediation-architecture.md:58-233`.
- Old wave labels are internally inconsistent with finding IDs: `.omo/decisions/2026-remediation-architecture.md:235-279`.
- Risk classifications and explicit factual-content caveat: `.omo/decisions/2026-remediation-architecture.md:281-309`.
- Current audit context records stale copyright and content assertions: `.omo/notepads/2026-portfolio-overhaul/learnings.md:878-940`; current Footer already shows 2026, so that separate old failure is stale.
- YAML prerequisite completed with exact 21-file validator: `.omo/boulders/task-yaml-frontmatter-repair.md:1-8`, `.omo/evidence/task-yaml-frontmatter-repair.txt:49-69`.
- Current layout lacks theme initialization and skip target: `app/layout.tsx:8-44`; Tailwind already uses class dark mode: `tailwind.config.js:19-30`.
- Current config lacks headers/CSP: `next.config.mjs:8-24`.
- Contact client and action still pass unvalidated raw strings and boolean results, with `console.error`: `app/contact/page.tsx:6-105`, `lib/sendEmail.tsx:6-32`; tests cover only Resend success/failure/key absence: `lib/sendEmail.test.tsx:25-78`.
- Detail routes duplicate synchronous loading, return literal 404/loading UI, swallow metadata errors, and omit detail Twitter metadata: `app/blog/entry/[slug]/page.tsx:25-115`, `app/projects/entry/[slug]/page.tsx:25-117`.
- Existing shared listing parser validates frontmatter but has no detail-loader API: `lib/markdown.ts:6-44`.
- Homepage still uses JPEG hero, ad hoc heading sizes, `primary-*`, and decorative arrow alt text: `app/page.tsx:36-204`.
- Existing Radix wrapper exists while ProjectTeaser still imports Flowbite Tooltip and uses arbitrary min heights/decorative alt text: `components/Tooltip/Tooltip.tsx:1-41`, `components/ProjectTeaser/ProjectTeaser.tsx:1-99`.
- Project list lacks focused unit test and its two CTA links lack focus-visible rings: `app/projects/page.tsx:32-103`; current test inventory has no `app/projects/page.test.tsx`.
- Package/lock mismatch: `package.json:24-59`, `package.json:102-104`; `pnpm-lock.yaml:11-13`, `88`, `240`, `5204`, `13251`, `15886`.
- Generated Storybook directory exists but isn't tracked; `.gitignore:8-15` doesn't currently name it.

## Decisions (with rationale)

1. Use 20 implementation TODOs plus four final gates. This maps each C1-C20 and H1-H15 exactly once while serializing named hot files.
2. Treat C1-C20 and H1-H15 as candidate claims. Each TODO records `reproducible`, `stale/already-fixed`, or `blocked/deferred` before edits.
3. Use TDD for behavior changes. Add passing baseline characterization first, capture failing regression proof second, then apply minimal production change. Use baseline plus tests-after for config, static assets, content, and docs.
4. Keep `app/layout.tsx` serialized as tasks 1, 3, and 4. Keep contact cluster task 5 atomic. Keep detail/shared Markdown tasks 6 then 7. Keep `app/page.tsx` tasks 9 then 13. Keep `app/projects/page.tsx` tasks 10 then 13. Keep project content tasks 15 then 16. Keep dependency/config tasks 17 then 18.
5. Don't implement invented CSRF tokens. H11 verifies Next server-action origin/host protection and adds only evidence-backed regression/config changes.
6. Don't claim in-process rate limiting protects serverless deployment. C20 may end blocked/deferred with proof.
7. C14 owns Storybook QA artifact disposition, not committing generated bundles.
8. H3-H6 make no factual edits without source. H2 and C16 permit only exact mechanical author/image normalization already named by findings.
9. Every task writes `.omo/evidence/task-<id>-2026-audit-remediation.txt` and appends events to `.omo/start-work/ledger.jsonl`, including `DoneClaim`, independent `AdversarialVerify`, all nine ultraqa class dispositions, cleanup receipt, baseline/after `git status --short`, changed-file list, commands with exits, timestamp, model, and token usage when available.
10. Explicit `/start-work 2026-audit-remediation` is bootstrap approval. No second approval interview blocks execution after plan generation.

## Scope IN

- C1-C20 and H1-H15 only, with exactly one primary disposition per finding.
- Regression tests, real-browser/curl QA, minimal product changes, task evidence, ledger events, Boulder updates during execution, and one conventional commit per verified top-level task when a product or task-record change exists.
- Completed YAML validator reused after project content work.
- Production build, full Playwright, Storybook build/smoke, route/header curl, lint, formatting, and Jest final gates through Nix shell with pnpm.

## Scope OUT (Must NOT have)

- All MEDIUM findings and optional audit improvements.
- Product changes for stale, already-fixed, unverified, or blocked claims.
- New dependencies, invented CSP nonces, invented distributed rate limiting, invented CSRF token systems, telemetry, or external logging.
- Reopening YAML frontmatter repair, changing prior portfolio plan checkboxes, deleting duplicate Boulder history, or overwriting unrelated dirty work.
- Changes to approved text, IDs, dates, filenames, slugs, or images unless C/H finding explicitly authorizes exact value and evidence verifies it.
- Committed `storybook-static/**` unless tracked ownership is proved before task 18.

## Open questions

None. UNCLEAR defaults adopted and exposed above. Any runtime-distribution or factual-source absence resolves to blocked/deferred evidence, not invention.

## Approval gate

status: consumed
approval: explicit `/start-work 2026-audit-remediation`
approval-scope: generate this plan and begin execution under start-work bootstrap rules
review: mandatory plan gap/adversarial review is an execution preflight; it doesn't reopen user interview

