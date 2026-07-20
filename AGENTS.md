# AGENTS

Read [README.md](./README.md) for user-facing setup and operation.

## Project rules

These rules apply to the entire project — all agents, all workers, all code
and planning work. They are non-optional.

Each rule heading is prefixed `R{top}.{sub}` (e.g. `R1.1`, `R4.2`, `R9.1`)
and tagged with its enforcement status:

- **`[manual]`** — convention only; no automated check exists. The line
  immediately after the heading carries a justification HTML comment
  explaining why automation is not feasible.
- **`[auto: <mechanism>]`** — actively enforced by an automated check
  named in the tag. The check is run by a pre-commit hook, pre-push hook,
  or by the project's CI workflow.

A new rule must choose the most specific enforcement mechanism available;
a `[manual]` rule is only acceptable when no script could reliably decide
the question. R2.3 governs this trade-off.

### Plan and task tracking
Project uses `.omo/` directory for plans (`plans/`), task state (`boulders/`), evidence (`evidence/`), decisions (`decisions/`), and notepads (`notepads/`). All agent-executed multi-step work must externalize state into `.omo/` before starting.

#### R1.1) Every non-trivial effort must have a plan `[manual]`
<!-- manual: "non-trivial" is intent-dependent — git cannot distinguish a 1-line fix from structural change without author metadata; needs commit author judgment -->
Any work spanning multiple files, introducing new components, or changing page structure requires a plan document in `.omo/plans/`. Trivial fixes (typos, config tweaks) are exempt.

#### R1.2) Plan/task state must be kept current `[manual]`
<!-- manual: checkbox truth value depends on which commit set its state; git AST shows the byte, not whether the work behind it actually finished -->
Boulder files in `.omo/boulders/` track per-task state. Mark phases `in_progress` before starting, `completed` immediately after verification. Never batch completions.

#### R1.3) Do not leave work untracked `[manual]`
<!-- manual: "untracked work" distinguishes a deliberate scratch note from a forgotten decision; filesystem diff has no metadata about author intent -->
All design decisions, trade-offs, and side-channel investigation results must land in `.omo/notepads/` or `.omo/decisions/`. Uncommitted agent work is invisible to future sessions.

#### R1.4) Boulder / evidence / run-continuation files must stay in sync `[manual]`
<!-- manual: "in sync" requires cross-referencing evidence against what the orchestrator observed; mtime checks can lie when files are staged by tooling -->
Evidence files in `.omo/evidence/` must reflect the current state of their corresponding boulder. When a task is completed, its evidence ledger must be finalized.

#### R1.5) Use dependencies and roll-ups for multi-step work `[manual]`
<!-- manual: task-dependency detection requires reading the prose intent, not file co-occurrence — two tasks touching the same file may run in any order or depend on each other -->
When a boulder depends on another, declare the dependency explicitly. Roll up sub-task boulders into parent boulders on completion. Avoid orphaned sub-tasks.

#### R1.6) Completed and tested task changes must be committed `[manual]`
<!-- manual: "ready-to-commit" requires Definition-of-Done context no script has — diff shows file changes, not whether they passed verification -->
A task is not complete until its changes are committed with a conventional commit message. Staged-but-uncommitted work counts as in-progress.

#### R1.7) Notepad hygiene — 50-entry cap with archive `[manual]`
<!-- manual: no `scripts/` directory exists in this project; archiving is hand-run when needed -->
Notepad files in `.omo/notepads/` should not exceed 50 entries. When they do, archive older entries into a dated subdirectory. This prevents notepad bloat across sessions.

### Rule framework meta-rules

#### R2.1) Rule naming convention `[manual]`
<!-- manual: no automated rule validator script exists; enforcement is by review -->
Rule headings follow `R{top}.{sub}` numbering. The first line after the heading carries a justification HTML comment for `[manual]` rules.

#### R2.2) Rule enforcement state `[manual]`
<!-- manual: enforcement tag validity depends on whether referenced scripts/hooks exist; no automated checker exists -->
Every rule heading must carry exactly one enforcement tag: `[manual]` with a `<!-- manual: ... -->` justification, or `[auto: <mechanism>]` with a real script, hook, or CI step.

#### R2.3) Every rule must be enforced as best as possible `[manual]`
<!-- manual: "best" is context-dependent — a static portfolio site has fewer automation opportunities than a full-stack API; needs operator judgment -->
Prefer `[auto:]` when an automated check exists and runs on commit or in CI. Fall back to `[manual]` only when no script could reliably decide the question. For this project, most `[auto:]` rules became `[manual]` since no `scripts/` infrastructure exists.

#### R2.0) Some rule `[manual]`
<!-- manual: placeholder rule — retained for numbering continuity (R2.3 → R2.4 gap is deliberate for this placeholder) -->
Placeholder for numbering continuity. No operational meaning.

#### R2.4) Rule validation is by review `[manual]`
<!-- manual: no `scripts/check-rules.mjs` exists; rule correctness is verified during PR review -->
There is no single automated rule validator. Rule correctness (naming, enforcement tags, cross-references) is verified by human review during PR.

#### R2.5) Rule numbering is sequential with no gaps `[manual]`
<!-- manual: gap detection requires semantic parsing of AGENTS.md; no automated script exists -->
Rule numbers in each category must be sequential integers starting from 1. Gaps are acceptable only for deliberate placeholders (e.g., R2.0).

#### R2.6) Body prose cross-references must be valid `[manual]`
<!-- manual: cross-reference validation requires understanding which rule IDs refer to which sections; no automated script exists -->
When a rule body references another rule (e.g., "see R4.14"), the referenced rule must exist and be correctly numbered.

#### R2.7) Fast checks (≤5s wall time) run pre-commit; slow checks stay pre-push `[manual]`
<!-- manual: 5s is a heuristic — the "right" budget is host-dependent and an agent making the call must measure on the local host -->
The pre-commit hook (`.pre-commit-config.yaml`) runs only conventional-commit message validation. ESLint, Prettier, and tests run in CI (`.github/workflows/check.yml`). No automated timing enforcement exists.

### Code health

#### R3.1) ESLint + Prettier must pass on every commit `[auto: yarn lint && yarn prettier — CI check.yml]`
Code must pass `yarn lint` (ESLint with next/react-app/prettier/storybook/tailwindcss configs) and `yarn prettier` (format check) on every push and PR via `.github/workflows/check.yml`.

#### R3.2) pre-commit is the hook runner `[manual]`
<!-- manual: hook-runner choice (pre-commit vs husky vs lefthook) has no AST-distinguishable form — only the rendered `.git/hooks/` config reveals which is wired -->
This project uses `pre-commit` (configured in `.pre-commit-config.yaml`) for git hooks. Currently only conventional-commit validation is enforced at commit time.

#### R3.3) Conventional commit messages `[auto: .pre-commit-config.yaml — commit-msg hook]`
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) format. Enforced by `git-conventional-commits` hook in `.pre-commit-config.yaml`.

#### R3.4) Type safety — strict TypeScript, no `any`, prefer `unknown` + Zod `[manual]`
<!-- manual: detecting `any` usage is automatable via `tsc --noEmit` but distinguishing legitimate vs lazy `any` requires code review -->
`tsconfig.json` enables `strict: true` and `noUncheckedIndexedAccess: true`. Avoid `as any` casts. Use `unknown` for untyped inputs and Zod (`zod` package) for runtime validation. `@total-typescript/ts-reset` improves built-in type safety.

#### R3.5) Error type hierarchy is documented `[manual]`
<!-- manual: project uses await-to-js for error handling; custom error classes are minimal — AST can verify class extends Error but cannot infer which exceptions consumers need to distinguish -->
Errors in async code use `await-to-js` (`to()` pattern) for structured error handling. Any custom error classes must extend `Error` and be documented with their intended use case.

#### R3.6) Naming conventions for TypeScript modules `[manual]`
<!-- manual: naming conventions are enforced by ESLint import/order and sort-imports rules; no separate naming script exists -->
Follow ESLint `import/order` rules (external → builtin → internal → sibling → parent → index, alphabetically sorted). Component files use PascalCase, utility modules use kebab-case or camelCase. No Hungarian notation or type prefixes.

### Project architecture

#### R4.1) Post state preservation must be monotonic `[manual]`
<!-- manual: N/A — this project has no post database or sync orchestrator; static content is in `content/` markdown files -->
**N/A.** This rule applies to projects with post databases and merge operations. TomSegbers.de serves static markdown content — there is no mutable post state to preserve.

#### R4.2) All writes must be atomic `[manual]`
<!-- manual: N/A — no server-side write operations exist; content is authored in markdown files committed to git -->
**N/A.** The site has no server-side write operations. Content is edited as static markdown files in `content/` and committed to git. Git itself provides atomicity for file operations.

#### R4.3) Plaintext JSON archive is immutable in shape `[manual]`
<!-- manual: N/A — no JSON archive or database exists; site content is markdown-only -->
**N/A.** No JSON archive or structured data store exists. All content is stored as Markdown/MDX files with frontmatter parsed by `gray-matter`.

#### R4.4) Schema migrations require a pre-migration snapshot `[manual]`
<!-- manual: N/A — no database or schema existed in this project -->
**N/A.** No database, ORM, or data schema exists. Content structure is defined by frontmatter in individual markdown files.

#### R4.5) The `me` cookie is sacred — redact it everywhere `[manual]`
<!-- manual: N/A — no authentication or user cookies exist; site is fully public -->
**N/A.** TomSegbers.de is a fully public static site with no authentication, no user sessions, and no cookies. There is no user-specific state to redact.

#### R4.6) The `me` cookie never leaves the user's machine `[manual]`
<!-- manual: N/A — no cookies or user tracking exist on this site -->
**N/A.** No cookies or tracking mechanisms are used. The site is read-only and does not persist any user data client-side or server-side.

#### R4.7) API error contract is uniform `{error, requestId, issues?}` `[manual]`
<!-- manual: N/A — no custom API endpoints exist; the only server action is the Resend contact form -->
**N/A.** The site has no custom API endpoints. The only server-side action is the contact form, which delegates to `resend` for email delivery.

#### R4.8) Service worker cache must be purged on logout `[manual]`
<!-- manual: N/A — no service worker is registered; site has no authentication or offline mode -->
**N/A.** No service worker exists in this project. There is no offline mode, no authentication, and no client-side caching beyond standard browser HTTP cache.

#### R4.9) Service worker cache-bust via the `pr0-api-v1` suffix `[manual]`
<!-- manual: N/A — no service worker or API versioning exists -->
**N/A.** No service worker or API versioning scheme exists. This rule is specific to pr0gramm-related projects.

#### R4.10) Media files must be tracked by Git LFS `[manual]`
<!-- manual: media files (images) in this project are small and tracked directly in git; LFS overhead is unnecessary for a portfolio site -->
**Not applicable.** Portfolio images are tracked directly in git under `public/`. They are optimized static assets, not large media collections. Git LFS is unnecessary at this scale.

#### R4.11) Recorded pr0gramm fixtures must use placeholder identifiers `[manual]`
<!-- manual: N/A — no pr0gramm fixtures exist in this project -->
**N/A.** This project has no connection to pr0gramm. No fixtures of that nature exist.

#### R4.12) Dev shell is reproducible via Nix flake + direnv `[manual]`
<!-- manual: project has direnv/nix flakes from the Next.js Enterprise boilerplate but these are supplementary; development works without them -->
The project includes a `flake.nix` and `.envrc` from the upstream boilerplate, providing a reproducible dev shell. However, development also works with plain Node.js ≥18.17.0 and Yarn. This rule is aspirational — the Nix shell is not mandatory.

#### R4.13) Dependency management has explicit Nix and pnpm ownership `[manual]`
<!-- manual: this project uses Yarn (not pnpm) with `yarn.lock`; Nix flake exists but is not the primary dependency manager -->
Dependencies are managed via Yarn (`yarn.lock`) with `yarn install --frozen-lockfile`. The Nix flake provides supplementary tooling but is not the primary dependency mechanism. No pnpm is used.

#### R4.14) Module size ceiling `[manual]`
<!-- manual: module size is a design guideline — no automated check script exists; reviews must flag oversized files -->
Individual TypeScript/TSX modules should not exceed 250 lines of logic (excluding JSX markup and imports). Oversized modules signal a need for decomposition. Flagged during code review.

#### R4.15) Module dependency direction is downward only `[manual]`
<!-- manual: import direction enforcement requires architectural tooling not present in this project; reviewed manually -->
Higher-level modules (pages, layouts) may import from lower-level modules (components, lib, utils). Reverse imports are forbidden. The App Router's `app/` directory should not be imported by files in `components/` or `lib/`.

#### R4.16) No circular dependencies `[manual]`
<!-- manual: madge coupling graph (`yarn coupling-graph`) can detect circles but is not automated as a pre-commit check -->
Circular imports are forbidden. Run `yarn coupling-graph` to generate a dependency graph (`graph.svg`) and inspect for cycles. The Next.js bundler will also error on circular `import` chains.

#### R4.17) Public API stability follows semver `[manual]`
<!-- manual: N/A — this project has no published API or npm package; versioning is internal only -->
**N/A.** TomSegbers.de is a deployed website, not a library or API. There is no public API surface to version with semver.

#### R4.18) Deprecation policy `[manual]`
<!-- manual: N/A — no public API surface exists for deprecation management -->
**N/A.** No public API or shared library exists that would require a deprecation policy.

#### R4.19) Archive must be served through a gocryptfs mountpoint at runtime `[manual]`
<!-- manual: superseded historical invariant has no active runtime path to enforce — see Superseded rules table -->
**Superseded.** Listed in the Superseded rules table below. This invariant was for the pr0gramm archive viewer and does not apply to this portfolio site.

#### R4.20) Startup-time mount guard refuses to serve an unencrypted archive `[manual]`
<!-- manual: superseded historical invariant has no active runtime path to enforce — see Superseded rules table -->
**Superseded.** Listed in the Superseded rules table below. No encrypted archive or mount guard exists in this project.

### Process and documentation

#### R5.1) AGENTS.md owns project rules `[manual]`
<!-- manual: whether content is agent instruction, a project rule, or user-facing documentation requires semantic judgment across files -->
AGENTS.md is the authoritative source for all agent-facing rules and conventions. README.md serves user-facing documentation. Rule updates belong here, not in scattered config comments.

#### R5.2) Keep README.md and AGENTS.md current within their scopes `[manual]`
<!-- manual: significance and source ownership require semantic judgment; a static diff cannot decide whether a change affects users, agents, or both -->
When project tooling, architecture, or conventions change, update the relevant document. README.md covers setup, scripts, and user operations. AGENTS.md covers agent rules and enforcement. Do not duplicate content between them.

#### R5.3) Table of Contents must stay current `[manual]`
<!-- manual: project has no `scripts/update-toc.mjs`; ToC updates are manual -->
AGENTS.md and README.md each have a table of contents. When sections are added, removed, or renamed, update the ToC to match. This project has no automated ToC updater.

#### R5.4) CHANGELOG.md is updated on every release-worthy change `[manual]`
<!-- manual: no `scripts/check-changelog.mjs` exists; CHANGELOG updates are manual -->
**N/A.** This project does not currently maintain a CHANGELOG.md. For a personal portfolio site, significant changes are tracked via git history and conventional commits. If a CHANGELOG is introduced, it should follow [Keep a Changelog](https://keepachangelog.com/) conventions.

## Unreleased

### Added

### Fixed

#### R5.5) ADRs record material architectural decisions `[manual]`
<!-- manual: no `scripts/check-adr.mjs` exists; ADR creation is manual -->
Architecture Decision Records live in `docs/adr/`. When a decision affects project structure (e.g., framework choice, data flow pattern, content strategy), document it as an ADR with context, decision, and consequences.

#### R5.6) Public API exports have JSDoc comments `[manual]`
<!-- manual: no `scripts/check-api-docs.mjs` exists; JSDoc coverage is verified during review -->
**N/A.** This project has no public API surface (it's a website, not a library). For shared utility functions in `lib/`, JSDoc is encouraged but not enforced by automation.

#### R5.7) Inline comments explain "why" not "what" `[manual]`
<!-- manual: the why/what distinction requires reading the surrounding code's intent; an AST cannot know whether `// Increment counter` restates the next line or captures a non-obvious invariant -->
Comments should document intent, non-obvious constraints, and design rationale. Avoid restating what the code already expresses. Good: `// Clamp to viewport — Flowbite's Tooltip escapes on narrow screens`. Bad: `// Set max width`.

#### R5.8) Architecture diagrams are kept fresh `[manual]`
<!-- manual: Mermaid `docs/architecture.md` diagrams mirror code, but the mirror quality (accurate vs misleading) requires a human to compare both sides — no renderer does that check -->
If architecture diagrams exist in `docs/`, they must reflect the current code structure. When a refactor changes component layout or data flow, update the corresponding diagram. Stale diagrams are worse than no diagrams.

### Verification gates

#### R6.1) No code change without executable verification `[auto: .github/workflows/check.yml — CI required status checks]`
Every non-trivial code change must be verified through automated tests. The CI workflow (`check.yml`) runs `yarn lint`, `yarn prettier`, `yarn test`, and Storybook smoke tests on every push and PR. Trivial documentation-only changes are exempt.

#### R6.2) Changed behavior must be covered at the correct layer `[manual]`
<!-- manual: layer choice depends on what behavior is observable — a component rendering change may best be caught by Storybook or Jest, while a page-navigation change needs Playwright e2e; needs semantic mapping -->
Match test tool to behavior: Jest + React Testing Library for unit/component logic, Storybook for isolated component rendering, Playwright for full-page e2e and cross-browser behavior. Do not test component internals through Playwright.

#### R6.3) Every bug fix must add a regression check `[manual]`
<!-- manual: no automated regression-detection script exists; test additions are verified during PR review -->
Every bug fix must include at least one test (Jest, Storybook, or Playwright) that fails before the fix and passes after. The test proves the bug existed and prevents regression.

#### R6.4) First-use journey must stay green `[manual]`
<!-- manual: "first-use journey" for a portfolio site is the initial page load + navigation; covered by Playwright smoke tests -->
**Adapted.** For this portfolio site, the critical user journey is: load homepage → navigate to blog → view a post → open contact form. Playwright e2e tests should cover these core paths.

#### R6.5) Runtime smoke must pass on production build `[auto: yarn build — CI check.yml (Storybook smoke)]`
The production build (`yarn build`) must succeed without errors. Storybook smoke tests (`yarn test-storybook`) verify components render correctly after build. The CI workflow enforces both.

### Test design

#### R7.1) Boundary inputs and outputs must be validated `[manual]`
<!-- manual: trust boundary enumeration is architectural — any function reading a file or network input could be a boundary, but only the runtime path proves it; static reachability is over-approximating -->
Functions at trust boundaries (contact form submission, markdown file parsing, API route handlers) must validate their inputs with Zod schemas and return typed outputs. Untrusted data must never bypass validation.

#### R7.2) Logic with meaningful state space must have property tests `[manual]`
<!-- manual: state-space complexity is heuristic — no metric (cyclomatic, branch count) reliably distinguishes "meaningful" from "trivial"; needs domain review -->
Components or utilities with non-trivial state transitions (e.g., form validation logic, markdown frontmatter parsing) benefit from property-based testing. Jest + `fast-check` (in devDeps) can generate inputs to verify invariants.

#### R7.3) Network-dependent UI must be tested with realistic mocked contracts `[manual]`
<!-- manual: this project has minimal network dependencies — the contact form uses Resend; no MSW setup exists -->
**Simplified.** The only network interaction is the contact form's email submission via `resend`. For unit tests, mock the `resend` client. No MSW server setup is configured. If network-dependent features expand, add MSW fixtures.

#### R7.4) Accessibility is part of correctness `[manual]`
<!-- manual: no dedicated a11y CI check exists; accessibility is verified manually via Playwright -->
Components should be accessible by default: semantic HTML, ARIA labels on interactive elements, keyboard navigability, and sufficient color contrast. Use Playwright + `@axe-core/playwright` for automated a11y assertions in e2e tests.

#### R7.5) Mutation testing on safety-critical logic `[manual]`
<!-- manual: "safety-critical" coverage depends on runtime blast radius, not file static call-graph — a module exported widely is not necessarily critical; needs failure-mode review -->
**N/A for this project.** A static portfolio site has no safety-critical server-side logic. If mission-critical features are added (e.g., payment, authentication), mutation testing should be introduced.

#### R7.6) Visual regression testing for UI `[manual]`
<!-- manual: snapshot pixel-diff accepts any intentional redesign and any regression equally — approving snapshots is editorial judgment about intent; no PR-bot can render that verdict -->
Visual regression is useful for catching unintended layout shifts. Playwright screenshots can be compared across commits. However, intentional redesigns require human approval — automated pixel diffs alone are insufficient.

#### R7.7) Load testing for the sync orchestrator `[manual]`
<!-- manual: N/A — this project has no sync orchestrator -->
**N/A.** No sync orchestrator exists. The site serves pre-built static content; there is no data synchronization pipeline.

#### R7.8) Fuzz testing for Zod schemas `[manual]`
<!-- manual: `fast-check` is available in devDeps but no fuzz test suite is configured -->
**Available but not configured.** `fast-check` is in devDeps and can be used with Zod schemas to verify validation robustness. Implement fuzz tests for the contact form schema and any future user-input schemas.

#### R7.9) UI snapshot testing for component regressions `[manual]`
<!-- manual: component snapshots accept intentional redesign and accidental drift equivalently — review-time diff acceptance is design judgment no snapshot test owns -->
Jest snapshot testing (`toMatchSnapshot()`) can catch unintended component output changes. Use sparingly — snapshots are fragile and require deliberate review. Prefer behavioral assertions over snapshot diffs.

#### R7.10) Formal contract testing between client and API `[manual]`
<!-- manual: N/A — this project has no client-server API contract beyond the Resend contact form -->
**N/A.** No API contract exists. The contact form uses Resend's SDK directly. If a custom API is added, introduce contract tests with typed request/response schemas.

### Agent behavior

#### R8.1) Agents may not mark work complete without evidence `[manual]`
<!-- manual: no `scripts/validate-ci.mjs` exists; evidence verification is by review -->
Evidence files in `.omo/evidence/<task-id>.txt` must document what was verified and how. Marking work complete without supporting evidence is forbidden. Verification is manual — no automated evidence validator exists.

#### R8.2) Agents must prefer extending existing verification over creating parallel checks `[manual]`
<!-- manual: extension vs parallel check is a long-term maintainability call — code coverage of `tests/` has no measure of overlap; AST cannot see whether the test misses a fixture -->
When adding verification for changed behavior, extend existing test files rather than creating new ones. Parallel test suites for the same behavior create maintenance burden and split coverage signals.

#### R8.3) The same agent must not be the sole author and sole verifier of risky work `[manual]`
<!-- manual: "risky" thresholds vary per schema-migration vs UI-color-change — git diff size is a poor proxy; only post-commit review against the change's blast radius can verify independence -->
For significant changes (new components, data flow modifications, architectural shifts), a different agent or human reviewer must verify the work. The author cannot be the sole verifier. For trivial fixes (typos, style tweaks), self-review is acceptable.

### CI / release discipline

#### R9.1) Required verification commands must be standardized `[auto: .github/workflows/check.yml — CI required status checks]`
The CI workflow (`check.yml`) enforces `yarn lint`, `yarn prettier`, `yarn test`, and Storybook smoke tests as required verification commands. No additional validation scripts exist — the workflow defines the standard.

#### R9.2) Nightly deep verification must exist `[manual]`
<!-- manual: "deep" is contextual — broader Playwright coverage vs longer property-test runs are both valid; no script picks the right mix for a static portfolio site -->
**N/A for this project.** A static portfolio site does not benefit from nightly verification. Playwright e2e tests run on CI for every push and PR. If the site grows to require scheduled regression testing, a nightly workflow can be introduced.

#### R9.3) Production-critical scripts must be deterministic `[manual]`
<!-- manual: N/A — no production-critical scripts exist; the site is statically generated at build time -->
**N/A.** The site is pre-built as static HTML via `next build`. No production scripts run server-side. Build determinism is ensured by `yarn.lock` and `yarn install --frozen-lockfile`.

#### R9.4) Hotfix process for production breakages `[manual]`
<!-- manual: hotfix for a static site is a redeploy; Vercel handles rollback via deployment history -->
**N/A.** Hotfixes for a static portfolio site consist of fixing the issue in code and redeploying. Vercel's deployment history allows instant rollback to any previous deploy. No formal hotfix branch process is needed.

#### R9.5) Release notes generated from CHANGELOG.md `[manual]`
<!-- manual: CHANGELOG → release-notes mapping is editorial; no CHANGELOG exists — see R5.4 -->
**N/A.** No CHANGELOG.md exists (see R5.4). For a personal portfolio site, git history and conventional commits are sufficient. Release notes are not generated.

#### R9.6) Release rollback procedure is documented `[manual]`
<!-- manual: rollback for static site on Vercel is instant via dashboard; no bespoke procedure needed -->
**N/A.** Deployed on Vercel. Rollback is performed via the Vercel dashboard by selecting any previous deployment. No additional documentation is required.

#### R9.7) Reproducible builds via Nix flake + pnpm-lock `[manual]`
<!-- manual: N/A — this project uses Yarn (yarn.lock), not pnpm; Nix flake exists but is supplementary -->
Build reproducibility is provided by `yarn.lock` and `yarn install --frozen-lockfile`. The Nix flake (`flake.nix`) is supplementary and not required for development or builds. No pnpm is used.

#### R9.8) Build time budgets are tracked `[manual]`
<!-- manual: build-time budget breach is a trend signal — a single PR can vary by cache state; tracking is manual -->
Build times are visible in CI (`check.yml` logs) and Vercel deployment dashboard. No automated budget enforcement exists. The site typically builds in under 90 seconds on CI.

#### R9.9) Release artifacts may be signed `[manual]`
<!-- manual: N/A — no release artifacts exist beyond the Vercel deployment; signing is unnecessary -->
**N/A.** No release artifacts are published. The only "release" is a Vercel deployment, which is triggered automatically on merge to `main`. Artifact signing is not applicable.

### Security & supply chain

#### R10.1) Dependency versions are pinned against footguns `[manual]`
<!-- manual: `yarn.lock` pins versions; no automated version-pinning script exists -->
Dependencies are pinned via `yarn.lock` with exact versions. `yarn install --frozen-lockfile` ensures reproducible installs in CI. Renovate bot configuration may be used for automated dependency updates.

#### R10.2) Vulnerability scanning runs on every CI build `[manual]`
<!-- manual: no `yarn audit` step exists in CI; vulnerability scanning is manual or provided by GitHub's dependency graph -->
GitHub's Dependabot alerts and dependency graph provide vulnerability scanning for this repository. No `yarn audit` step is configured in CI. Critical vulnerabilities should be addressed promptly.

#### R10.3) License compliance for every dependency `[manual]`
<!-- manual: no automated license-check script exists; license review is manual -->
Dependency licenses are managed by the package ecosystem. No automated license compliance check exists in CI. Major license conflicts should be flagged during dependency addition.

#### R10.4) SBOM is generated for each release `[manual]`
<!-- manual: N/A — no formal release process exists for a personal portfolio site -->
**N/A.** Software Bill of Materials generation is not applicable for a personal portfolio site with no formal release pipeline. If the project expands to enterprise use, SBOM generation should be introduced.

#### R10.5) HTTPS-only + security headers `[manual]`
<!-- manual: Vercel provides HTTPS and security headers automatically; no custom header configuration exists -->
Vercel enforces HTTPS by default and provides standard security headers (HSTS, X-Content-Type-Options, etc.). The `next.config.mjs` can be extended with custom headers in the `headers()` function if additional headers are needed.

#### R10.6) Input sanitization at every trust boundary `[manual]`
<!-- manual: the only trust boundary is the contact form; Zod validation is used -->
The only user-facing input is the contact form. Form data is validated with Zod schemas before being sent to `resend`. All markdown content in `content/` is trusted (authored directly). No other trust boundaries exist.

#### R10.7) Rate limiting on API endpoints `[manual]`
<!-- manual: N/A — no custom API endpoints exist; the contact form uses Resend which has its own rate limits -->
**N/A.** No custom API endpoints are exposed. The contact form submission is rate-limited by Resend on their side. If additional API endpoints are added, rate limiting should be configured.

#### R10.8) Secrets are redacted everywhere `[manual]`
<!-- manual: secrets are managed via `.env.local` (gitignored) and Vercel environment variables; no automated redaction script exists -->
Environment variables (Resend API key, etc.) are stored in `.env.local` (excluded from git via `.gitignore`) and Vercel environment variables. Secrets must never be committed. Type-safe access is provided by `@t3-oss/env-nextjs` in `env.mjs`.

### Operational excellence

#### R11.1) Logging standards — levels, correlation, no `console.*` `[manual]`
<!-- manual: N/A — static site has minimal client-side logging; no structured logging infrastructure exists -->
**Adapted for static site.** The site has no server-side logging infrastructure. Client-side logging is minimal. `console.error` is acceptable for development debugging. If structured logging is needed later, use a client-side logger with levels.

#### R11.2) No remote error tracking `[manual]`
<!-- manual: no remote error tracking service is configured; this is intentional for a personal portfolio site -->
**N/A.** No remote error tracking (Sentry, LogRocket, etc.) is configured. This is intentional for a privacy-respecting portfolio site. If monitoring is added, it must respect user privacy.

#### R11.3) Backup & recovery procedure is documented `[manual]`
<!-- manual: N/A — content is in git; no database or user data to back up -->
**N/A.** All content lives in git (`content/` markdown files) and is backed up by the git remote (GitHub). No database, user uploads, or server-side state exists to require additional backup procedures.

#### R11.4) Disaster recovery runbook is current `[manual]`
<!-- manual: N/A — disaster recovery for a static site on Vercel is: push code to GitHub, Vercel redeploys -->
**N/A.** Recovery procedure: clone the repository, run `yarn install && yarn build`, deploy. Vercel automates deployment from the GitHub integration. No runbook is necessary.

#### R11.5) Capacity planning documented for scaling decisions `[manual]`
<!-- manual: N/A — static site served via Vercel's CDN scales automatically; no capacity planning needed -->
**N/A.** As a statically generated site served via Vercel's global CDN, capacity is effectively unlimited for expected traffic. No capacity planning documentation is needed.

### Performance

#### R12.1) Bundle size budgets are measured `[manual]`
<!-- manual: `@next/bundle-analyzer` is configured but no automated budget enforcement exists -->
Bundle sizes can be analyzed via `yarn analyze` (which runs `@next/bundle-analyzer`). No automated budget enforcement exists in CI. Bundle analysis should be reviewed before major releases.

#### R12.2) Core Web Vitals budgets (LCP, CLS, INP) `[manual]`
<!-- manual: CWV thresholds are device-profile-driven; no automated budget enforcement exists -->
Core Web Vitals are monitored via Vercel Analytics (if configured). Target budgets: LCP < 2.5s, CLS < 0.1, INP < 200ms. No automated enforcement exists — budgets are aspirational.

#### R12.3) Service worker cache size limits are explicit `[manual]`
<!-- manual: N/A — no service worker exists in this project -->
**N/A.** No service worker is registered. The site relies on standard browser HTTP caching and Vercel's CDN caching. Cache-Control headers are set by Next.js and Vercel automatically.

#### R12.4) Orchestrator memory limits are bounded `[manual]`
<!-- manual: N/A — no orchestrator or server process exists; site is statically generated -->
**N/A.** No server process runs at runtime. The site is fully statically generated. Build memory is bounded by the CI runner (ubuntu-latest on GitHub Actions).

#### R12.5) Media file size limits enforced on download `[manual]`
<!-- manual: no automated media-size check exists; images are manually optimized -->
Portfolio images in `public/` should be optimized: prefer WebP/AVIF formats, keep images under 500KB where possible, and use Next.js `Image` component for automatic optimization. No automated size enforcement exists.

### Data governance

#### R13.1) PII handling — the `me` cookie and any user identifiers `[manual]`
<!-- manual: N/A — no PII is collected; site has no authentication, no cookies, no user tracking -->
**N/A.** TomSegbers.de collects no personally identifiable information. No authentication, no cookies, no analytics tracking. The contact form uses Resend for email delivery — see Resend's privacy policy for their data handling.

#### R13.2) Data retention policy is documented `[manual]`
<!-- manual: N/A — no user data is stored; the only data is static content in git -->
**N/A.** No user data is stored or retained. Static content (`content/`, `public/`) is tracked in git. There is no data to retain or delete beyond normal git history.

#### R13.3) Right to be forgotten — users can delete backed-up data `[manual]`
<!-- manual: N/A — no user data is collected; contact form submissions go directly to Resend and are transient -->
**N/A.** No user accounts, profiles, or persistent user data exist. Contact form submissions are transient — they are emailed via Resend and not stored in a database. Resend's API does not provide persistent storage.

#### R13.4) GDPR compliance posture is documented `[manual]`
<!-- manual: N/A — no personal data processing occurs on this site beyond the contact form -->
**N/A for formal documentation.** The site processes no personal data beyond the contact form (which the user voluntarily submits). No cookies, no analytics, no tracking. If formal GDPR documentation becomes necessary, a privacy policy should be created.

### Team & process

#### R14.1) Code review requirements `[manual]`
<!-- manual: personal portfolio site — no formal PR review process; self-review is acceptable for all changes -->
**N/A for formal process.** This is a personal portfolio site with a single contributor. No formal code review workflow exists. Self-review before merge is sufficient. Conventional commits are enforced by the pre-commit hook (`.pre-commit-config.yaml`).

#### R14.2) Incident response procedure is documented `[manual]`
<!-- manual: N/A — static portfolio site on Vercel has no operational incidents beyond deployment failures -->
**N/A.** No incident response procedure is needed for a static portfolio site. Deployment failures are visible in Vercel's dashboard and can be rolled back instantly. No SLOs or on-call rotation exist.

#### R14.3) Post-mortem process is blameless and blameless-first `[manual]`
<!-- manual: N/A — no production incidents occur on a static site beyond build/deploy failures; post-mortems are unnecessary -->
**N/A.** No post-mortem process is needed. Build failures are self-evident from CI logs. If the site grows to include user-facing services, a blameless post-mortem template should be introduced.

### User experience & interface

#### R15.1) Keyboard navigability is mandatory `[manual]`
<!-- manual: no dedicated keyboard-nav e2e spec exists; keyboard accessibility is verified manually via Playwright -->
All interactive elements (links, buttons, form controls, dropdown menus) must be reachable and operable via keyboard alone. Flowbite components provide keyboard support by default — verify any custom components also support Tab, Enter, Escape, and arrow key navigation. Playwright e2e tests should include keyboard-only navigation paths.

#### R15.2) WCAG 2.2 Level AA is the minimum target `[manual]`
<!-- manual: no dedicated a11y e2e spec exists; accessibility is aspirational for a personal portfolio site -->
WCAG 2.2 Level AA is the aspirational target. Use semantic HTML, ARIA labels on interactive elements, sufficient color contrast (4.5:1 for text, 3:1 for large text), and `@axe-core/playwright` for automated a11y checks in e2e tests. The site should pass basic accessibility audits.

#### R15.3) Touch targets meet the platform minimum `[manual]`
<!-- manual: 44px hit-area target vs density tradeoff is UX-shaped — a CSS grep finds the size, but `density: high` vs `density: low` pages legitimately need different sizes; needs design review -->
Interactive elements should have touch targets of at least 44×44 CSS pixels (WCAG 2.2 minimum). Flowbite components generally meet this. Manual inspection required for custom components — no automated check exists.

#### R15.4) Focus indicators are visible on every interactive surface `[manual]`
<!-- manual: no `scripts/check-focus-visible.mjs` exists; focus visibility is verified manually -->
All interactive elements must show a visible focus ring when focused via keyboard. Tailwind CSS provides default focus rings via `focus:` variants. Verify no element suppresses focus indicators with `outline-none` without a custom replacement. Manual visual check is sufficient.

#### R15.5) Async-rendered components implement the 4-state pattern `[manual]`
<!-- manual: no automated async-state checker exists; review verifies loading/empty/error/success states -->
Components that fetch or load data asynchronously must handle four states: **loading** (skeleton/spinner), **empty** (no results message), **error** (error message with retry if applicable), and **success** (the data). Blog post lists and contact form submission are the primary async surfaces in this project.

#### R15.6) Destructive actions require explicit confirmation `[manual]`
<!-- manual: no automated destructive-action checker exists; review verifies confirmation patterns -->
Any action that could cause data loss or irreversible state change (e.g., contact form submission with mailto: fallback, clearing form fields) must require explicit user confirmation. For the contact form, the submit button should be disabled during submission to prevent double-submission.

#### R15.7) Animations honor `prefers-reduced-motion` `[manual]`
<!-- manual: no automated motion-reduced checker exists; Tailwind's `motion-reduce:` utilities are verified manually -->
All CSS animations and transitions must respect the user's `prefers-reduced-motion` media query. Tailwind CSS provides `motion-reduce:` and `motion-safe:` variants. Wrap animations in `motion-safe:` to disable them when reduced motion is preferred. Playwright can test with `prefers-reduced-motion: reduce` media override.

#### R15.8) Design tokens are centralized; no hardcoded values in components `[manual]`
<!-- manual: no automated hardcoded-values checker exists; Tailwind's config serves as the token source -->
Use Tailwind CSS design tokens from `tailwind.config.js` for colors, spacing, typography, and breakpoints. Avoid hardcoded pixel values, hex colors, or font sizes in component files. Extend the Tailwind config when new design tokens are needed rather than adding arbitrary values inline.

#### R15.9) Heading hierarchy preserves the document outline `[manual]`
<!-- manual: no automated heading-order checker exists; Axe can flag violations in Playwright tests -->
Headings must follow a logical hierarchy: exactly one `<h1>` per page, followed by `<h2>`, `<h3>`, etc., without skipping levels. This is critical for screen reader navigation and SEO. Use `@axe-core/playwright` to detect heading-order violations in e2e tests.

#### R15.10) Microcopy follows a published style guide `[manual]`
<!-- manual: no microcopy checker exists; microcopy is reviewed manually for consistency -->
Microcopy (button labels, error messages, form hints, empty states) should be consistent in tone and terminology across the site. For this personal portfolio, the "style guide" is the author's own voice — direct, professional, and minimal. No automated enforcement exists.

#### R15.11) No telemetry without explicit opt-in `[manual]`
<!-- manual: no telemetry checker exists; the site intentionally avoids tracking -->
**Actively enforced by architecture.** TomSegbers.de collects no analytics, no cookies, and no user tracking. No telemetry scripts, third-party analytics, or tracking pixels may be added without implementing an explicit opt-in mechanism first. This is a conscious privacy choice for the portfolio site.

#### R15.12) Form validation timing and error display `[manual]`
<!-- manual: no form-validation checker exists; validation behavior is verified manually and via Playwright tests -->
The contact form must validate inputs on blur (not on keypress) and display inline error messages close to the offending field. Errors should be clear, specific, and actionable (e.g., "Email address is missing an @ symbol" not "Invalid input"). Server-side validation must be re-checked after Zod schema parsing before sending via Resend.

#### R15.13) URL design is shareable and deep-linkable `[manual]`
<!-- manual: URL hierarchy is SEO/UX-shaped — `/posts/12345` reads well, but a `/api/v1/posts/12345` vs `/api/v2/posts/12345` versioning decision has no test surface; needs URL review -->
URLs must be human-readable, shareable, and stable. Blog posts use `/blog/[slug]` pattern. No URL should rely on query parameters for primary content identification. URL changes require redirects for existing content. App Router's file-based routing enforces clean URL structure by default.

#### R15.14) Dark mode parity is required for every page `[manual]`
<!-- manual: no dark-mode visual regression test exists; Flowbite provides dark mode support out of the box -->
If dark mode is enabled (via Flowbite's dark mode support or Tailwind's `dark:` variant), every page must render correctly in both light and dark themes. No content should be invisible or unreadable in either mode. Visual verification is manual — no automated dark-mode screenshot comparison exists.

#### R15.15) Image performance and accessibility `[manual]`
<!-- manual: no image-alt checker exists; Next.js Image component provides optimization, alt text is manual -->
All images must use the Next.js `Image` component for automatic optimization (WebP conversion, lazy loading, responsive sizing). Every image must have a meaningful `alt` attribute — decorative images use `alt=""`. Next.js Image catches missing `alt` at build time with `eslint-plugin-jsx-a11y`.

#### R15.16) Design taste and the "would I show this?" gate `[manual]`
<!-- manual: design taste is editorial; the meaningful gate is the designer's judgment, not a script -->
Before committing visual changes, apply the "would I show this to a potential employer/client?" gate. The site represents the author's professional brand. If a UI change feels off, it probably is. No automated design review exists — this is a manual, human judgment call.

### Branch protection and testing quality

#### R16.1) Protected branches require pull requests only `[manual]`
<!-- manual: N/A — personal repository with single contributor has no branch protection rules configured -->
**N/A.** This is a personal repository with a single contributor. No GitHub branch protection rules are configured. Direct pushes to `main` are acceptable. If collaborators are added, branch protection should be enabled.

#### R16.2) Protected branches require specialist approval `[manual]`
<!-- manual: N/A — no CODEOWNERS file exists; single-contributor repo -->
**N/A.** No CODEOWNERS file or required-review settings exist. The single contributor reviews their own changes. No specialist approval gates are needed.

#### R16.3) Merge candidates must be up to date `[manual]`
<!-- manual: N/A — no "Require branches to be up to date" setting is configured -->
**N/A.** No branch-up-to-date enforcement is configured. As a single-contributor repo, merge conflicts are rare and handled manually when they occur.

#### R16.4) Rebase-merge only on protected branches `[manual]`
<!-- manual: N/A — no protected branches or merge-style restrictions are configured -->
**N/A.** No merge-style restrictions exist. The contributor may use any merge strategy. Conventional commits are enforced by the pre-commit hook regardless of merge method.

#### R16.5) Required CI checks are the merge contract `[manual]`
<!-- manual: CI runs on push/PR via `.github/workflows/check.yml` but is not configured as a required status check -->
CI checks (lint, prettier, test, Storybook smoke) run on push and PR via `.github/workflows/check.yml` but are not required status checks on the repository. They serve as informational gates. If branch protection is enabled later, these should be made required.

#### R16.6) Every bug fix must prove the failure existed first `[manual]`
<!-- manual: no automated regression-detection script exists; test additions are verified during review -->
Every bug fix must include at least one test (Jest, Storybook, or Playwright) that fails before the fix and passes after. The test proves the bug existed and prevents regression. Manual verification — no automated enforcement.

#### R16.7) Critical-path suites are first-class `[manual]`
<!-- manual: no `test:critical` script exists; `yarn test` is the canonical test command -->
The canonical test command is `pnpm test` (Jest) and `pnpm e2e:headless` (Playwright). No separate critical-path test suite is defined. For a portfolio site, the critical paths are: homepage renders, blog listing, individual post, contact form submission.

#### R16.8) Tests must be deterministic `[manual]`
<!-- manual: test determinism is enforced by CI environment; no flaky-test detector script exists -->
Tests must produce the same result given the same inputs and state. Jest and Playwright run on CI with consistent environment (`ubuntu-latest`). Non-deterministic tests (timing-dependent, network-dependent, random-value-dependent) must be fixed before merge.

#### R16.9) Flaky tests are release blockers `[manual]`
<!-- manual: no CI retry detector or quarantine list exists; flaky test detection is manual -->
Tests that pass inconsistently (flaky tests) must be investigated and fixed before merging. No automated flaky-test detection exists — the contributor monitors CI runs. Repeated failures signal the need for test quarantine or fix.

#### R16.10) Canonical CI script is mandatory `[manual]`
<!-- manual: CI is defined in `.github/workflows/check.yml`; no `scripts/check-test-ci-script.mjs` exists -->
The canonical CI workflow is `.github/workflows/check.yml`, which runs `pnpm lint`, `pnpm prettier`, `pnpm test`, and Storybook smoke tests. No separate CI-validation script exists. The workflow itself is the canonical definition.

### Contract safety and observability

#### R17.1) Every external integration has an explicit contract owner `[manual]`
<!-- manual: the only external integration is Resend for the contact form; ownership is implicit in the single contributor -->
The sole external integration is the Resend email API used by the contact form. Ownership is implicit — the single contributor owns it. The contract is defined by Resend's SDK (`resend` npm package) and governed by their API terms.

#### R17.2) Contract changes require a schema diff and fixture refresh `[manual]`
<!-- manual: N/A — Resend SDK handles contract; no schema management pipeline exists -->
**N/A.** The Resend integration uses their stable SDK with no custom schema management. Contract changes are handled by dependency version bumps. No schema diff pipeline or fixture manifest exists.

#### R17.3) Unmocked outbound network is forbidden in unit and component tests `[manual]`
<!-- manual: N/A — no test MSW/Vitest infrastructure exists; Resend calls are mocked in tests -->
**N/A.** The project uses Jest (not Vitest) and has no MSW setup. Resend API calls are mocked in unit tests. Outbound network calls in tests are forbidden by convention — not enforced by automation.

#### R17.4) Every integration must have timeout, retry, and malformed-input tests `[manual]`
<!-- manual: Resend contact form has basic error handling; no formal integration test suite exists -->
The contact form uses Zod for input validation and Resend's SDK for delivery. Basic Jest tests cover form validation edge cases. No dedicated integration test suite for timeout/retry/malformed-input scenarios exists.

#### R17.5) Structured logs are mandatory at every critical boundary `[manual]`
<!-- manual: N/A — static site has no structured logging infrastructure; `console.error` is the logging surface -->
**N/A.** No structured logging infrastructure exists. Client-side uses `console.error` for debugging. The contact form action logs errors to the server console during Next.js server action execution. If logging is added, it should respect the no-telemetry policy (R15.11).

#### R17.6) No swallowed errors `[manual]`
<!-- manual: no `scripts/check-no-swallowed-errors.mjs` exists; error handling is verified manually -->
Errors must not be silently caught and discarded. The `await-to-js` pattern (R25.1) makes errors explicit via the `[err, result]` tuple. Empty catch blocks are forbidden by ESLint. Manual review catches swallowed errors.

#### R17.7) Every critical flow has success/failure telemetry `[manual]`
<!-- manual: N/A — the site intentionally has no telemetry (R15.11); critical flow health is judged by manual testing -->
**N/A.** TomSegbers.de does not collect telemetry (see R15.11). Contact form success/failure is communicated to the user via UI feedback. No server-side telemetry pipeline exists.

#### R17.8) Releases require observability hooks before exposure `[manual]`
<!-- manual: N/A — Vercel deploys are atomic; no observability hook infrastructure exists -->
**N/A.** Deployments are triggered via Vercel's GitHub integration. No pre-deploy observability hook exists. Vercel provides deployment health indicators (build logs, deployment status).

#### R17.9) Incidents must produce a durable artifact `[manual]`
<!-- manual: N/A — no incident management process exists for a static portfolio site -->
**N/A.** No incident management process is defined. Build/deploy failures are visible in CI and Vercel logs. No `docs/postmortems/` directory exists. If an incident process is introduced, a durable artifact convention should be established.

### Security and performance

#### R18.1) Secret scanning is mandatory on every push and PR `[manual]`
<!-- manual: no `scripts/check-secret-scanning.mjs` exists; GitHub's push protection and secret scanning are the primary defense -->
Secrets (Resend API key, etc.) are stored in `.env.local` (gitignored) and Vercel environment variables. GitHub's built-in secret scanning with push protection provides automated detection. No custom pre-commit secret scanner exists — the GitHub-native tooling is sufficient for a personal repo.

#### R18.2) Dependency vulnerability scanning is mandatory `[manual]`
<!-- manual: no `scripts/check-version-pinning.mjs` exists; GitHub Dependabot provides automated scanning -->
Dependencies are pinned via `pnpm-lock.yaml`. GitHub's Dependabot alerts and dependency graph provide automated vulnerability scanning. No `pnpm audit` step is configured in CI. Critical vulnerabilities should be addressed promptly.

#### R18.3) Security-sensitive changes require threat-model review `[manual]`
<!-- manual: N/A — static portfolio site has minimal attack surface; no file glob triggers threat-model review -->
**N/A.** A static portfolio site with no authentication, no database, and minimal server-side logic has negligible attack surface. No threat-model review process is configured. If the site adds sensitive features (authentication, payments, user data), threat modeling should be introduced.

#### R18.4) Browser security headers are part of correctness `[manual]`
<!-- manual: Vercel provides standard security headers automatically; no custom header configuration in `next.config.mjs` -->
Vercel enforces HTTPS by default and provides standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options). The `next.config.mjs` can be extended with custom headers via the `headers()` function if additional headers are needed. No automated header check exists.

#### R18.5) Principle of least privilege applies to environment and filesystem access `[manual]`
<!-- manual: N/A — static site has no server-side filesystem access at runtime; build-time access is via dependency install -->
**N/A.** The site is statically generated at build time with no runtime server-side filesystem access. Environment variables are validated by `@t3-oss/env-nextjs`. No least-privilege script or `// why:` comment convention exists.

#### R18.6) Security exceptions expire `[manual]`
<!-- manual: N/A — no `docs/security/exceptions.md` exists; no security exception registry is maintained -->
**N/A.** No security exception registry exists. For a personal portfolio site, security decisions are made at commit time and tracked in git history. If a formal security policy is adopted, an exception registry should be introduced.

#### R18.7) Performance budgets are explicit and versioned `[manual]`
<!-- manual: budget ceilings depend on hosting profile + workload — a static check on `package.json` cannot know whether ubuntu-latest or a low-tier VM hosts CI for this repo; needs profile measurement -->
Bundle sizes can be analyzed via `pnpm analyze` (`@next/bundle-analyzer`). Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms (see R12.2). No automated budget enforcement exists in CI. Performance is aspirational for a portfolio site.

#### R18.8) Performance regressions are tested on representative workloads `[manual]`
<!-- manual: N/A — no `test:perf` script exists; CI runs on `ubuntu-latest` which serves as the representative environment -->
**N/A.** No dedicated performance test suite or nightly CI exists. The CI workflow (`check.yml`) runs on `ubuntu-latest` but does not include performance assertions. If performance-critical features are added, a `test:perf` suite should be introduced.

#### R18.9) New code must not introduce accidental N+1 or quadratic behavior in critical paths `[manual]`
<!-- manual: complexity regression magnitude needs measurement — AST catches nested same-collection loops, but deciding if `O(n²)` is acceptable for n=10 vs catastrophic at n=10k requires workload analysis -->
For a static content site, the critical paths are content parsing at build time and client-side rendering. Avoid nested loops over content arrays in `getStaticProps`/`generateStaticParams`. Manual review is sufficient — no automated asymptotic regression checker exists.

#### R18.10) Performance baselines are committed artifacts `[manual]`
<!-- manual: N/A — no CI artifact upload or baseline diff check is configured -->
**N/A.** No performance baselines are committed as artifacts. Bundle analysis (`pnpm analyze`) results are temporary and not checked into git. If performance budgets become enforceable (see R18.7), baselines should be committed.

### LLM cognition discipline

#### R19.1) No claim without verifiable citation `[manual]`
<!-- manual: no `scripts/check-citations.mjs` exists; citation enforcement is by agent discipline and human review -->
Agent-generated claims about the codebase must be backed by verifiable evidence — either a cited file path and line number, or a tool output. No claim without a citation trail. Verified manually during task review.

#### R19.2) Detect-and-break loop protocol `[manual]`
<!-- manual: no `scripts/check-loop-detect.mjs` exists; loop detection is an agent-internal behavior protocol -->
Agents must self-monitor for repetitive action patterns (re-reading same file, re-running same search, oscillating between two approaches). When detected, the agent must break the loop by changing strategy or escalating. No automated enforcement — this is an agent behavior protocol.

#### R19.3) Task state must be externalized `[manual]`
<!-- manual: no `scripts/check-task-state.mjs` exists; task state externalization is enforced by agent discipline -->
Multi-step agent work must be externalized into `.omo/boulders/` (task state) and `.omo/evidence/` (verification). Agents must not rely solely on in-context memory for tracking progress. Manual verification through `.omo/` directory inspection.

#### R19.4) When the plan is wrong, the plan is changed `[manual]`
<!-- manual: "plan is wrong" requires recognizing mid-execution that the task's ROI dropped — committed-vs-pending commits don't carry execution-cost telemetry; needs task-context review -->
Agents must detect when the current plan is failing or has become invalid and pause to update the plan rather than blindly executing. Plan changes are recorded in `.omo/plans/`. This is an agent judgment call — no automated enforcement.

#### R19.5) Independent verifier must use a different prompt `[manual]`
<!-- manual: no `scripts/check-verifier-independence.mjs` exists; independence is an architectural constraint on agent task design -->
A verification agent must not receive the same prompt as the implementation agent. Different framing, different entry points, different success criteria. This prevents confirmation bias. Enforced by task design patterns — no script validation.

#### R19.6) Prompt versioning `[manual]`
<!-- manual: no `scripts/check-prompt-version.mjs` exists; versioning is a process convention -->
Prompts used for critical agent tasks should be versioned (either in git via `.omo/plans/` or in prompt templates). This enables reproducibility and debugging of agent behavior over time. Manual tracking — no automated enforcement.

#### R19.7) Agent self-monitors context window utilization `[manual]`
<!-- manual: context utilization is an LLM-internal property — input size caps cannot tell which slices the agent actually retrieved for the current task; needs the model's own telemetry -->
Agents should be aware of their context window usage and avoid wasteful consumption (re-reading large files unnecessarily, retaining stale exploration results). No automated monitor exists — this is an agent self-discipline behavior.

#### R19.8) Plan must have a TL;DR `[manual]`
<!-- manual: no `scripts/check-plan-tldr.mjs` exists; plan readability is manual -->
Every `.omo/plans/` document must include a TL;DR section summarizing the goal, approach, and expected outcome in 3-5 lines. This speeds up agent-to-agent handoffs and human review. Manual enforcement.

### Evidence reproduction & verification recovery

#### R20.1) Evidence must be strictly reproducible `[manual]`
<!-- manual: no `scripts/check-evidence-reproducible.mjs` exists; reproducibility is verified by agent discipline -->
Evidence files in `.omo/evidence/` must include the exact commands, inputs, and environment state that produced the claimed result. Another agent or human following the same steps must arrive at the same conclusion. Manual verification — no automated reproducibility checker exists.

#### R20.2) Verification failure triggers a triage tree `[manual]`
<!-- manual: triage tree branch selection depends on live evidence — flaky test vs regression vs misrun each have different evidence fingerprints only a running agent can categorize -->
When verification fails, the agent must classify the failure (flaky test, genuine regression, environmental misconfig, or stale evidence) and follow the corresponding resolution branch. Document the triage decision in `.omo/evidence/<task-id>.txt`.

#### R20.3) Evidence has a freshness timestamp `[manual]`
<!-- manual: no `scripts/check-evidence-fresh.mjs` exists; freshness is tracked manually in evidence files -->
Every evidence file in `.omo/evidence/` must include a timestamp indicating when the evidence was collected. Stale evidence (older than the task's start time) must be re-collected or marked as stale. Manual tracking.

#### R20.4) Stale evidence is auto-archived `[manual]`
<!-- manual: no `scripts/archive-stale-evidence.mjs` exists; archiving is manual -->
Evidence files that are no longer relevant (task completed, task cancelled, evidence superseded by newer runs) should be moved to `.omo/archive/` to keep the evidence directory lean. Manual archival — no cron job runs.

### Multi-agent coordination

#### R21.1) File lock registry `[manual]`
<!-- manual: no `scripts/check-file-locks.mjs` exists; file lock coordination is agent-internal -->
When multiple agents may modify the same file, agent tasks must declare file ownership in `.omo/boulders/` before starting work. No automated file-lock enforcement exists — coordination is by agent discipline and task planning.

#### R21.2) Handoff packet protocol `[manual]`
<!-- manual: handoff packet prose quality (clarity, completeness, actionability) carries intent the field schema cannot — a required-fields lint ensures structure, not whether the receiver can act on it -->
When an agent hands off work to another agent, the handoff must include: current state, completed steps, pending steps, known blockers, and evidence references. Format is free-text in `.omo/notepads/` — no structured schema exists.

#### R21.3) Conflict resolution protocol `[manual]`
<!-- manual: conflict resolution verdict (which agent's design wins) requires weighing tradeoffs hidden in prose — `.omo/decisions/<date>.md` records the verdict, but the verdict itself is judgment-based -->
When two agents produce conflicting designs or implementations, the conflict must be resolved by recording a decision in `.omo/decisions/` with rationale. The decision supersedes both original proposals. Manual judgment call.

#### R21.4) Quorum for high-impact changes `[manual]`
<!-- manual: no `scripts/check-quorum.mjs` exists; quorum is a process convention -->
For changes affecting architecture, security, or data flow, at least two agents (or the human contributor) must approve before implementation proceeds. No automated quorum checker exists — convention only.

#### R21.5) Task dedup `[manual]`
<!-- manual: no `scripts/check-task-dedup.mjs` exists; dedup is managed through `.omo/boulders/` inspection -->
Before creating a new boulder or plan, agents must check `.omo/boulders/` and `.omo/plans/` for existing work on the same goal. Duplicate task creation wastes resources. Manual inspection — no automated dedup checker.

### Resource economics — tracking only

#### R22.1) Token usage is reported in evidence `[manual]`
<!-- manual: no `scripts/check-token-report.mjs` exists; token reporting is done in evidence files -->
Each evidence file in `.omo/evidence/` should include a token usage summary for the task that produced it. This enables trend analysis across sessions. Manual tracking — no automated pipeline.

## Resource usage

#### R22.2) Model selection is documented `[manual]`
<!-- manual: no `scripts/check-model-rationale.mjs` exists; model selection is documented in plan files -->
When an agent selects a specific model for a task, the rationale (cost, speed, capability match, context window) should be documented in the corresponding plan or evidence file. Manual documentation.

#### R22.3) Resource trends are queryable `[manual]`
<!-- manual: resource-report dashboard layout (which columns, what sort, what aggregation) is editorial — the underlying `.omo/evidence/*/` is portable; the table view is not -->
Token usage and model costs across sessions are recorded in `.omo/evidence/` files. Trends can be manually queried by aggregating these files. No dashboard or automated aggregation exists.

### Domain correctness

#### R23.1) Time and timezone correctness `[manual]`
<!-- manual: no `scripts/check-timezone.mjs` exists; timezone correctness is verified manually -->
Blog post dates and any displayed timestamps must handle timezones correctly. Prefer UTC for storage and format for display using the user's or site's locale. CI runs with `TZ=UTC`. No automated timezone check exists.

#### R23.2) Encoding and Unicode correctness `[manual]`
<!-- manual: no `scripts/check-encoding.mjs` exists; encoding is handled by the toolchain -->
All source files and content files must be UTF-8 encoded. Next.js, TypeScript, and the markdown parser handle encoding correctly by default. No automated encoding check exists — toolchain convention is sufficient.

#### R23.3) Cryptographic code uses libraries, never invents `[manual]`
<!-- manual: AST cannot tell whether `subtle.encrypt` is "library use" vs re-implementing AES by hand in helper modules; needs security review -->
**N/A for this project.** The site has no cryptographic code. If authentication or encryption features are added, they must use established libraries (e.g., `bcrypt`, `jose`, Web Crypto API) and never custom implementations. Manual security review.

#### R23.4) File path safety `[manual]`
<!-- manual: no `scripts/check-path-safety.mjs` exists; path safety is enforced by Next.js conventions -->
File paths in content loading (markdown files in `content/`) must not allow directory traversal. Next.js `fs` operations are server-side only and the `content/` path is hardcoded. No automated path-safety check exists.

#### R23.5) Regular expression safety `[manual]`
<!-- manual: no `scripts/check-regex-safety.mjs` exists; regex is verified manually -->
Regular expressions (e.g., in form validation, slug parsing) must avoid catastrophic backtracking (ReDoS). Use simple, bounded patterns. No automated regex safety check exists — manual review is sufficient for the project's limited regex surface.

#### R23.6) Numeric precision `[manual]`
<!-- manual: no `scripts/check-numeric.mjs` exists; numeric precision is not a concern for this project -->
**N/A for this project.** The site performs no financial calculations, scientific computation, or high-precision arithmetic. Standard JavaScript `Number` (IEEE 754) is sufficient for display purposes. If precision-sensitive features are added, use appropriate types.

### Browser-side hydration verification

#### R24.1) Production build must include a Playwright e2e test for every public route `[manual]`
<!-- manual: no `scripts/check-e2e-coverage.mjs` exists; e2e coverage is aspirational -->
**Aspirational.** Every public route (homepage, `/blog`, `/blog/[slug]`, `/contact`) should have at least one Playwright e2e test verifying the page renders and is interactive post-hydration. Current e2e coverage is minimal (`e2e/example.spec.ts`). Expand as the site grows.

#### R24.2) e2e tests must assert post-hydration DOM, not just server-rendered DOM `[manual]`
<!-- manual: no `scripts/check-hydration-aware.mjs` exists; hydration verification is manual -->
Playwright e2e tests must wait for hydration to complete before asserting DOM state. Use `page.waitForSelector()` or `page.waitForFunction()` to confirm client-side interactivity, not just server-rendered HTML. This is critical for App Router pages with client components.

#### R25.1) Async error handling MUST use await-to-js `[manual]`
<!-- manual: no `scripts/check-await-to.mjs` exists; await-to-js usage is enforced by code review and convention -->
The project uses `await-to-js` (the `to()` pattern) for structured async error handling. All async functions that can fail must return `[error, result]` tuples rather than throwing. This pattern is established in the codebase (see README.md examples) but has no automated enforcement script. Manual review ensures compliance.

#### R26.1) Git hook bypass is forbidden `[manual]`
<!-- manual: bypass-attempt attribution is forensic — script can flag `--no-verify` or `SKIP` in env, but distinguishing legitimate CI tooling from policy violation requires commit-trailer audit -->
Pre-commit hooks (`.pre-commit-config.yaml` for conventional-commit validation) must not be bypassed with `--no-verify` or `SKIP=...` unless in a CI pipeline with explicit justification. The pre-commit hook is the sole automated gate at commit time. No bypass-detection script exists — policy is enforced by convention.

#### R26.2) Testing gates are absolute and non-skippable `[manual]`
<!-- manual: skip-intent vs flake-investigation requires case review — script greps `.skip(` in non-quarantine paths, but distinguishing intentional `it.skip` (e.g. known OS-specific) from policy violation needs PR context -->
CI checks (lint, prettier, test, Storybook smoke) must pass before merge. Tests must not be skipped with `.skip()` unless there is a documented, time-boxed reason (e.g., known upstream bug with tracking issue). No automated skip-detection script exists — manual review handles exceptions.

### Meaningful Names
Names are the most powerful communication tool in code. Every name should answer the reader's questions: why does this exist, what does it do, and how is it used.

#### R27.1) Use intention-revealing names `[manual]`
<!-- manual: name intent is a semantic property — AST cannot tell whether `ctx` reveals purpose vs being an arbitrary abbreviation; needs PR review -->
Names should tell why something exists, what it does, and how it is used. If a name requires a comment to explain it, the name is not revealing its intent. Prefer `elapsedTimeInDays` over `d`, `gameBoard` over `theList`. A good name answers questions without forcing the reader to trace logic.

#### R27.2) Use pronounceable and searchable names `[manual]`
<!-- manual: no `scripts/check-clean-code-ch2.mjs` exists in this project; pronounceable/searchable name judgement requires language comprehension -->
Names should be easy to say out loud and easy to grep for. If you cannot pronounce a name during discussion, it is a poor name. Single-letter names and numeric constants are not searchable — prefer descriptive names that can be found with `grep` or IDE search. Avoid abbreviations unless they are universally understood in the domain.

#### R27.3) Avoid encodings and member prefixes `[manual]`
<!-- manual: prefix vs compound-word distinction is linguistic — AST cannot reliably tell `m_name` (m-prefix) from `mname`/`manage` (compound); needs reviewer -->
Do not encode type or scope information in names. No Hungarian notation (`strName`, `iCount`), no member prefixes (`m_name`, `_private`), no interface prefixes (`IShape`). Modern IDEs and TypeScript's type system make such encodings redundant. Names should be clean of embedded metadata.

#### R27.4) Don't pun (avoid using the same word for two different purposes) `[manual]`
<!-- manual: puns are semantic collisions across files — no AST span reaches the cross-module "same identifier, different meaning" comparison; needs review -->
Avoid using the same word for two different ideas. If `add` means arithmetic addition in one place and list insertion in another, pick different verbs. Consistent naming across the codebase reduces cognitive load. Use one word per concept — `fetch`, `get`, `retrieve`, and `load` should not all mean the same operation.

#### R27.5) Avoid generic context or arbitrary placeholders `[manual]`
<!-- manual: no `scripts/check-clean-code-ch2.mjs` exists in this project; placeholder detection requires semantic analysis of intent -->
Shun names like `data`, `info`, `item`, `obj`, `result`, `temp`, `manager`, `processor`, `handler`. These are too generic to communicate intent. If a variable holds user account information, name it `userAccount` or `account`, not `data`. Placeholder names signal that the author did not understand the domain well enough to name precisely.

#### R27.6) Use solution domain and problem domain names `[manual]`
<!-- manual: solution vs problem domain needs domain expertise — AST cannot tell if `Sync` is CS terminology or project-specific domain terminology; needs reviewer -->
Your code has readers who are programmers (solution domain) and readers who understand the business (problem domain). Use computer science terms (`queue`, `stack`, `factory`) when the concept fits — other programmers will understand them. Use problem domain names (`customer`, `invoice`, `portfolio`) when describing business logic. The key is choosing the name that the most readers will understand.

### Functions
Functions are the first line of organization in any program. Writing them well is the essence of writing good code.

#### R28.1) Functions must be small `[manual]`
<!-- manual: no `scripts/check-clean-code-ch3.mjs` exists in this project; function-size judgement requires qualitative review of cohesion and responsibility -->
Functions should be small — rarely more than 20 lines long. Each function should tell a story in a few lines, with each line at a consistent level of abstraction. The blocks within `if` statements, `else` statements, `while` statements, and so on should be one line long — probably a function call. This keeps the enclosing function small and adds documentary value.

#### R28.2) Functions must do one thing `[manual]`
<!-- manual: "one thing" is a semantic property — AST line counts miss functions that are short but mix abstraction levels (e.g. parse + persist + log) -->
A function does one thing when it cannot be meaningfully divided into sections. If a function contains steps that are one level of abstraction below its name, then it does one thing. To verify: try to extract another function with a name that is not merely a restatement of its implementation — if you can, the original function does more than one thing.

#### R28.3) One level of abstraction per function `[manual]`
<!-- manual: abstraction levels are semantic — AST cannot tell that `fs.writeFileSync` is lower-level than `persistUser` even when both appear in one body -->
All statements within a function should operate at the same level of abstraction. Mixing high-level business logic (`processOrder`) with low-level implementation details (`fs.writeFileSync`) creates confusion. The Stepdown Rule: code should read like a top-down narrative — every function followed by those at the next level of abstraction.

#### R28.4) Function parameter count limits `[manual]`
<!-- manual: no `scripts/check-clean-code-ch3.mjs` exists in this project; parameter-count judgement requires evaluating whether parameters form a coherent concept that could be a struct/object -->
The ideal number of arguments is zero (niladic). Next comes one (monadic), followed closely by two (dyadic). Three arguments (triadic) should be avoided where possible. More than three requires very special justification. When a function needs many arguments, consider whether they form a coherent concept that can be wrapped in an object or a dedicated parameter type.

#### R28.5) No side effects `[manual]`
<!-- manual: side-effect classification needs runtime observation — AST cannot tell if an FS write is the function's purpose (atomic dump) or hidden (logging) -->
Functions should either do something (command) or answer something (query), not both. Side effects — unexpected changes to state outside the function's scope — make code unpredictable and hard to test. If a function must have side effects, the name should clearly advertise this (e.g., `saveAndNotifyUser`).

#### R28.6) Command-Query Separation (CQS) `[manual]`
<!-- manual: command vs query is semantic — AST cannot tell that `getCachedPosts()` also refreshes the SW cache on miss; needs intent review -->
A function that returns a value should not have observable side effects. A function that has observable side effects should not return a value. This principle makes it possible to reason about state changes safely. If a "getter" also mutates state, it violates CQS and should be renamed to reflect its true nature (e.g., `fetchAndCachePosts`).

### Comments
The proper use of comments is to compensate for our failure to express ourselves in code. Comments are always failures. We must have them because we cannot always figure out how to express ourselves without them, but their use is not a cause for celebration.

#### R29.1) Comments do not make up for bad code `[manual]`
<!-- manual: "bad code" needs qualitative review — AST cannot tell whether complexity deserves refactor vs a comment fix; needs PR judgment -->
Clear and expressive code with few comments is far superior to cluttered and complex code with lots of comments. Rather than spend time writing comments that explain the mess, spend time cleaning the mess. Comments are a last resort — use them only when code cannot be made clearer.

#### R29.2) Code should explain itself `[manual]`
<!-- manual: self-documenting is subjective — AST cannot measure whether process reads as obvious to a new contributor; needs review -->
The code itself should be the primary source of documentation. Well-named functions, variables, and classes remove the need for most comments. Before adding a comment, ask: can I rename something or extract a function to make the intent obvious? If a comment is still needed, it should document something the code cannot say.

#### R29.3) Delete commented out code `[manual]`
<!-- manual: no `scripts/check-clean-code-ch4.mjs` exists; dead code detection is manual review -->
Commented-out code is clutter. It creates doubt: is it needed? When will it be un-commented? What version of the code does it represent? Version control remembers every line ever written — delete dead code without fear. If a piece of code was valuable enough to comment out, it is valuable enough to find in git history.

#### R29.4) Do not write redundant comments `[manual]`
<!-- manual: redundancy depends on reader expertise — AST cannot know if a CS-trained dev sees i++ as obvious or needs explanation; needs review -->
A comment that restates what the code already says is noise. `// Increment counter` on the line `count++` adds zero value. Comments should add information — intent, constraints, rationale, or non-obvious consequences. Less is more with comments.

#### R29.5) Explain the "why" and not the "what" `[manual]`
<!-- manual: what vs why is semantic — AST cannot tell if a comment repeats the code, restates intent, or documents a non-obvious constraint; needs review -->
Good comments document intent, non-obvious constraints, and design rationale. Avoid restating what the code already expresses. Good: `// Clamp to viewport — Flowbite's Tooltip escapes on narrow screens`. Bad: `// Set max width`. The "what" is visible in the code; the "why" is what the reader needs.

### Formatting
Formatting is about communication. The reader of your code should be able to focus on what the code does, not on deciphering its layout. Good formatting is invisible — bad formatting screams for attention.

#### R30.1) Vertical Density and Separation `[manual]`
<!-- manual: requires visual and structural aesthetic judgment on blank line placement and spacing -->
Each blank line is a visual cue that a new and separate concept follows. Related lines should appear vertically dense; unrelated concepts should be separated by blank lines. Methods within a class should be separated by blank lines. Declarations should be close to their first use. Instance variables should be declared at the top of the class or module.

#### R30.2) Dependent Functions Nearby `[manual]`
<!-- manual: ordering functions by caller-callee sequence is structural and logical, requiring semantic call graph context -->
If one function calls another, they should be vertically close, and the caller should be above the callee whenever possible. This creates a natural flow — like reading a newspaper article, where the most important concepts come first and details follow. Readers should not have to jump around the file to follow the narrative.

#### R30.3) Maximum Line Length (Horizontal Formatting) `[manual]`
<!-- manual: no `scripts/check-clean-code-ch5.mjs` exists; Prettier enforces line-length conventions automatically for this project -->
Lines should not exceed 120 characters. Shorter lines are easier to scan, easier to diff, and fit better in split views. Prettier (configured in this project) enforces a sensible line-length limit automatically. If you find your lines consistently too long, it usually signals that your code is too deeply nested or too complex — refactor into smaller pieces.

#### R30.4) Horizontal Alignment Avoidance `[manual]`
<!-- manual: formatting and horizontal spacing style is enforced statically by Prettier; manual inspection verifies we do not align variable definitions or assignments into tables -->
Do not align variable declarations or assignments into columns with extra spaces. Alignment creates maintenance burden — adding a longer name forces realignment of every line in the block. Prettier strips such alignment automatically. Let the formatter decide horizontal whitespace.

#### R30.5) Team Consistency `[manual]`
<!-- manual: requires human consensus and check against overall repository aesthetics and linters -->
A team of developers should agree upon a single formatting style, and every member should use it. Consistency reduces cognitive friction when switching between files written by different authors. For this project, Prettier and ESLint define the canonical formatting style. Do not fight the formatter — if a rule produces output you dislike, discuss changing the rule, not circumventing it.

### Objects and Data Structures
Objects hide their data behind abstractions and expose functions that operate on that data. Data structures expose their data and have no meaningful functions. Understanding this distinction is fundamental to good design.

#### R31.1) Data Abstraction `[manual]`
<!-- manual: abstraction quality is semantic — AST cannot tell whether getters/setters expose behavior or just wrap raw fields; needs domain review -->
Objects should not simply expose their internal data through getters and setters — they should expose abstract interfaces that allow their users to manipulate the essence of the data without knowing its implementation. Prefer telling an object to do something rather than asking it for its internals.

#### R31.2) Law of Demeter `[manual]`
<!-- manual: fluent chains are syntactic only — AST cannot tell if z.string().parse() returns a new context or navigates internals; needs call-graph review -->
A method should only call methods of objects that are directly held, created, or passed as arguments. Avoid "train wrecks" like `a.getB().getC().doSomething()`. This rule is about internal structure — fluent interfaces and method chaining that return the same type do not violate it.

#### R31.3) Avoid Hybrids `[manual]`
<!-- manual: business vs helper logic is semantic — AST cannot tell if toJSON is pure data or contains validation/transformation; needs reviewer -->
Avoid structures that are half object and half data structure. A class that exposes public fields while also having significant behavior confuses both paradigms. Choose one: either a proper object with hidden data and exposed operations, or a plain data structure with no logic.

#### R31.4) Data Transfer Objects are Pure Data `[manual]`
<!-- manual: DTO purity is intent, not syntax — AST cannot tell if a plain object is a passive data carrier or has implicit invariants; needs review -->
DTOs should be simple data carriers with no behavior. In TypeScript, this means plain interfaces or type aliases with no methods. Use Zod schemas for validation at the boundary, but keep the DTO itself free of logic. This keeps serialization, transmission, and deserialization straightforward.

### Error Handling
Error handling deserves its own section because it is easy to get wrong, and when wrong, it obscures logic. This project uses `await-to-js` (see R25.1 and README) for structured async error handling with `[error, result]` tuples, which is TypeScript's idiomatic alternative to exceptions for async code. The rules below are Clean Code principles adapted to TypeScript's conventions.

#### R32.1) Use Exceptions Rather Than Return Codes `[manual]`
<!-- manual: return-shape intent is semantic — AST cannot tell if a tuple/Result is a domain pattern or a leftover status code; needs call-site review -->
Prefer throwing exceptions over returning error codes for synchronous code — exceptions keep error handling separate from happy-path logic. For async code, this project uses `await-to-js` (`to()`) which returns `[error, result]` tuples rather than throwing. This is TypeScript's idiomatic approach: the tuple pattern makes error handling explicit and impossible to ignore. The principle is the same — separate error handling from business logic — but the mechanism differs. See README.md for `await-to-js` examples.

#### R32.2) Use Unchecked Exceptions `[manual]`
<!-- manual: checked-exception simulation is intent-only — TS lacks checked throws, so AST cannot detect wrapped custom Result/Try types; needs review -->
TypeScript has no checked exceptions. All thrown values are unchecked by the compiler. This is consistent with Clean Code's recommendation: checked exceptions can violate the Open/Closed Principle when changes in a method's signature force changes in many callers. Let errors propagate naturally; handle them at the appropriate level. For async code, the `await-to-js` tuple pattern makes error propagation explicit without checked-exception overhead.

#### R32.3) Don't Return Null `[manual]`
<!-- manual: no `scripts/check-clean-code-ch7.mjs` exists; null detection requires type-flow analysis beyond simple grep -->
Avoid returning `null` from functions. Returning `null` forces every caller to perform null checks, spreading defensive code throughout the system. Instead, return an empty array (`[]`), a special-case object (Null Object pattern), or throw an exception. TypeScript's `strictNullChecks` helps, but discipline is still required. If `null` is unavoidable, make it explicit in the return type — never return `null` from a function typed as returning a non-null value.

#### R32.4) Don't Pass Null `[manual]`
<!-- manual: no `scripts/check-clean-code-ch7.mjs` exists; null passing detection requires call-site flow analysis -->
Avoid passing `null` as an argument. A function that accepts `null` must check it, adding noise to every implementation. If a parameter is optional, use TypeScript's optional parameter syntax (`param?`) or provide a sensible default. If `null` must be accepted, document it explicitly in the function's JSDoc and make the type `T | null`, never `T` with a hidden null possibility.

### Boundaries
Third-party code has broad applicability, but your system has specific needs. Clean boundaries keep foreign concepts from polluting your domain logic and make dependencies easier to swap.

#### R33.1) Wrap third-party APIs `[manual]`
<!-- manual: wrapper sufficiency depends on architectural intent; AST sees call layers but cannot tell whether third-party concepts still leak through the domain interface -->
Wrap third-party libraries behind your own interfaces. This gives you control over the API surface your application sees, makes testing easier (mock your wrapper, not the library), and isolates your code from breaking changes in dependencies. For this project, the Resend email API is wrapped in a server action, and Flowbite components are used through a consistent component layer.

#### R33.2) Write learning tests `[manual]`
<!-- manual: a learning test is defined by authorial purpose; AST cannot distinguish documenting an unknown library behavior from ordinary integration coverage -->
When adopting a new third-party library, write tests that explore and document its behavior. These "learning tests" verify your understanding of the API, serve as documentation for future readers, and alert you when a dependency upgrade changes behavior. Jest and Playwright are the primary test runners for this purpose.

#### R33.3) Avoid external APIs in UI pages `[manual]`
<!-- manual: no `scripts/check-clean-code-ch8.mjs` exists; external API boundaries in UI components are verified during PR review -->
UI components and pages should not call third-party APIs directly. Route API calls through dedicated service modules or server actions. This keeps components focused on presentation and makes API contracts explicit. In this project, the contact form uses a server action (`app/actions/`) rather than calling Resend directly from the component.

### Unit Tests
Tests are as important as production code. They enable change, document behavior, and prevent regression. This project uses Jest for unit/component tests and Playwright for end-to-end tests (see README.md).

#### R34.1) Three Laws of TDD `[manual]`
<!-- manual: TDD ordering is a process property; git history shows commit order but cannot prove whether a test failed before the production change was authored -->
First Law: You may not write production code until you have written a failing unit test. Second Law: You may not write more of a unit test than is sufficient to fail, and not compiling is failing. Third Law: You may not write more production code than is sufficient to pass the currently failing test. These laws produce a rhythm: test → code → refactor, repeated in cycles of seconds or minutes.

#### R34.2) Keep Tests Clean `[manual]`
<!-- manual: test cleanliness is a readability judgment; AST metrics cannot decide whether setup, names, and assertions communicate behavior clearly -->
Test code is just as important as production code. Tests must be maintained, read, and changed — dirty tests slow everyone down. Keep test code as clean as production code: meaningful names, small functions, one assertion per test where practical. The readability of a test is what makes it maintainable.

#### R34.3) Domain-Specific Testing Language `[manual]`
<!-- manual: testing-language quality depends on domain vocabulary; AST can find helpers and builders but cannot decide whether they express scenarios better than raw APIs -->
Build a testing API that speaks the language of your domain, not the language of your testing framework. Create helper functions and builders that let tests read like specifications: `createUser().withEmail('test@example.com').withRole('admin').build()`. This hides implementation detail and lets tests focus on behavior.

#### R34.4) One Concept per Test `[manual]`
<!-- manual: no `scripts/check-clean-code-ch9.mjs` exists; concept-per-test judgement requires understanding test intent -->
Each test should verify a single concept. A test that says "test all the things" is hard to debug when it fails — which thing broke? Single-concept tests are also better documentation: the test name tells you exactly what behavior is being verified.

#### R34.5) FIRST Principles of Clean Tests `[manual]`
<!-- manual: no `scripts/check-clean-code-ch9.mjs` exists; FIRST is a design principle applied during test authoring, not an automatable property -->
Tests should be **F**ast (run quickly, or they won't be run), **I**ndependent (no test depends on another), **R**epeatable (same result every run in any environment), **S**elf-Validating (pass/fail output, no manual interpretation), and **T**imely (written just before the production code that makes them pass).

#### R34.6) Assertions and No Logic Blocks `[manual]`
<!-- manual: no `scripts/check-clean-code-ch9.mjs` exists; logic-in-test detection requires semantic analysis of control flow -->
Tests should contain assertions with minimal logic. Avoid `if`, `for`, `while`, or `switch` statements in tests — each branch is an untested branch of your test logic. If a test needs conditional logic, split it into separate tests. A test should be a simple sequence: setup → act → assert.

### Classes
In TypeScript/React projects, classes are less common than in traditional OOP languages — most logic lives in functions, hooks, and components. However, when classes are used (e.g., for service objects, error types, or data models), these principles still apply.

#### R35.1) Classes Should Be Small `[manual]`
<!-- manual: no `scripts/check-clean-code-ch10.mjs` exists; class-size judgement requires qualitative review of responsibility -->
A class should be small enough to describe in a few words without using "and" or "or". The name describes its responsibilities — if naming requires compound terms, the class likely does too much. Measure size by responsibilities, not lines of code.

#### R35.2) Single Responsibility Principle (SRP) `[manual]`
<!-- manual: a reason to change comes from business ownership and future policy; AST can count dependencies but cannot infer which changes belong to one responsibility -->
A class or module should have one, and only one, reason to change. This principle is about people — a class should be responsible to one, and only one, actor (a person or group who would request changes). When a class has multiple responsibilities, changes for one actor may inadvertently affect another.

#### R35.3) High Cohesion `[manual]`
<!-- manual: cohesion depends on shared purpose, not reference counts; AST cannot tell whether methods touching the same fields implement one concept or unrelated workflows -->
Classes should have high cohesion — methods and variables should be co-dependent and hang together as a logical whole. A class where each method uses all instance variables is maximally cohesive. Low cohesion signals that the class should be split into smaller, focused units.

#### R35.4) Organize for Change (Open-Closed Principle) `[manual]`
<!-- manual: open/closed fitness depends on expected extension paths; AST can identify inheritance or composition but cannot predict which future variants should avoid modification -->
Classes should be open for extension but closed for modification. Design modules that never change — when new requirements arrive, extend behavior by adding new code, not by changing existing code. In TypeScript/React, this often means using composition, dependency injection, and configurable components rather than inheritance.

### Systems
Complexity in software systems is managed through separation of concerns and appropriate abstractions. These principles apply at the architectural level.

#### R36.1) Separate Construction from Use `[manual]`
<!-- manual: construction/use separation is architectural context; AST sees `new` calls but cannot decide whether lazy creation is wiring or legitimate runtime behavior -->
Construction is a very different process from use. A system's construction should be separated from its use so that the application's runtime behavior is not entangled with its setup. This separation is the motivation behind dependency injection frameworks and factory patterns. In Next.js, construction often happens in `generateStaticParams`, page-level `getData` functions, or React hooks — keep it separate from rendering logic.

#### R36.2) Dependency Injection (DI) `[manual]`
<!-- manual: dependency ownership is semantic; AST can flag constructors but cannot tell whether a created value is an internal detail or an externally owned collaborator -->
Rather than having modules create their own dependencies, pass them in from outside. This makes testing trivial (inject mocks), enables swapping implementations, and makes dependency graphs explicit. In React/Next.js, this takes the form of passing props, using Context providers, and injecting service functions rather than importing and calling global singletons.

#### R36.3) Scaling Up and Cross-Cutting Concerns `[manual]`
<!-- manual: concern scattering depends on domain boundaries; AST can count logging or auth calls but cannot decide whether each occurrence belongs in core logic or shared middleware -->
Cross-cutting concerns — logging, authentication, error tracking, caching — should be handled in one place, not scattered throughout the codebase. Next.js provides `middleware.ts`, layouts, and server actions as natural injection points for these concerns. Keep domain logic free of cross-cutting noise.

### Emergent Design
A design is "emergent" when it arises from following simple rules rather than being pre-planned in full detail. Kent Beck's Four Rules of Simple Design guide this process.

#### R37.1) Simple Design Rule 1: Runs All Tests `[manual]`
<!-- manual: suite completeness depends on required behaviors and risk; coverage tools show executed lines but cannot identify missing scenarios or prove test-first intent -->
A system that cannot be verified cannot be deployed. The first rule of simple design is that the system must pass all its tests. This requires the system to be testable — tightly coupled, opaque systems resist testing. Making a system testable pushes the design toward small, focused classes and functions, which is the first step toward simplicity.

#### R37.2) Simple Design Rule 2: No Duplication `[manual]`
<!-- manual: no `scripts/check-clean-code-ch12.mjs` exists; duplication detection requires semantic analysis beyond simple code clone detection -->
Duplication is the primary enemy of a well-designed system. It represents waste — extra work, extra risk, and extra complexity. The DRY (Don't Repeat Yourself) principle applies not just to code but to concepts: if the same idea appears in two places, it should be unified into a single abstraction. Duplication in tests and configuration is also harmful.

#### R37.3) Simple Design Rule 3: Expresses Intent `[manual]`
<!-- manual: expressed intent depends on reader and domain meaning; AST can measure names and function size but cannot determine whether structure communicates purpose -->
Code that clearly expresses the programmer's intent is easier to understand and cheaper to maintain. Well-chosen names, small functions, and consistent patterns all contribute to expressiveness. A system that passes tests and has no duplication but is incomprehensible has failed the third rule of simple design.

#### R37.4) Simple Design Rule 4: Minimize Classes and Methods `[manual]`
<!-- manual: minimum class/method count is a context-dependent trade-off; static thresholds cannot tell whether removing an abstraction would harm testability or clarity -->
After satisfying the first three rules, strive to minimize the number of classes and methods. Every abstraction has a cost — don't create one unless it simplifies the design overall. Avoid speculative generality: don't build for a future you cannot see.

### Concurrency
Concurrency is about decoupling what gets done from when it gets done. This section is adapted from Clean Code with the note that TomSegbers.de is a static portfolio site with minimal runtime concurrency concerns. These principles are aspirational and serve as guidance if the site grows to include concurrent or server-side operations.

#### R38.1) Separate Concurrency Code `[manual]`
<!-- manual: concurrency boundaries depend on architectural roles; AST can find async calls but cannot tell whether scheduling concerns are mixed with business decisions -->
Keep concurrency-related code separate from business logic. Concurrent code has its own challenges — synchronization, locking, scheduling — and these should not be mixed with domain logic. In Next.js, server components and server actions run in isolated request contexts, which naturally separates concurrent execution. For client-side code, React's concurrent features (Suspense, transitions) provide structured concurrency.

#### R38.2) Limit Access to Shared Data `[manual]`
<!-- manual: race safety depends on interleavings and aliasing; AST cannot prove that every read-modify-write path shares the correct lock across async boundaries -->
Avoid shared mutable state. In React applications, state is typically local to components or managed through context — this naturally limits shared data access. If shared state is needed (e.g., a global cache), use appropriate synchronization primitives or design for immutable updates. For this static site, there is no shared mutable server state — content is pre-built at compile time.

#### R38.3) Use Copies of Data `[manual]`
<!-- manual: defensive copies depend on shared-mutation intent; AST can spot spread/clone but cannot tell whether the caller expected a copy or a live view of mutable state -->
When data must be shared, pass copies rather than references to mutable data. In JavaScript/TypeScript, this means using spread operators (`...`), `structuredClone`, or immutable data patterns. React's unidirectional data flow and immutable state updates (via `setState`) naturally align with this principle.

#### R38.4) Keep Concurrent Execution Models in Mind `[manual]`
<!-- manual: concurrency-pattern fit depends on workload and ownership; AST sees queues and locks but cannot decide whether the chosen model matches the runtime's contention profile -->
Understand your execution model. Node.js is single-threaded with an event loop — true parallelism comes from worker threads or multiple processes. Next.js handles concurrent requests via its built-in request isolation. For this project's scale, the default Next.js concurrency model is sufficient. If the site adds real-time features or background processing, consider worker threads or a job queue.

### Successive Refinement
Writing clean code is not a one-shot process — it emerges through successive refinement. Start with something that works, then refine it into something that is clean.

#### R39.1) Write clean code through successive refinement `[manual]`
<!-- manual: successive refinement is a temporal process; only the committed result is visible, not the messy intermediate states or the polish decisions between them -->
Clean code is not written in a single pass. First make it work — write code that passes the tests. Then make it right — refactor, rename, extract, and polish until the code reads clearly and expresses its intent. The first draft is rarely the final draft. This is especially true in a static portfolio site where content, design, and code evolve iteratively.

#### R39.2) The Boy Scout Rule: leave campgrounds cleaner `[manual]`
<!-- manual: neighborhood improvement is contextual; AST cannot tell whether nearby cleanups were deliberate or accidental within the same edit, or whether they are sufficient -->
Always leave the codebase a little better than you found it. When you touch a file, clean up one small thing: rename a confusing variable, extract a long function, add a missing test, or fix a comment. The cumulative effect of many small improvements keeps the codebase healthy without requiring a "big rewrite" that never happens.

#### R39.3) Do not tolerate broken windows `[manual]`
<!-- manual: "broken window" classification depends on tolerance context; AST can flag lint issues but cannot tell when a minor compromise will invite more drift versus staying harmless -->
A single instance of bad code or poor design is a "broken window" — it signals that no one cares, inviting more neglect. Fix broken windows when you see them. ESLint, Prettier, and TypeScript's strict mode catch many broken windows automatically in this project. Don't bypass them — each bypassed check is a broken window.

#### R39.4) Refactor in incremental steps `[manual]`
<!-- manual: refactor granularity depends on squash strategy and force-pushed history; AST sees the final diff but cannot distinguish atomic test-verified steps from one big rewrite -->
Refactor in small, test-verified steps. Each step should be a single, reversible change that keeps the tests green. Large refactors that touch dozens of files at once are risky — small steps let you verify correctness at every stage. Commit after each successful step so you can bisect if something breaks.

#### R39.5) Do not mix logic changes with refactoring `[manual]`
<!-- manual: no `scripts/check-clean-code-ch14.mjs` exists; separating logic changes from refactoring requires intent analysis, not structural diff comparison -->
When refactoring, change only the structure, not the behavior. When adding features, change only the behavior, not the structure. Mixing both in a single commit makes it impossible to tell whether a bug came from the refactoring or the feature change. Use separate commits — refactor first, then add the feature, or vice versa — so each commit's intent is clear.

### Smells and Heuristics
These are common code smells and design heuristics from Clean Code. They serve as warning signs — when you see them, investigate. Not every instance is a defect, but every instance deserves scrutiny.

#### R40.1) No Magic Numbers `[manual]`
<!-- manual: no `scripts/check-clean-code-ch17.mjs` exists; magic-number detection requires semantic interpretation of what constitutes a "well-known" constant -->
Avoid raw numeric or string literals in code. Replace them with named constants that reveal their meaning. `const SECONDS_PER_HOUR = 3600` is clear; `const timeout = 3600` is not. Exceptions: well-known values like `0`, `1`, `-1`, `Math.PI`, and obvious loop constants (`i = 0`) do not need names. Prefer `const STATUS_OK = 200` over inline `200` where the meaning is not obvious from context.

#### R40.2) No Negative Conditionals `[manual]`
<!-- manual: no `scripts/check-clean-code-ch17.mjs` exists; negativity perception is a human-factors property — some `if (!ready)` forms are more idiomatic than `if (notReady)` -->
Avoid negative conditional expressions when a positive form is clearer. Prefer `if (isEmpty)` over `if (!hasItems)`, and `if (isDisabled)` over `if (!isEnabled)`. Negations add one mental flip — double negations add two. Keep conditional logic as straightforward as possible.

#### R40.3) No Double Negatives `[manual]`
<!-- manual: double negation depends on identifier meaning; AST can detect `!` chains but cannot read which boolean concept the underlying name expresses -->
Double negatives are confusing. `if (!isNotReady)` forces the reader to mentally flip twice. Name booleans positively so the code reads naturally: `if (isReady)` instead of `if (!isNotReady)`. If you find yourself writing `!isNot*` or `!no*`, rename the boolean.

#### R40.4) Keep Abstractions Correct `[manual]`
<!-- manual: abstraction correctness depends on intended separation of layers; AST sees method bodies but cannot decide whether a low-level detail belongs at this concept level -->
Every abstraction has a level. A function at the "business logic" level should not contain implementation details like raw DOM manipulation or filesystem calls. Lower-level details belong in lower-level functions. When a function mixes levels, extract the lower-level parts so the abstraction stays coherent. This is the Stepdown Rule applied consistently.

#### R40.5) Keep Public API Minimal `[manual]`
<!-- manual: minimum surface depends on consumer roles; AST can list exports but cannot tell which are required for tests, plugins, or downstream packages versus internal-only -->
A module should expose only what its consumers need. Every public export is a commitment — changing it may break callers. Prefer keeping functions and types module-private until a clear consumer requires them. In TypeScript, avoid `export *` barrels; prefer explicit named exports so the contract is visible and deliberate.

#### R40.6) Prefer Polymorphism to If/Else or Switch `[manual]`
<!-- manual: polymorphism payoff depends on expected variant growth; AST can count dispatch sites but cannot tell whether a new branch is one-off or part of a growing matrix -->
When the same conditional chain appears in multiple places (e.g., `switch` on a type discriminator in three different functions), consider replacing it with polymorphism. In TypeScript/React, this often means: a discriminated union with a component per variant, or a strategy pattern with a lookup map. A single `if/else` chain is fine — duplication and growth are the triggers for extraction.

## Superseded rules

The following rule IDs remain in the Project rules section for audit
trail and R2.5 numbering continuity, but their operational invariants
no longer apply under the public-access architecture. Full decision
record: [ADR-0007](docs/adr/0007-public-access-refactor.md).

| Rule | Former concern | Disposition |
| --- | --- | --- |
| R4.4 | Server-side schema migrations require `data/.pre-migrate/<ts>/` snapshot | **Superseded by ADR-0007** — no server-owned archive migration path |
| R4.19 | Archive served only via gocryptfs mount at `data/` | **Superseded by ADR-0007** — user-picked folder / OPFS archive |
| R4.20 | Startup mount guard (`runStartupMountGuard`, exit 78) | **Superseded by ADR-0007** — no server encrypted-mount boot gate |

Related: ADR-0002 / ADR-0003 are marked Superseded by ADR-0007 in a later
docs task (T41). Browser-side archive detail: ADR-0008 (T40).
