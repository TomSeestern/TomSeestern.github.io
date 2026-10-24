# Release Remediation — cf82454 audit

> **Path note.** The Ultrawork contract defaults to `.omo/plans/<slug>.md`. Plan
> mode restricts writes to `/home/tom/.opencode/plan`, so this file lives here.
> Copy it to `.omo/plans/release-audit-remediation.md` after switching agents,
> before handing it to an executor.

## Aim

Close both release blockers and all ten technical conditions from the
`cf82454` audit, plus the content and SEO defects in scope, so that `main` can
be certified as release-ready. Exit criterion: a green `check.yml` on `main`
gates the GitHub mirror, the contact form can no longer report success for a
message Resend rejected, and no page publishes an unfilled legal fact.

## Non-goals

- Rewriting the legal substance. The plan supplies structure, validation and
  disclosure of the *actual* data flow; whether an Impressum is required for a
  private individual, which supervisory authority applies, and whether a home
  address may be published are the owner's and a lawyer's calls.
- Verifying published claims (€300k grants, 100k+ users, three German airports).
  Only the owner can attest these. They stay unverified by this plan and must
  not be presented as audited.
- Replacing the illustrative testimonials with real quotes. T15 removes them
  from the page; sourcing real ones is not automatable.
- Migrating off `resend@2`, adding MSW, visual regression baselines, Git LFS,
  or re-running the content-audit rule design.
- Reformatting Markdown/JSON/YAML with Prettier. It would rewrite the corpus in
  one unreviewable diff; T18 corrects the rules doc instead.
- `checkJs` across `scripts/`. It would surface a large, unrelated error set.

## Files to touch

**Application**
- `lib/sendEmail.tsx`, `lib/sendEmail.test.tsx`
- `lib/legal-facts.ts` (new), `lib/legal-facts.test.ts` (new)
- `lib/sitemap.ts` (new), `lib/sitemap.test.ts` (new), `app/sitemap.ts`
- `lib/tags.ts`
- `app/impressum/page.tsx`, `app/datenschutz/page.tsx`
- `app/page.tsx`, `app/about/page.tsx`, `app/blog/page.tsx`,
  `app/projects/page.tsx`, `app/tags/page.tsx`
- `app/about/page.test.tsx`, `app/impressum/page.test.tsx` (new),
  `app/datenschutz/page.test.tsx` (new)
- `app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`
- `app/tags/[tag]/page.tsx`
- `components/Testimonials/Testimonials.tsx` (+ its story, delete if orphaned)
- `content/projects/2024-layzr-creator-avatar-platform-acquired-by-jodel.md`

**Configuration and CI**
- `playwright.config.ts`, `e2e/metadata.spec.ts`, `e2e/static-routes.spec.ts`,
  `e2e/fixtures/expectations.ts`
- `.forgejo/workflows/check.yml`, `playwright.yml`, `screenshots.yml`
- `.forgejo/workflows/mirror-main.yml` (delete)
- `jest.config.js`, `.eslintrc.js`, `package.json`
- `.lighthouserc.js`, `.gitignore`

**Documentation**
- `README.md`, `AGENTS.md`
- `docs/adr/0002-github-main-mirror.md`, `docs/adr/0003-deploy-gated-on-check.md` (new)
- `docs/security/audit-exceptions.md` (only if T10 finds an unfixable advisory)

## Assumptions

1. The Forgejo `linux` runner is online. It mirrors `main` today, so gating the
   mirror adds latency but no new availability dependency.
2. Vercel's production branch is GitHub `main`. ADR-0002 calls this
   unverifiable from the checkout; the 2026-10-24 ship settled it — Vercel
   created Production deployment `7299820871` for `68d2a437a80f`, the SHA the
   mirror pushed (see Results).
3. `E2E_CONTACT_FORM_SUCCESS` is **not** set in Vercel Production. T4 makes the
   answer irrelevant, but if it *is* set today, every enquiry since then was
   silently discarded — check the Vercel dashboard before announcing the fix.
4. `resend@2.1.0` stays pinned. T1 fixes the call site, not the SDK.
5. Content edits are welcome; the audit's "content & legal" angle owns them.

## Tasks

### T0 — Capture a pre-change baseline
- **What:** Record the current state of every gate so a later regression is
  attributable to a task rather than to the environment.
- **How:** Create `.omo/evidence/release-remediation-baseline.txt` containing
  `git rev-parse HEAD`, then the exit code and last 5 lines of:
  `nix develop -c pnpm typecheck`, `lint`, `prettier`, `content:audit`,
  `contrast`, `design-tokens`, `images`, `fonts`, `test`, and
  `nix develop -c pnpm exec playwright test --project=chromium --workers=1`.
  Note the test counts (46 suites / 288 tests; 100 e2e) and the build page
  count (173). Do not "fix" anything while capturing.
  **Amendment (execution):** `fonts` reads the *built* CSS, so it fails with
  "Geist interface face is not present in the built CSS" when `.next` holds
  dev-server output. Run `nix develop -c pnpm build` **before** the `fonts`
  gate (and before `images`, which also reads build output), and record the
  page count from that build. This is a latent gate-ordering defect in
  `check.yml` too: there, `Build` runs before `Font budget gate`, so CI is
  correct — only a local run without a build is misled.
- **Verify:** `test -s .omo/evidence/release-remediation-baseline.txt` and the
  file contains the string `288 passed` (Jest's summary wording — `288 tests`
  never appears in its output) and a 40-character SHA.
- **Status:** done
- **Proof:** `.omo/evidence/release-remediation-baseline.txt` written — gates all
  exit 0 after a build, `288 passed`, e2e `100 passed (2.0m)`, HEAD
  `cf82454fb4f683e17ac6f0cb712e804ec4e4dbac`.

### T1 — Fix the Resend error channel (BLOCKER B1)
- **What:** `lib/sendEmail.tsx` must treat a resolved provider error as failure.
  Today `const [error] = await to(resend.emails.send(...))` only observes
  rejections; `resend@2.1.0` resolves `{data, error}` instead, so every 403,
  422, 429 and 5xx falls through to `return { success: true }` and the visitor
  is told the mail was sent.
- **How:** Destructure both halves and require positive proof of acceptance:
  ```ts
  const [thrown, response] = await to(resend.emails.send(emailData))
  const providerError = thrown ?? response?.error
  if (providerError || !response?.data?.id) {
    console.error(providerError ?? "Resend returned no message id")
    return { success: false, errors: { _form: "Failed to send email. Please try again or contact me directly." } }
  }
  return { success: true }
  ```
  Keep the user-facing string byte-identical — `app/contact/ContactForm.tsx`
  and the e2e copy fixture are keyed to it.
  In `lib/sendEmail.test.tsx`:
  - change the success mock at `:49` from `{ id: "email-id" }` to the real shape
    `{ data: { id: "email-id" }, error: null }`;
  - add `it("returns a form error when Resend resolves an API error")` mocking
    `{ data: null, error: { name: "validation_error", message: "from domain not verified" } }`;
  - add `it("returns a form error when Resend resolves without a message id")`
    mocking `{ data: {}, error: null }`;
  - leave the `mockRejectedValue` case in place (network failures still reject).
- **Verify:** `nix develop -c pnpm exec jest lib/sendEmail.test.tsx --verbose`
  exits 0 with 3 new/changed cases green. **Regression proof (R6.3):** `git stash`
  the `lib/sendEmail.tsx` hunk only, re-run the new "resolves an API error"
  case, confirm it **fails** with `success: true`, then unstash. Record both
  outcomes in the evidence file.
- **Status:** done
- **Proof:** `pnpm exec jest lib/sendEmail.test.tsx --verbose` → 13 passed,
  including "resolves an API error" and "without a message id". Regression proof:
  with `lib/sendEmail.tsx` stashed the new case reported `1 failed`.

### T2 — Bound the contact input
- **What:** `name` and `message` are `z.string().min(1)` with no ceiling, and
  `name` is interpolated into the Subject header.
- **How:** In `lib/sendEmail.tsx`: `.max(100)` on `name`, `.max(5000)` on
  `message`, and `.refine((v) => !/[\r\n]/.test(v), "…")` on `name`. Add tests
  for a 101-character name and for `"Tom\r\nBcc: x@example.com"`; both must
  return `success: false` with a `name` field error and must not call the SDK.
- **Verify:** `nix develop -c pnpm exec jest lib/sendEmail.test.tsx` green; a
  new case asserts `expect(mockSend).not.toHaveBeenCalled()`.
- **Status:** done
- **Proof:** 16 passed; the three new cases each assert
  `expect(mockSend).not.toHaveBeenCalled()`; `pnpm typecheck` exit 0.

### T3 — Add the legal-facts module (BLOCKER B2, part 1) `(P)`
- **What:** A single typed, validated source for the eight legal facts that
  currently occupy 16 placeholder slots. Deliberately **not imported by any
  page yet**, so `main` stays buildable and deployable while the owner supplies
  the values.
- **How:** Create `lib/legal-facts.ts`:
  - `legalFactsSchema` (Zod): `name`, `street`, `postalCode`, `city`, `country`,
    `email` (`.email()`), `phone`, `mstvResponsible` (object with the same
    address fields plus `name`), `supervisoryAuthority`, `mailboxHost`,
    `retentionPeriod` as `.min(1)`; `vatId` as `.optional()` because § 27a UStG
    applies only where one exists.
  - `export const legalFactsSource: Record<string, unknown>` — a literal whose
    string fields are `""` (including the nested `mstvResponsible` object), with
    a comment stating that empty values are intentional until the owner fills
    them. Typed as `unknown` input on purpose: the empty literal must not satisfy
    `LegalFacts`, or the type system would hide the gap the runtime check
    exists to catch.
  - `export class LegalFactsError extends Error` carrying `missing: string[]`.
  - `export function readLegalFacts(): LegalFacts` — `safeParse`, then throw
    `LegalFactsError` listing every failing path. Throwing from a page's render
    is what makes `next build` fail.
  - Add `lib/legal-facts.test.ts`: empty source throws and names `name`;
    a complete fixture parses; `vatId` may be omitted.
- **Verify:** `nix develop -c pnpm exec jest lib/legal-facts.test.ts` green **and**
  `nix develop -c pnpm build` still exits 0 (proves nothing imports it yet).
  **Amendment:** `readLegalFacts` takes an optional `source` argument
  (`readLegalFacts(source: unknown = legalFactsSource)`) so the happy path is
  testable without mutating module state. The no-arg call still throws on the
  shipped empty source.
- **Status:** done
- **Proof:** `pnpm exec jest lib/legal-facts.test.ts` → 5 passed; `pnpm build`
  exit 0, 173 pages.

### T4 — Guard the E2E bypass against production
- **What:** `E2E_CONTACT_FORM_SUCCESS === "true"` currently short-circuits the
  action *and* skips the rate limit, with no production guard. One stray Vercel
  env var turns the form into a silent no-op that reports success.
- **How:** In `lib/sendEmail.tsx` compute once:
  `const e2eBypass = env.E2E_CONTACT_FORM_SUCCESS === "true" && process.env.VERCEL_ENV !== "production"`
  and use it at both `:97` (rate-limit skip) and `:106` (short-circuit).
  **Use `VERCEL_ENV`, not `NODE_ENV`** — T6 runs e2e against `next start`, which
  sets `NODE_ENV=production`; a `NODE_ENV` guard would disable the bypass the
  suite depends on. Record that reason in a code comment.
  Test: set `process.env.VERCEL_ENV = "production"`, `mockEnv.E2E_CONTACT_FORM_SUCCESS = "true"`,
  `RESEND_API_KEY = undefined`; expect `{ success: false, errors: { _form: "Email service is not configured." } }`.
  Restore/delete `VERCEL_ENV` in `afterEach`.
- **Verify:** jest green; the new case fails if the `VERCEL_ENV` clause is removed.
- **Status:** done
- **Proof:** 17 passed. Removing `&& process.env.VERCEL_ENV !== "production"`
  makes "ignores the E2E shortcut in a production deployment" report `1 failed`;
  clause restored.

### T5 — Disclose IP processing in the Datenschutz
- **What:** The action rate-limits on the first hop of `x-forwarded-for`, so the
  site itself processes the visitor's IP. The notice lists only name, email and
  message — a gap that survives filling the TODOs.
- **How:** In `app/datenschutz/page.tsx`, inside the
  `datenschutz-kontaktformular` section, add a paragraph: the IP address is
  processed in shortened form for 15 minutes in server memory only, to limit
  submissions to 5 per window; it is not written to disk, not joined with the
  message, and not shared with third parties; legal basis Art. 6(1)(f) DSGVO.
  Insert before the `Speicherdauer` line so it reads in the existing order.
- **Verify:** `grep -c "Ratenbegrenzung" app/datenschutz/page.tsx` returns at
  least 1, and `grep -c "15 Minuten" app/datenschutz/page.tsx` at least 1
  (neither string exists today, so the check can actually fail);
  `nix develop -c pnpm build` exits 0;
  `nix develop -c pnpm exec playwright test e2e/a11y.spec.ts --project=chromium`
  still passes for `/datenschutz`.
- **Status:** done
- **Proof:** `grep -c` → `Ratenbegrenzung=1`, `15 Minuten=1`; `pnpm build` exit 0
  (173 pages); `playwright test e2e/a11y.spec.ts` → 12 passed, `/datenschutz` included.

### T6 — Run e2e against the production build
- **What:** `playwright.config.ts:72` boots `next dev`, so the suite has never
  exercised the artifact that deploys. It also declares Firefox and WebKit,
  which no workflow invokes.
- **How:** In `playwright.config.ts`:
  - delete the `firefox` and `webkit` projects (decision: chromium only);
  - `const isCI = !!process.env.CI`;
  - `webServer.command`: `isCI ? "pnpm build && pnpm exec next start --port 3030" : "pnpm exec next dev --port 3030"`;
  - `webServer.timeout: 240_000`, `reuseExistingServer: !isCI`;
  - update the stale comment above `webServer`.
- **Verify:** `CI=1 nix develop -c pnpm exec playwright test --project=chromium --workers=1`
  exits 0 with `100 passed`, and the run log contains **no** `Compiling /` lines
  (only `next dev` emits those) while containing `▲ Next.js 15.5.24`.
  Because `CI=1` sets `reuseExistingServer: false`, kill any leftover server on
  port 3030 first (`ss -ltnp | grep 3030`) — otherwise the run fails on a bind
  error and looks like a regression.
- **Status:** done
- **Proof:** `CI=1 … playwright test --project=chromium --workers=1` → `100 passed`;
  `DEBUG=pw:webserver` shows `Creating an optimized production build`,
  `▲ Next.js 15.5.24`, `Ready in 256ms`; `Compiling /` count 0.

### T7 — Gate the deploy on CI
- **What:** `check.yml` and `mirror-main.yml` are independent `push` triggers, so
  production is served minutes before the first gate can object. `screenshots.yml`
  additionally pushes `[skip ci]` commits straight to `main`.
- **How:**
  1. In `check.yml`: add `timeout-minutes: 35` to the job; add a
     `Run end-to-end tests` step (`nix develop -c pnpm exec playwright test --project=chromium`)
     after `Unit & Integration tests`; append a final step
     `Mirror main to GitHub` with `if: github.ref == 'refs/heads/main' && success()`,
     containing the three steps currently in `mirror-main.yml` (key setup, push,
     `git ls-remote` assertion). Keep `permissions: contents: read`.
     **Add a tip guard before the push** — the concurrency group runs
     `cancel-in-progress: false`, so a slower earlier run can still be executing
     when a newer one finishes; without this guard the older run force-pushes
     GitHub `main` backwards:
     ```bash
     tip=$(git ls-remote origin refs/heads/main | cut -f1)
     if [ "$tip" != "$(git rev-parse HEAD)" ]; then
       echo "Not the tip of main ($tip); skipping mirror."; exit 0
     fi
     ```
  2. Delete `.forgejo/workflows/mirror-main.yml`.
  3. In `screenshots.yml`: remove the entire `push:` trigger block, keep
     `workflow_dispatch:` only, and change the commit message to
     `chore(docs): update feature screenshots` (drop `[skip ci]`, since the
     bot no longer pushes on its own).
  4. Write `docs/adr/0003-deploy-gated-on-check.md` recording: context (deploy
     could outrun CI), decision (mirror is the last step of Check), consequences
     (push latency + full-gate cost on every deploy; a red gate now blocks
     deploys, which is the point), and rollback (restore the standalone workflow).
     Add a one-line "Superseded in part by ADR-0003" note to ADR-0002's status.
- **Verify:** every workflow parses —
  `for f in .forgejo/workflows/*.yml; do python3 -c "import yaml,sys; yaml.safe_load(open('$f'))" || exit 1; done`;
  `test ! -f .forgejo/workflows/mirror-main.yml`;
  `grep -rn 'workflow_run\|needs:' .forgejo/workflows/ | wc -l` returns 0
  (use `-rn … | wc -l`, not `grep -c` over a glob, which prints per-file counts
  and exits 1 when a file has no match);
  `grep -n "if: github.ref == 'refs/heads/main' && success()" .forgejo/workflows/check.yml` matches;
  `grep -n 'Not the tip of main' .forgejo/workflows/check.yml` matches.
  Post-merge observation: push a commit that fails `pnpm test` on a scratch
  branch and confirm GitHub `main` does not move.
  **Amendment:** PyYAML is not installed on this host, so the parse check uses
  the `yaml@2.9.0` copy already in the pnpm store:
  `node -e "require('./node_modules/.pnpm/yaml@2.9.0/node_modules/yaml').parse(...)"`.
  The post-merge observation was performed on 2026-10-24 and is recorded in the
  Proof below.
- **Status:** done
- **Proof:** all five workflows parse (`jobs=check|screenshots|…`);
  `mirror-main.yml` absent; `grep -rn 'workflow_run\|needs:'` → 0; guard at
  `check.yml:79`; tip guard at `check.yml:98`; `timeout-minutes: 35` at `:26`;
  screenshots commit message no longer carries `[skip ci]`.
  **Amendment (found on the first real push, not in review):** two defects only a
  live run could expose. (1) The mirror step inherited `check.yml`'s shallow
  checkout, so `git push` sent the tip commit without its parent and GitHub
  rejected the pack with `remote: fatal: did not receive expected object
  b4f668a…` / `remote unpack failed: index-pack failed`. The step now runs
  `git fetch --unshallow origin` before pushing, but only when the repository is
  shallow, so ordinary runs keep the fast clone. The deleted `mirror-main.yml`
  had `fetch-depth: 0` on its own checkout, which is why the extraction lost the
  requirement. (2) The runner's `playwright install chromium` was SIGTERM'd eight
  seconds into the 191 MB download. The cause is not established from the logs:
  `earlyoom` never fired (memory stayed 78–85 % available) and no firewall denial
  was recorded, so the attribution was left open rather than guessed. A retry
  completed the download, `chromium-1248` is now in
  `/var/lib/forgejo-runner-cache/xdg/ms-playwright`, and the step has been green
  since. Worth recording because the first red `Check` looked like a code
  regression and was not: every gate including 308 unit tests had passed.
  **Operational note:** superseded runs left in `waiting` hold the shared
  `ci-${{ github.ref }}` group; cancelling them through the API
  (`POST …/actions/runs/{id}/cancel` → 204) released the queue, though the
  cancelled job's process kept running in its runner for a while.

  **Post-merge observation — performed on the real push, 2026-10-24.** Two red
  `Check` runs (`b4f668a`, `aa5b9f6`) left the GitHub mirror at `cf82454`; the
  first green run (`68d2a43`) advanced it to `68d2a437a80f`, and Vercel turned
  that into Production deployment `7299820871` at 14:20:25Z. The negative path
  is therefore proven with real failures rather than a synthetic one: no red run
  moved the mirror.

### T8 — Make the coverage threshold real
- **What:** `jest.config.js:16-23` declares an 80 % global floor that can never
  fire — no `--coverage` is ever passed.
- **How:** Measure first:
  `nix develop -c pnpm exec jest --coverage --coverageReporters=text-summary`.
  Add `collectCoverageFrom: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "!**/*.stories.tsx", "!**/*.test.{ts,tsx}", "!**/page.tsx"]`
  (page components are covered behaviourally by Playwright) and set each
  `coverageThreshold.global` value to the measured percentage rounded **down**
  to the nearest integer. Add `--coverage` to the `test` script so CI enforces it.
- **Verify:** `nix develop -c pnpm test` exits 0 and prints a coverage summary
  table with non-zero `% Stmts`. Deliberately deleting one covered test file
  makes the run exit non-zero — confirm once, then restore.
  **Amendment:** proved failure by temporarily raising `statements` to 99 rather
  than deleting a test file. Deleting a covered test mutates the suite and can
  cascade into unrelated failures; raising the floor above the measured value
  exercises exactly the same code path (Jest consults the threshold and fails).
  Measured with `collectCoverageFrom` applied: 89.87 / 87.85 / 93.58 / 92.48, so
  the floors are 89 / 87 / 93 / 92. Note the pre-existing declared 80 % branch
  floor was already false at 87.85 %, which is further proof it never ran.
- **Status:** done
- **Proof:** `pnpm test` exit 0 with a `% Stmts` table; `statements` temporarily
  set to 99 → exit 1 with `"global" coverage threshold for statements (99%) not
  met: 89.87%`; restored to 89.

### T9 — Make lint able to fail
- **What:** `pnpm lint` exits 0 with 26 warnings, `import/order` is severity 1,
  and `.eslintrc.js:64-73` derives `import/order` path groups from whatever
  directories exist in the working tree — so verdicts differ between a clean
  clone and a dirty one.
- **How:** Replace `getDirectoriesToSort()` with a static const array
  (`["app","components","content","e2e","lib","public","scripts","styles"]`) and
  delete both helper functions. Set `"import/order": [2, {…}]` (error). Add
  `--max-warnings 0` to the `lint` script. Run `nix develop -c pnpm lint:fix`,
  then eyeball the diff — it should touch only import order in ~15 files.
- **Verify:** `nix develop -c pnpm lint` exits 0 and prints `0 problems`;
  `grep -c "readdirSync" .eslintrc.js` returns 0 (proves the path groups no
  longer depend on the working tree). Also run lint once with a stray
  untracked directory present (`mkdir -p __scratch__ && … && rmdir __scratch__`)
  and confirm the result is still `0 problems`.
  **Amendment:** `lint:fix` cleared the warnings but left 5 hard problems that
  needed judgement, not autofix: two `import/order` errors from the
  `jest.mock(...)`-then-`import "./page"` pattern (fixed by moving the page
  import into the import block — Jest hoists `jest.mock` above imports, so
  behaviour is unchanged and 9 tests still pass) and three unused `parent`
  parameters in `generateMetadata` (renamed `_parent`, which matches the
  configured `argsIgnorePattern`). Also reworded the new header comment so the
  literal `readdirSync` does not appear in prose.
- **Status:** done
- **Proof:** `pnpm lint` exit 0, `0 problems`; `readdirSync=0` and
  `require("fs")=0` in `.eslintrc.js`; lint with `__scratch__/` present → exit 0;
  `jest app/blog/page.test.tsx app/projects/page.test.tsx` → 9 passed.

### T10 — Add a vulnerability scan
- **What:** No workflow runs `pnpm audit`; Renovate handles alerts only
  (`renovate.json`), which is not a gate.
- **How:** Run `nix develop -c pnpm audit --prod --audit-level=high` first and
  record the output. If it is clean, add that command as a `Dependency audit`
  step in `check.yml` after `Install dependencies`. If it is not clean, fix the
  offending package; if the fix is not possible now, add a `docs/security/audit-exceptions.md`
  entry naming the advisory, the reason, and an expiry date, and pass
  `--ignore <id>` in the step.
- **Verify:** `nix develop -c pnpm audit --prod --audit-level=high` exits 0 (or
  every non-zero finding has a matching dated exception entry), and
  `grep -n 'pnpm audit' .forgejo/workflows/check.yml` matches.
  **Amendment (material):** the scan was *not* clean. It reported 22 findings —
  1 **critical**, 15 high, 6 moderate — including a critical advisory in `next`
  itself (`GHSA-2464-fhr4-w9xw`, patched in `>=15.5.28`; the repo pinned
  `15.5.24` exactly). Fixed the framework exposure rather than suppressing it:
  bumped `next` and `eslint-config-next` to `15.5.28`, then ran
  `pnpm update --depth Infinity`, which cleared every transitive advisories
  within their declared ranges. Result: 22 → 5 findings (0 critical, 3 high,
  2 moderate). The three remaining highs are documented in
  `docs/security/audit-exceptions.md` with reasons and a 2027-01-31 review date:
  `zod` (fix is a v4 major migration; every untrusted-input schema is now
  length-bounded), and two `postcss` advisories reached only through `next`'s
  own internal `postcss@8.4.31` (build-time only, parsing the project's own
  Tailwind output). The step keeps `--audit-level=high` plus `--ignore` for those
  three, so any *new* high or critical still fails the build.
  **Amendment (consequence of the transitive update):** `pnpm update` also moved
  `@axe-core/playwright` / `axe-core` from 4.13 to 4.14, whose default ruleset
  now enforces WCAG 2.1 SC 2.5.3 (`label-content-name-mismatch`). It flagged two
  nodes on **every** route: the header and footer home links carried
  `aria-label="Tom Segbers — home"` while their visible label is `tomsegbers`.
  Fixed at the source rather than allowlisted — both links now append an
  `sr-only` "— Tom Segbers, home" to the visible wordmark, so the accessible
  name contains the visible label (`components/Header/Header.tsx`,
  `components/Footer/Footer.tsx`, plus the Header test's expected name).
- **Status:** done
- **Proof:** `pnpm audit --prod` 22 → 5 findings after the bump; the CI command
  `pnpm audit --prod --audit-level=high --ignore GHSA-mrhx-c7xc-m3w5 --ignore
  GHSA-6g55-p6wh-862q --ignore GHSA-r28c-9q8g-f849` exits 0; `grep -n 'pnpm
  audit' check.yml` → `:47`. Post-bump gates: typecheck 0, lint 0, `299 passed`,
  build 173 pages on `Next.js 15.5.28`.

### T11 — Re-baseline the performance budgets
- **What:** The newest recorded Lighthouse run (`.lighthouseci/`, 2026-10-21) has
  12 error-level failures (LCP on 6 routes, TBT on 5), and the budgets were
  re-tightened afterwards, so the current build has never been measured. The
  config also teaches the reader to discount reds (`.lighthouserc.js:9-14`).
- **How:** `nix develop -c pnpm build && nix develop -c pnpm budget:lighthouse`.
  Record the median LCP/TBT/CLS per URL. Then either
  (a) the medians meet 2500/200/0.1 — replace the `:9-14` comment with a dated
  line stating the measurement date and values; or
  (b) they do not — set each threshold to the measured median plus 10 % headroom,
  and record in the same comment block both the measured value and the remaining
  gap to the aspirational target, with the date. Do not point at ADR-0003 (it
  belongs to T7); a dated comment in `.lighthouserc.js` is the record.
  In both cases delete the "a single-route red is not proof of regression"
  paragraph.
- **Verify:** `nix develop -c pnpm budget:lighthouse` exits 0; `grep -c "not proof of regression" .lighthouserc.js` returns 0; the file contains a `2026-` measurement date.
  **Amendment 1 (environment):** on this host port 3000 is owned by an unrelated
  process that answers `/` with 200 and `/about` with 404, so the first run
  failed with `ERRORED_DOCUMENT_REQUEST` against a server this repo never
  started. `.forgejo/workflows/lighthouse.yml` already sets `PORT: 3055`; run
  `PORT=3055 pnpm budget:lighthouse` locally too.
  **Amendment 2 (scope of the re-baseline):** medians did not meet the old LCP
  ceiling — `/` 2502, `/about` 2602, `/blog` 1955, the cheesecake article 2623,
  `/projects` 2505, the Node article 2569, `/contact` 2355 (worst median
  2622.9 ms). LCP was re-baselined to **2900** (worst median + ~10 %). TBT
  (max median 197 ms) and CLS (0.000 on every route) were **not** loosened:
  they already meet 200 / 0.1, and raising a passing budget only hides a future
  regression. The comment block records the measured values, the date, and the
  120 ms gap to the aspirational 2500 target as a follow-up.
- **Status:** done
- **Proof:** `PORT=3055 pnpm budget:lighthouse` exit 0; `grep -c "not proof of
  regression"` → 0; the baseline comment carries `2026-10-24` and the per-route
  medians.

### T12 — Add canonicals to the five routes missing them `(P)`
- **What:** `/`, `/about`, `/blog`, `/projects`, `/tags` set `openGraph.url` but
  no `alternates.canonical`. `e2e/metadata.spec.ts:97` passes because it falls
  back to `ogUrl`, so the gap is invisible.
- **How:** Add `alternates: { canonical: "https://tomsegbers.de<route>" }` to
  each route's exported `metadata`, matching `app/contact/page.tsx:13-15`. Add
  all seven fixed routes (`/`, `/about`, `/blog`, `/projects`, `/tags`,
  `/impressum`, `/datenschutz`) to `e2e/metadata.spec.ts` `ROUTES`, and change
  the assertion to require `canonical` directly rather than `canonical ?? ogUrl`.
- **Verify:** `nix develop -c pnpm exec playwright test e2e/metadata.spec.ts --project=chromium`
  passes, and temporarily removing one canonical makes it fail.
  **Amendment:** the seven fixed routes were added as a separate
  `CANONICAL_ROUTES` list rather than appended to `ROUTES`. `ROUTES` also drives
  the OG-image assertion, which only applies to routes carrying the purpose-built
  1200×630 card; adding `/tags`, `/impressum`, `/datenschutz` there would have
  coupled two unrelated contracts.
- **Status:** done
- **Proof:** `playwright test e2e/metadata.spec.ts --project=chromium` → `8 passed
  (38.4s)`. Regression proof: deleting the `/about` `alternates.canonical` makes
  the canonical test report `1 failed` with `no canonical link on /about`;
  restored. (First attempt failed only because `pnpm update` had bumped
  Playwright to a browser build that was not installed locally; `pnpm exec
  playwright install chromium` fixed the toolchain, which CI does on every run.)

### T13 — Stabilise the sitemap and de-index thin tag pages `(P)`
- **What:** Eight static routes and all tag routes emit `lastModified: new Date()`,
  so every rebuild claims the whole site changed. Separately, 122 tag pages
  exist for 34 entries, many with one or two items.
- **How:** Extract the entry-building logic from `app/sitemap.ts` into a pure
  `createSitemapEntries(baseUrl)` in `lib/sitemap.ts` so it can be tested.
  Drop `lastModified` from static routes and tag routes (leave it on blog and
  project entries, which have real `articleDate` values). Add
  `export const MIN_INDEXABLE_TAG_ENTRIES = 3` to `lib/tags.ts`; exclude tags
  below it from the sitemap; in `app/tags/[tag]/page.tsx` return
  `robots: { index: tag.count >= MIN_INDEXABLE_TAG_ENTRIES }` from `generateMetadata`.
  Add `lib/sitemap.test.ts` asserting (i) two consecutive calls produce deeply
  equal output, and (ii) no URL for a tag below the threshold.
- **Verify:** `nix develop -c pnpm exec jest lib/sitemap.test.ts` green;
  `nix develop -c pnpm build` green;
  `grep -n "robots" app/tags/[tag]/page.tsx` matches;
  and after `next start`, pick a tag the test proved is below the threshold and
  `curl -s http://127.0.0.1:3030/tags/<slug> | grep -c 'name="robots" content="noindex"'`
  returns 1.
  **Amendment:** the runtime check ran on port 3031, not 3030 (3030 is the
  Playwright port and 3000 is owned by an unrelated host process). The sitemap
  now sources entries from `getAllBlogPosts()` / `getAllProjects()` instead of
  re-parsing `content/` with `gray-matter`, so there is one frontmatter parser.
- **Status:** done
- **Proof:** `jest lib/sitemap.test.ts app/public-urls.test.ts` → 8 passed;
  build exit 0; `next start --port 3031`: `/tags/3d-printing` →
  `name="robots" content="noindex, follow"`, `/tags/arma-3` →
  `name="robots" content="index, follow"`, `/sitemap.xml` lists exactly 7 tag
  URLs. Prerendered artifacts: 122 tag pages → 115 `noindex`, 7 `index`.

### T14 — Close on-demand rendering of unknown entry slugs `(P)`
- **What:** Neither entry route exports `dynamicParams`, so an unknown slug is
  rendered on demand through `fs`, reading `content/` inside a serverless
  function.
- **How:** Add `export const dynamicParams = false` to
  `app/blog/entry/[slug]/page.tsx` and `app/projects/entry/[slug]/page.tsx`.
  Do **not** add it to `app/tags/[tag]/page.tsx` — the legacy-slug redirect
  (`lib/tags.ts:216-222`) runs at request time and would break.
- **Verify:** after `pnpm build`, `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3030/blog/entry/does-not-exist`
  returns `404`, and the build route table shows no `ƒ` for either entry route.
  **Amendment:** checked on port 3031 for the same port-collision reason as T13.
- **Status:** done
- **Proof:** build route table lists `● /blog/entry/[slug]` and
  `● /projects/entry/[slug]` (no `ƒ`); live server returns `404` for
  `/blog/entry/does-not-exist` and `/projects/entry/does-not-exist`.

### T15 — Reconcile the About page with the Hammer case file `(P)`
- **What:** `/about` ends at "2021 - 2024 Founder & Tech Lead @ LAYZR.gg" while
  the featured case file says "I founded the company in 2024 and lead it as
  CEO". LAYZR is "Founder & Tech Lead" on About and "Co-Founder and CTO" in its
  case file. Four copy defects sit on the same page.
- **How (confirmed by the owner: Hammer is current):**
  - add a new first `TimelineEntry`: `time="2024 – present"`,
    `title="Founder & CEO @ Hammer Robotics"`, link `https://hammer-robotics.de`;
  - change LAYZR to `time="2021 - 2024"`, `title="Co-Founder & CTO @ LAYZR.gg"`;
  - fix `thier` → `their`; `HATtec: Bachelor and Working Student` →
    `HATtec: Working Student & Bachelor's Thesis`; `my Bachelor Thesis` →
    `my bachelor's thesis`; `University of Applied Science` →
    `University of Applied Sciences`;
  - update the `description` at `:17-18` so it no longer names LAYZR as the
    endpoint;
  - remove `<Testimonials />` and its import; delete
    `components/Testimonials/` and its story **only if** `grep -rn Testimonials app components` shows no other consumer;
  - delete the now-unused `examplesH2: "Illustrative examples"` key from
    `e2e/fixtures/expectations.ts:28` (it has no consumer today);
  - update `app/about/page.test.tsx`: timeline count 4 → 5, assert the Hammer
    title, drop the illustrative-examples assertion.
- **Verify:** `nix develop -c pnpm exec jest app/about/page.test.tsx` green;
  `grep -r 'thier' app/ | wc -l` returns 0 (plain `grep -c` with `-r` prints a
  per-file table, not a single count); `nix develop -c pnpm build` green.
  **Amendment:** the plan expected `components/Testimonials/` to hold a story;
  it held only `Testimonials.tsx` and `Testimonials.test.tsx`. Both were deleted
  with the directory — the component had no remaining consumer, and its own test
  would otherwise import a non-existent module.
- **Status:** done
- **Proof:** `jest app/about/page.test.tsx` → 4 passed (timeline now 5 entries,
  asserts both Hammer and LAYZR headings); `grep -r 'thier' app/` → 0 matches;
  `grep -rn Testimonials app components lib e2e` → 0 matches; build exit 0.

### T16 — Retire the dead LAYZR links `(P)`
- **What:** `layzr.gg` now serves a placeholder image, and it is linked from the
  About timeline and the LAYZR case file.
- **How:** Remove `link="https://layzr.gg"` from both `TimelineEntry`s in
  `app/about/page.tsx` and the `layzr.gg` entry from `links:` in
  `content/projects/2024-layzr-…jodel.md`. Keep the LAYZR name, logo and dates;
  add "acquired by Jodel" to the description where the link used to carry that
  meaning. Do **not** invent a replacement URL.
- **Verify:** `grep -rn 'layzr\.gg' app content components` returns no `href`/`link`
  matches (logo filenames are exempt); `nix develop -c pnpm build` green.
  If the content schema requires `links` to be non-empty, drop the `links` key
  entirely rather than leaving `links: []` — check `lib/markdown.ts` first.
  **Amendment (needs a second look from the owner):** `TimelineEntry.link` and
  `PersonTeaser.companyLink` are both **required** props, so "remove the link"
  meant either widening two component APIs or supplying a live target. Rather
  than invent an external URL, both About links now point at the LAYZR case file
  (`/projects/entry/2024-layzr-creator-avatar-platform-acquired-by-jodel`),
  which is the destination the dead domain was standing in for. The case file's
  own `links:` array already carried Business Insider and the Jodel
  announcement, so the dead `LAYZR` entry was simply deleted — `links` is a
  defaulted array in `lib/markdown.ts`, not a required non-empty one.
- **Status:** done
- **Proof:** `grep -rn 'layzr\.gg' app content components` → no matches (only
  `/img/layzrgg_logo.png` remains); build exit 0.

### T17 — Reconcile `.omo/` tracking `(P)`
- **What:** `.gitignore` ignores `.omo/`, yet 506 files under it are tracked,
  so the ignore rule silently does nothing and every reader misreads intent.
- **How:** AGENTS.md R1.x makes `.omo/` the durable plan/evidence store, so the
  directory is meant to be tracked. Delete the `.omo/` line from `.gitignore`
  and add a comment explaining that agent state is intentionally versioned.
  Do not `git rm --cached` anything — that would delete the evidence trail.
- **Verify:** `git check-ignore -v .omo/plans/x.md` exits non-zero (not ignored);
  `git status --short` shows no deleted files.
  **Note:** removing the ignore exposes 186 previously hidden `.omo/` files
  (plans, evidence, run-continuation, boulders, notepads, scratch scripts) that
  were never committed. They are intentionally left unstaged here — staging them
  is part of the release commit, not of this task, and the plan forbids
  `git rm --cached`-style cleanup of the evidence trail.
  **Amendment (knock-on the plan did not anticipate):** `.omo/` had been hidden
  from the tooling by `.gitignore`. Making it untracked-but-visible exposed
  `.omo/f3-journey.ts` and `.omo/tools/lhci-failing-only.js` to `pnpm prettier`,
  `pnpm lint` and `tsc --noEmit` (tsconfig includes `**/*.ts` with only
  `node_modules` excluded). Agent state is tracked deliberately but is not
  application source, so `.omo` was added to `.prettierignore`, `.eslintignore`
  and tsconfig `exclude`. Without this, T17 turns three green gates red on files
  that are historical scratch work.
- **Status:** done
- **Proof:** `git check-ignore -v .omo/plans/x.md` → exit 1 (not ignored);
  `git status --short .omo | grep '^ D'` → none; the only deletions in the tree
  are the intended `mirror-main.yml` and `components/Testimonials/`.

### T18 — Fix README and AGENTS drift `(P)`
- **What:** README says 127 pages / 17 route patterns (build emits 173) and
  "no custom API routes beyond … rewrites" while `app/api/health/route.ts` is a
  real dynamic route. AGENTS R9.1 omits `content:audit`; R6.1 and R9.1 carry
  `[auto: … required status checks]` while R16.5 states there are none;
  the Superseded table links `docs/adr/0007-*.md` and `0008-*.md`, which do not exist.
- **How:** README: correct the page count to 173, drop the hard-coded route-pattern
  count in favour of "one page per post, project and canonical tag", and rewrite
  the API sentence to name `/api/health` and the four aliases. AGENTS: add
  `content:audit` to R9.1's list; retag R6.1 and R9.1 as `[manual]` — and because
  R2.2 requires it, add a `<!-- manual: CI runs on push/PR but is not a required
  status check (see R16.5) -->` line immediately under each heading; replace
  the two dead ADR links with plain text stating that the public-access refactor
  is recorded in this table and has no ADR, so R2.6 holds.
- **Verify:** `grep -c '127 static pages' README.md` returns 0;
  `grep -c 'adr/000[78]' AGENTS.md` returns 0;
  `grep -c 'CI required status checks' AGENTS.md` returns 0 (it is 2 today);
  `grep -n 'content:audit' AGENTS.md` matches inside R9.1;
  `grep -c 'required status checks' AGENTS.md` returns 1 — the R16.5 sentence
  that states the truth, and nothing else.
  **Amendment:** `content:audit` was also added to R6.1, not only R9.1. Both
  rules enumerated the same command list while both were already stale — they
  omitted `content:audit` and the e2e, dependency-audit and coverage steps that
  this plan adds to `check.yml`. Listing them in only one place would have left
  the other rule wrong on the day it was touched. Verify still holds:
  `grep -c 'required status checks'` → 1.
- **Status:** done
- **Proof:** `127 static pages` → 0; `adr/000[78]` → 0; `CI required status
  checks` → 0; `required status checks` → 1 (line 782, R16.5); `content:audit`
  present at lines 332 and 444; `grep -n '0007\|0008' AGENTS.md` → no matches.

### T19 — Wire the legal pages to real facts (BLOCKER B2, part 2) — BLOCKED
- **What:** Delete both `Placeholder` components and render the owner's facts
  from T3's module, so a build cannot succeed with an unfilled legal notice.
- **How:** Requires the owner to supply: name, street, postal code, city,
  country, contact email, phone, VAT ID (or confirm none), the § 18 MStV
  responsible person, the competent supervisory authority, the host that stores
  `website@tomsegbers.de`, and the retention period for enquiries. Fill
  `legalFactsSource`, then in both pages replace each `<Placeholder label="…" />`
  with `facts.<field>` (call `readLegalFacts()` once at the top of each
  component), delete the local `Placeholder` function, delete the paragraph at
  `app/impressum/page.tsx:110-113` that announces the incompleteness, and delete
  the sentence at `app/datenschutz/page.tsx:52-53` that defers to the still-open
  Impressum.
  Import the module as `@/lib/legal-facts` from both pages so the Jest mock path
  matches the specifier the page actually uses (`jest.mock("@/lib/legal-facts", …)`).
  Add `app/impressum/page.test.tsx` and `app/datenschutz/page.test.tsx` mocking
  `@/lib/legal-facts` and asserting `document.body.textContent` contains no `TODO(`.
- **Verify:** `grep -rn 'TODO(Tom)' app/` returns nothing;
  `nix develop -c pnpm build` exits 0; both new page tests pass;
  and **before** the facts are supplied, `pnpm build` fails with
  `LegalFactsError` naming the missing fields (confirm once, then fill and re-run).
- **Status:** done
- **Proof:** `grep -rn 'TODO(Tom)' app/` → nothing (also no `Placeholder`
  remains). `pnpm build` exit 0, 173 pages, with
  `89584<!-- --> Ehingen (Donau)` rendered into `.next/server/app/impressum.html`.
  `jest lib/legal-facts.test.ts app/impressum app/datenschutz` → 12 passed;
  full suite 308 passed. Guard proven before the facts were filled: with
  `postalCode`/`city` empty the build exited 1 with
  `Error [LegalFactsError]: Legal facts are incomplete: postalCode, city,
  mstvResponsible.postalCode, mstvResponsible.city.`
  **Amendment:** the plan's fact list included a phone, a VAT id, a supervisory
  authority and a mailbox host. The owner holds none of the first three, and the
  mailbox is not outsourced, so those fields were made optional or removed
  rather than filled with fiction. The two provider paragraphs (Vercel, Resend)
  no longer promise a DPA: Vercel's DPA covers Pro/Enterprise plans only, so the
  pages point at each provider's published privacy policy and DPA instead of
  asserting a contract on a Hobby account. The retention period is a stated
  policy (six months) supplied by the owner.

## Parallelisation

- **P1:** T3 may start immediately; it touches only new files.
- **P2 (sequential — shared file):** T1 → T2 → T4, in that order; all three edit
  `lib/sendEmail.tsx`. T5 edits a page and is independent of P2.
- **P3:** T6 → T7. T7 depends on T6's config change.
- **P4:** T8, T9, T10, T11, T17, T18 are independent of each other and of P2.
- **P5:** T12, T13, T14, T15, T16 are independent — T12 edits
  `app/tags/page.tsx`, T13 edits `app/tags/[tag]/page.tsx`, so they do not
  collide. T15 and T16 both edit `app/about/page.tsx`: run T16 first, or treat
  them as one commit.
- **P6:** T19 runs after T3 and is gated on owner input.
- T0 runs before everything.

## Risks and rollback

- **T7 is the riskiest task.** Moving the mirror into `check.yml` means a red
  gate now blocks deploys — intended, but it converts a broken `main` into a
  stale production site rather than a fresh broken one. It also lengthens
  deploys by the full gate run (add e2e ≈ 4 min). Rollback: restore
  `mirror-main.yml` from `git show HEAD~1:.forgejo/workflows/mirror-main.yml`
  and delete the mirror step from `check.yml`; ADR-0003 records the reversal.
- **T6 can go red for environmental reasons** on its first production-mode run
  (port 3030 already bound locally, build output missing). Run it once by hand
  before committing the config change, and keep `reuseExistingServer` for local
  runs.
- **T9's `--fix` touches ~15 files.** Commit it alone so the import-order churn
  is reviewable by `git diff -w`, and never combined with T15's content edits.
- **T8 sets a floor from a measurement.** If coverage is measured with a dirty
  tree or a stale cache, the floor will be wrong and every future PR inherits a
  false red. Measure with `jest --clearCache` first.
- **T19 makes `main` unbuildable by design** until facts arrive. Land T3 and T19
  in one branch, but merge T19 only with the facts filled; the plan's task
  ordering keeps T19 last for that reason.
- **Interrupted rebuild:** T13 changes sitemap output; a half-applied refactor
  would leave `app/sitemap.ts` importing a `lib/sitemap.ts` that does not yet
  export the function. Make the extraction a single commit.
- **Later reader:** every task that contradicts an earlier ADR updates it in the
  same commit (T7 → ADR-0002 note + ADR-0003; T18 → AGENTS). Do not leave the
  decision only in this plan file.

## Results

**All 20 tasks are `done`, verified locally and in CI, and the result is
deployed.** Nothing is open.

### Deployed

- `68d2a43` passed `check.yml` (run 4096): every gate, 308 unit tests, the
  Playwright suite and the Storybook smoke tests.
- The mirror step pushed it: GitHub `main` = `68d2a437a80f` (deployment
  `7299813140` at 14:19:45Z).
- Vercel created Production deployment `7299820871` for the same SHA at
  14:20:25Z; the site serves it (`server: Vercel`, fresh `etag`, `age: 2`).
- Live routes `/`, `/about`, `/blog`, `/projects`, `/contact`, `/impressum` and
  `/datenschutz` all return 200. `/impressum` renders the § 5 DDG block with
  `c/o Drei-Kreuz-Straße 26, 89584 Ehingen (Donau)`, `web@tomsegbers.de` and the
  § 18 Abs. 2 MStV line. `/datenschutz` renders the controller block, the Vercel
  and Resend paragraphs and the six-month retention sentence. Neither page
  contains `TODO`, `Platzhalter`, `wird nachgereicht`, `Telefon` or `USt-IdNr`.
- T7's post-merge observation is covered by the two red `Check` runs that left
  the mirror at `cf82454` — see T7's proof.

### What changed

- **Blocker B1, contact form.** `lib/sendEmail.tsx` now reads both slots of the
  `await-to-js` tuple (`thrown ?? response?.error`) and requires
  `response.data.id` before reporting success — Resend resolves `{data, error}`
  on an API rejection and only throws on transport errors, so the old code
  reported success for a 403/429/5xx. Input is bounded (name ≤ 100, message ≤
  5000, CRLF rejected in the name because it reaches the Subject header). The
  E2E success short-circuit is now guarded on
  `process.env.VERCEL_ENV !== "production"`, not `NODE_ENV`, because the e2e
  suite runs against `next start`.
- **Blocker B2, legal pages.** `lib/legal-facts.ts` + 5 tests: a Zod schema for
  every fact the Impressum and Datenschutz need, with an empty shipped source
  and a throw that names each missing field. The Datenschutz now discloses the
  rate limiter's IP processing (`Ratenbegrenzung`, `15 Minuten`, memory-only,
  Art. 6(1)(f)).
- **CI / release gating.** `check.yml` gained `permissions: contents: read`,
  `timeout-minutes: 35`, a dependency-audit step, a Playwright step against the
  production build, and a final `Mirror main to GitHub` step guarded by
  `if: github.ref == 'refs/heads/main' && success()` plus a tip check that
  refuses to move GitHub backwards. `mirror-main.yml` is deleted;
  `screenshots.yml` is `workflow_dispatch`-only and no longer pushes `[skip ci]`.
  New `docs/adr/0003-deploy-gated-on-check.md`; ADR-0002 marked superseded in
  part.
- **Tests and gates that could not fail, now can.** Coverage is enforced
  (`--coverage`, floors 89/87/93/92 from a real measurement — the old declared
  80 % branch floor was already false at 87.85 %). Lint is `--max-warnings 0`
  with `import/order` at error and static path groups instead of
  `fs.readdirSync` (verdicts no longer depend on stray directories). e2e runs
  chromium only, against `pnpm build && next start` in CI. `pnpm audit` runs in
  CI. Lighthouse budgets are measurement-backed.
- **Security.** The audit found 22 advisories including a **critical** in `next`
  itself; `next`/`eslint-config-next` went 15.5.24 → 15.5.28 and an in-range
  `pnpm update` cleared the transitive set: 22 → 5 (0 critical). The three
  remaining highs are documented with reasons and a 2027-01-31 review date in
  `docs/security/audit-exceptions.md` and passed as `--ignore` flags.
- **SEO.** Canonicals added to `/`, `/about`, `/blog`, `/projects`, `/tags`;
  `e2e/metadata.spec.ts` now requires a canonical instead of falling back to
  `og:url`, and covers eight fixed routes. `createSitemapEntries()` is a pure,
  tested function; static routes and tag routes no longer claim
  `lastModified: new Date()`; 115 of 122 tag pages are `noindex` and excluded
  from the sitemap (7 indexable). `dynamicParams = false` on both entry routes
  turns unknown slugs into real 404s instead of rendering through `fs`.
- **Content.** About gains a current Hammer Robotics entry, LAYZR is corrected to
  Co-Founder & CTO with the Jodel acquisition, four copy defects are fixed, the
  invented testimonials block is deleted, and the dead `layzr.gg` link is gone
  (the About links now point at the LAYZR case file, the case file keeps its two
  real sources).
- **Accessibility (surfaced by the dependency update).** axe 4.14 enforces WCAG
  2.5.3; the header and footer home links had an `aria-label` that replaced the
  visible `tomsegbers` wordmark, so all 11 routes failed
  `label-content-name-mismatch`. Fixed by appending `sr-only` text to the
  visible wordmark rather than allowlisting the rule.
- **Docs.** README page count/API surface corrected (173 pages, `/api/health`
  plus four aliases). AGENTS R6.1/R9.1 retagged `[manual]` with the R2.2
  justification, `content:audit` and the new steps added, dead ADR-0007/0008
  references removed. `.omo/` is no longer gitignored (it is the durable store
  per R1.x) and is excluded from prettier/eslint/tsc because it is evidence, not
  application source.

### Verification — every command run, with its outcome

| # | Command | Outcome |
| - | ------- | ------- |
| 1 | `pnpm typecheck` | exit 0 (final run, after all edits) |
| 2 | `pnpm lint` (`--max-warnings 0`) | exit 0, `0 problems` |
| 3 | `pnpm prettier` | `All matched files use Prettier code style!` |
| 4 | `pnpm content:audit` | `PASS — no slop signals found.` |
| 5 | `pnpm contrast` | exit 0 |
| 6 | `pnpm design-tokens` | exit 0 |
| 7 | `pnpm images` | `IMAGE SIZE GATE PASSED — 115 image(s)` |
| 8 | `pnpm fonts` | `FONT BUDGET GATE PASSED — 2 families, critical preload 28.6 KiB` |
| 9 | `pnpm test` | `308 passed`, 47 suites, coverage floors met |
| 10 | `pnpm build` | exit 0, `Generating static pages (173/173)`, `Next.js 15.5.28`; red by design until the address was complete (`LegalFactsError: … postalCode, city, mstvResponsible.postalCode, mstvResponsible.city`) |
| 11 | `CI=1 playwright test --project=chromium --workers=1` | **`100 passed (1.2m)`** |
| 12 | `playwright test e2e/metadata.spec.ts` | `8 passed (38.4s)`; removing one canonical → `1 failed`, `no canonical link on /about` |
| 13 | `playwright test e2e/a11y.spec.ts` | `12 passed (28.5s)` after the 2.5.3 fix |
| 14 | `jest lib/sendEmail.test.tsx` | 17 passed; stashing the fix → `1 failed` |
| 14b | `jest lib/legal-facts.test.ts app/impressum app/datenschutz` | 12 passed; `grep -rn 'TODO(Tom)' app/` → nothing |
| 15 | `jest lib/legal-facts.test.ts` / `lib/sitemap.test.ts` | 5 passed / 8 passed (with `public-urls`) |
| 16 | `jest app/about/page.test.tsx` | 4 passed |
| 17 | `jest components/Header components/Footer` | 19 passed |
| 18 | `pnpm audit --prod --audit-level=high --ignore …` | exit 0, `3 new vulnerabilities were ignored` |
| 19 | `PORT=3055 pnpm budget:lighthouse` | exit 0 (LCP max median 2622.9 ms, TBT 197 ms, CLS 0.000) |
| 20 | `next start --port 3031` + curl | unknown entry slugs → `404`; `/tags/3d-printing` → `noindex, follow`; `/tags/arma-3` → `index, follow`; sitemap 7 tag URLs |
| 21 | 5 workflows parsed with `yaml@2.9.0` | all ok; `mirror-main.yml` absent; `grep -rn 'workflow_run\|needs:'` → 0 |
| 22 | T18 greps | `127 static pages` 0, `adr/000[78]` 0, `CI required status checks` 0, `required status checks` 1 (R16.5) |
| 23 | T17 greps | `git check-ignore` exit 1; no deletions under `.omo/` |

**Ordering caveat, learned twice:** `fonts` and `images` read the *built* output,
so any `next dev` run (including a local Playwright run) leaves `.next` without
`BUILD_ID` and makes `fonts` fail with "Geist … not present in the built CSS".
Always rebuild before those gates. CI is already correct (`Build` precedes
`Font budget gate`).

### Amendments made during execution

1. **T0** — `fonts` needs a prior `pnpm build`; the baseline records the
   ordering defect rather than treating it as a regression.
2. **T3** — `readLegalFacts(source?)` takes an optional source so the happy path
   is testable without mutating module state.
3. **T8** — the failable-threshold proof used a temporarily raised floor instead
   of deleting a covered test file.
4. **T9** — `lint:fix` left two real `import/order` errors (mocked-page import
   pattern) and three unused `parent` parameters; fixed by moving the page import
   into the import block (Jest hoists `jest.mock`) and renaming to `_parent`.
5. **T10 (material)** — the scan was not clean: fixed a critical `next`
   advisory by bumping to 15.5.28, ran an in-range update, and documented the
   three remaining highs. The same update bumped axe to 4.14, which exposed a
   real WCAG 2.5.3 defect on every route — fixed in the components.
6. **T11** — port 3000 is owned by an unrelated process on this host, so
   Lighthouse must run with `PORT=3055` (as CI already does). Only LCP was
   re-baselined (2900 ms); TBT/CLS were left at 200/0.1 because they pass.
7. **T12** — fixed routes live in a separate `CANONICAL_ROUTES` list because
   `ROUTES` also drives the OG-image contract.
8. **T13/T14** — runtime checks ran on port 3031, not 3030.
9. **T15** — `components/Testimonials/` had no story, only the component and its
   test; both were deleted with the directory.
10. **T16** — `TimelineEntry.link` and `PersonTeaser.companyLink` are required
    props, so the About links point at the LAYZR case file instead of being
    removed; the case file's dead `LAYZR` link was deleted (its two real sources
    remain).
11. **T17** — removing `.omo/` from `.gitignore` exposed 186 agent files and
    made prettier/lint/tsc read scratch scripts; `.omo` is now excluded from all
    three. It also exposed `pnpm-workspace.yaml`, which pnpm writes when
    `audit --ignore` runs and which does *not* affect audit results — it is
    gitignored with an explanatory comment.
12. **T18** — `content:audit` and the new CI steps were added to R6.1 as well as
    R9.1, since both enumerate the same list and both were stale.
13. **T19** — the owner holds no phone, VAT id or supervisory authority, and the
    mailbox is not outsourced, so those fields became optional or were removed
    instead of being filled. The Vercel/Resend paragraphs point at the published
    privacy policies and DPAs rather than claiming a contract, because Vercel's
    DPA covers Pro/Enterprise only.

### Not done, and why

- Nothing. The whole change set is committed (`7bf1a18`, `b4f668a`, `aa5b9f6`,
  `68d2a43`), `68d2a43` passed `check.yml`, the mirror advanced and Vercel is
  serving that build in production — see Results. The working tree is clean.
