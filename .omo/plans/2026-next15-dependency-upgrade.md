# 2026-next15-dependency-upgrade - Work Plan

## TL;DR (For humans)

**What you'll get:** All 21 Next.js CVEs and all 23 axios CVEs cleared (100% of known advisories), the two Next 15 breaking-API changes applied, and the highest-value audit findings fixed — including the missing CI typecheck gate that let three majors rot silently.

**Why this approach:** Build the safety net *before* touching dependencies, so a red build is provably attributable to the upgrade rather than to a newly-discovered pre-existing break. Every dependency-independent fix lands on stable deps where it stays bisectable and revertable.

**What it will NOT do:** It won't enforce the CSP, add real (shared-storage) rate limiting, delete `components/Button`, or rewrite `AGENTS.md`. Those are flagged, not changed.

**Effort:** XL
**Risk:** High - three simultaneous majors (Next 14→15, Storybook 7→9, test-runner 0.15→0.23) plus a `moduleNameMapper` addition that surfaces latent failures in never-before-tested files.
**Decisions I made for you:** Next **15.5.24** (not `latest` 16.3.3 — 16 buys zero extra security); Storybook **upgrade to 9.1.20** (not delete); canonical host **`https://tom.segbers.de`**; real rate limiting **out of scope**. All four are confirmable — see Decisions below.

---

## Provenance

Produced by the `plan` agent (`ses_fb2169899ffeWgWSuFSKGZ2LsR`) from a fact bundle distilled by the lead after three adversarial rounds of a hyperplan team (`next-migration-hyperplan`, runId `35d777e2-8eed-4dbb-8432-82a4a7ae1d78`, since deleted).

Members: pragmatist (unspecified-low), creative (artistry), adversarial (unspecified-high), architect (ultrabrain). The architect's session timed out during Round 2; the lead performed its reconciliation directly.

All versions and advisory counts were verified by the lead via `curl -k` against `registry.npmjs.org` and `api.osv.dev`. **Nothing was accepted from a member on trust.**

**Environment note:** this repo's planning environment sits behind a TLS-intercepting proxy. Only `curl -k` has network access; `pnpm` cannot run at all and `node_modules` is not installed. No install, build, or test can execute locally — Phase 0 exists to unblock this.

---

## Corrections to the fact base (verified via `curl -k`; these change the plan)

| # | Claim | Verified reality | Impact |
|---|---|---|---|
| 1 | `wait-on@^7.0.0 → axios@^1.6.1` | **`wait-on@7.0.0` deps `axios@^0.27.2` → 23 advisories.** Only **`7.2.0`** uses `axios@^1.6.1` (clean). `^7.0.0` *resolves* to 7.2.0, but a lockfile pinned at 7.0.x/7.1.x keeps all 23 CVEs. | **Adds a mandatory verification gate.** The axios fix is resolution-dependent, not automatic. |
| 2 | Next 16 "requires React 19" | `next@16.3.3` peerDeps: `react: "^18.2.0 \|\| ... \|\| ^19.0.0"` — **React 18 is an accepted peer.** | Softens the 16 cost. The real 16 costs are ESLint 9 + Node ≥20.9.0 + unverifiable Vercel setting. |
| 3 | `Story` type at "line 2" | Also used at **`ArticleTeaser.stories.tsx:55`** and **`ProjectTeaser.stories.tsx:24`** (`Template: Story<Props>`), plus a `decorators: [(Story) => ...]` at :47/:16. | The rewrite is **larger than an import swap** — 3 sites per file. |
| 4 | "addon renames" for SB9 | `@storybook/addon-interactions` **terminates at 8.6.14** (peers `storybook@^8.6.14`) and `@storybook/blocks` has **no 9.x stable release at all** (last 8.6.14). Both must be **deleted**, not renamed. `@storybook/testing-library@0.2.2` is **deprecated**. | SB9 migration = 2 removals + 1 add (`@storybook/addon-docs@9.1.20`). |
| 5 | Route count "36 vs 32" | Measured: **3 blog + 21 projects = 24 dynamic**, **5 static pages** (7 `page.tsx` files − 2 `[slug]`) = **29 routes**. README's 36 is wrong; the fact base's 32 is also unverified. | Don't hard-code a number — **derive it from build output**. |
| 6 | Marquee "root cause is duplicated `key`" | **Disproven by inspection.** Lines 110 and 126 are an intentional seamless-loop pair (`marquee`: `0→-100%`; `marquee2`: `100%→0%`). The duplicate `key` is *harmless*. | The real defect is narrower: `getAllProjects()` **re-reads all 24 markdown files from disk twice**. Fix = hoist to one `const`, keep both maps. |

**Unchanged and re-confirmed:** `next@14.2.35`→21 CVEs; `15.5.24`, `16.2.11`, `16.3.3`→**0**. `axios@0.21.4`→23; `1.18.1`→0. `storybook@9.1.20`, `@storybook/test-runner@0.23.0`, `flowbite@2.5.2`, `flowbite-react@0.12.17`→**0**. `@storybook/nextjs@9.1.20` peers `next: ^14.1.0 || ^15.0.0 || ^16.0.0` **and `storybook: ^9.1.20`** (exact pairing required).

### New advisory batch (published 2026-07-22)

7 of the 21 advisories on 14.2.35 are brand new, postdating earlier scans. All 8 in this batch fix at **15.5.21** / **16.2.11**:

`GHSA-4633-3j49-mh5q` (CVE-2026-64647) · `GHSA-4c39-4ccg-62r3` (CVE-2026-64646) · `GHSA-68g3-v927-f742` (CVE-2026-64648) · `GHSA-89xv-2m56-2m9x` (CVE-2026-64649) · `GHSA-955p-x3mx-jcvp` (CVE-2026-64643) · `GHSA-m99w-x7hq-7vfj` (CVE-2026-64641) · `GHSA-p9j2-gv94-2wf4` (CVE-2026-64645) · `GHSA-q8wf-6r8g-63ch` (CVE-2026-64644)

There is **no stable 15.6.x** — only canaries. `15.5.24` is the terminal stable 15 line.

---

## Decisions

Defaults are marked ⭐. Each is a one-way-ish door; confirm before execution.

1. **Next 15.5.24 vs 16.3.3** — ⭐ **15.5.24**. The request said "latest"; `latest` is 16.3.3 and both clear 100% of CVEs, so 16 buys **zero** additional security. 16's real extra costs: ESLint 9 flat config rewrite (forces `@typescript-eslint` 6→8), `engines >=20.9.0`, and an **unverifiable Vercel Node setting** (no `vercel.json`, no `.vercel/` in repo — dashboard-only). React 19 is *not* actually forced (peer allows ^18.2.0), so the 16 delta is smaller than previously stated — but still non-zero. **Not picking 16 silently.**
2. **Canonical host** — ⭐ **`https://tom.segbers.de`**. Wins 9-to-2 in current usage (`layout.tsx:11`, `sitemap.ts:7`, `robots.ts:9`, `about`, `blog`, `projects`, `page`). Only the two `[slug]` canonicals use `tomsegbers.de`. Accepting this means changing **2 lines**, not 9. ⚠️ **But** `Footer.tsx:15` links `https://tomsegbers.de/` and `sendEmail` mails from `website@tomsegbers.de` — if `tomsegbers.de` is not the real domain at all, that's a **separate, more serious bug** (wrong domain in the footer link and the mail From/To). **Confirm which domain is real.**
3. **Storybook: upgrade to 9.1.20 vs delete** — ⭐ **Upgrade** (see §5).
4. **Real rate limiting** (Vercel KV/Upstash) — ⭐ **Out of scope**; document only.
5. **CSP `Report-Only` → enforced** — ⭐ **Out of scope**; flipping this can break the live site with no staging. Flagged, not changed.
6. **Delete `components/Button`** (dead code, 3 files) — ⭐ **Out of scope**; keep, since it's the reference implementation for the `cva` pattern the README documents.

---

## Ordering rationale (why this sequence)

The single most important sequencing decision: **build the safety net BEFORE touching dependencies.**

> If you add `typecheck` + `build` to CI *after* upgrading, and CI goes red, you cannot tell whether the cause is your new gate discovering pre-existing breakage, or the upgrade itself. Establish the gate on known-good deps first.

Second: **all dependency-independent code fixes land before the upgrade.** Every commit in Phases 1–2 is bisectable and revertable against a working `node_modules`. Only after the codebase is clean do we change the floor beneath it.

```
Phase 0  UNBLOCK        ── gate, blocks everything
Phase 1  SAFETY NET     ── must precede Phase 3  [serial]
Phase 2  CODE FIXES     ── must precede Phase 3  [serial, 3 parallel lanes]
Phase 3  DEP UPGRADE    ── after 1+2             [serial]
Phase 4  NEXT 15 API    ── after 3               [serial]
Phase 5  STORYBOOK 9    ── after 3               [PARALLEL with 4]
Phase 6  ESLint CLI     ── after 3               [PARALLEL with 4/5]
Phase 7  VERIFY         ── after 4+5+6           [serial gate]
Phase 8  CLEANUP        ── after 7               [parallel lanes, optional]
Phase 9  PROCESS        ── after 7               [parallel, optional]
```

**Parallelizable:** Phases 4, 5, 6 (all post-upgrade adaptations, disjoint files). Phase 2's three lanes. Phase 8/9 lanes.
**Strictly serial:** 0→1→2→3→(4‖5‖6)→7.

---

## Phase 0 — Unblock (gate; nothing else can start)

`pnpm` cannot run in the planning environment (TLS-intercepting proxy; pnpm refuses to verify its own release signature). `node_modules` is absent.

**Exact commands, run on a machine with working pnpm (nix devShell per `flake.nix:56`):**

```bash
unset PNPM_HOME npm_config_prefix          # pnpm 11 crashes on null exports (README documents this)
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

⚠️ `typecheck` **does not exist yet** (added in Phase 1) — expect `Missing script`. Run the rest to capture the green baseline.

**Baseline to capture before any edit** (so later failures are attributable):
```bash
pnpm build 2>&1 | grep -E "Route|○|●|ƒ" > /tmp/baseline-routes.txt   # real route count, kills the 36-vs-32 debate
pnpm test 2>&1 | tail -20 > /tmp/baseline-test.txt
```

**Risk:** none. **Rollback:** n/a.

---

## Phase 1 — Safety net (highest leverage; must precede Phase 3)

Today CI (`check.yml`) runs lint, prettier, jest, storybook — **no typecheck and no `pnpm build`**. `tsc` is a devDep nothing invokes. This is the root cause of 3-major silent rot.

- `package.json` — add `"typecheck": "tsc --noEmit"` after line 17.
- `.forgejo/workflows/check.yml` — insert **before** the "Lint check" step (line 32):
  ```yaml
        - name: Typecheck
          run: nix develop -c pnpm typecheck
        - name: Build
          run: nix develop -c pnpm build
  ```
- `jest.config.js:7` — add the missing alias mapper (the `@/*` alias from `tsconfig.json:21` is used by both `[slug]` pages, which therefore have **zero** test coverage and would fail if tested):
  ```js
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
  ```

**Risk — `moduleNameMapper` is the one genuinely dangerous step in this phase.** It makes previously-untestable files suddenly reachable. Expect latent failures in `app/blog/entry/[slug]/page.tsx` and `app/projects/entry/[slug]/page.tsx` (both import `@/lib/markdown`, which reads from `fs` — under `jsdom` those imports may throw). This is why Phase 1 precedes Phase 3: failures surfacing here are **pre-existing**, not upgrade-induced.

**TDD:** add `app/blog/entry/[slug]/page.test.tsx` — renders one known slug (`content/blog/`, 3 files), asserts the `<h1>` and the canonical `<link>`. It is *expected to fail* until the mapper lands.

**Rollback:** revert the mapper; CI steps are additive.

---

## Phase 2 — Dependency-independent code fixes (3 parallel lanes)

All are test-covered and land on stable deps. **Lanes are disjoint — run in parallel.**

### Lane 2A — Footer GitHub handle (must fix code + test together)
- `components/Footer/Footer.tsx:39` → `https://www.github.com/TomSegbers/`
- `components/Footer/Footer.test.tsx:46` → asserts the same corrected URL

⚠️ **Both in one commit.** Fixing only `Footer.tsx` turns the suite red at line 46; fixing only the test encodes the bug. **TDD:** update the test first, watch it fail, then fix the component.
⚠️ **Blocked by decision #2** — if `tomsegbers.de` is itself the wrong domain, `Footer.tsx:15` and the `sendEmail` From/To addresses are the bigger bug.

### Lane 2B — Rate-limit ordering (security)
`lib/sendEmail.tsx`: move `safeParse` (line 92) **above** `checkRateLimit` (line 85). Currently unvalidated input consumes rate-limit budget — a trivial DoS on the contact form.
- **TDD:** add `sendEmail.test.tsx` case — a malformed payload must return **field errors, not** `_form: "Too many messages..."`. Confirmed: `sendEmail.test.tsx:138` fires 5 *valid* requests, which pass `safeParse` either way, so its arithmetic is unaffected.
- Add a comment at `sendEmail.tsx:30` formalizing the serverless `Map` limitation (already partly documented at :20-29).

### Lane 2C — Canonical host + marquee
- Align `app/blog/entry/[slug]/page.tsx:71` and `app/projects/entry/[slug]/page.tsx:66` to the chosen host. ⭐ = `tom.segbers.de` (9 existing usages vs 2).
- **Better:** don't repeat the literal — import `metadataBase` from `app/layout.tsx:11` so this cannot drift again.
- `app/page.tsx:109-131` — hoist `getAllProjects()` to a single `const` above line 109; use it in both `.map()` calls. **Keep both maps and both keyframe sets.** Do **not** delete `tailwind.config.js:174-183` (breaks `e2e/interactions.spec.ts:65`); do **not** "fix" the duplicate `key` at :113/:129 (harmless — React dedupes, and the outer `div` already carries the correct key).

**Rollback:** 3 independent commits, each revertable alone.

---

## Phase 3 — Dependency upgrade (the core request)

Exact `package.json` edits:

**dependencies**
```
next                    14.2.35  → 15.5.24
flowbite                ^2.2.0   → 2.5.2      (pin: last 2.x; 4.0.2 drags in tailwindcss@4)
flowbite-react          ^0.7.0   → 0.12.17
@next/bundle-analyzer   ^14.0.3  → ^15.5.24
```
**devDependencies**
```
eslint-config-next      14.2.35  → 15.5.24    (peers eslint ^7.23||^8||^9 → ESLint 8 STAYS)
storybook               ^7.5.3   → 9.1.20
@storybook/nextjs       ^7.5.3   → 9.1.20
@storybook/react        ^7.5.3   → 9.1.20
@storybook/addon-essentials ^7.5.3 → 9.1.20
@storybook/addon-links  ^7.5.3   → 9.1.20
@storybook/addon-docs   — ADDED  → 9.1.20     (replaces blocks+interactions)
@storybook/test-runner  ^0.15.2  → 0.23.0     ← THIS breaks the axios@0.21.4 chain
REMOVE: @storybook/addon-interactions (terminal 8.6.14, SB8-only)
REMOVE: @storybook/blocks             (no 9.x stable exists)
REMOVE: @storybook/testing-library    (deprecated)
eslint-plugin-storybook ^0.6.15  → 9.1.20     (engines node>=20; eslint >=8 — OK)
```
**stay:** `react`/`react-dom` 18.3.1 · `tailwindcss` 3 · `eslint` 8.54.0 · `@typescript-eslint` ^6.12.0 · `typescript` 5.3.2

Also bump `engines.node` `>=18.17.0` → **`>=20.9.0`** (required by `eslint-plugin-storybook@9`; satisfies Next 15 too) and add **`.nvmrc`** with `22`.

```bash
pnpm install     # NOT --frozen-lockfile: lockfile must regenerate
pnpm install --frozen-lockfile   # then prove it's self-consistent
```

**Risk — HIGH.** Three majors at once (Next 14→15, Storybook 7→9, test-runner 0.15→0.23). Mitigation: this is exactly why Phases 1–2 landed first — a red build here is attributable to the upgrade, nothing else.

**Rollback:** `git revert` the one commit; `pnpm install`. Keep the pre-upgrade `pnpm-lock.yaml` in the commit history as the restore point.

---

## Phase 4 — Next 15 breaking API (serial after Phase 3)

Next 15 made `params`/`searchParams` async and `headers()` await-only.

- `app/blog/entry/[slug]/page.tsx` — `interface Params` (10-14) becomes `{ params: Promise<{ slug: string }> }`; `Page` (16) and `generateMetadata` (54) become `async` and `await params`. Dead `type Props` (49-52) — unused and has the wrong field (`id` not `slug`); delete it.
- `app/projects/entry/[slug]/page.tsx` — same at lines 10-14, 16, 49.
- `lib/sendEmail.tsx:36` → `const headersList = await headers()`; `getClientIP` (34) becomes `async`; caller at :84 → `await getClientIP()`.

**Risk — MEDIUM.** Touches both `[slug]` routes, i.e. **24 of 29 routes**. `generateStaticParams` (:45 in both) still returns a plain array — unaffected. Note `Page` is currently **sync**; making it `async` is required by Next 15.

**TDD:** the Phase 1 test for `[slug]/page.tsx` is the guard — it must pass here. Add an assertion that awaited params resolve.

**Rollback:** revert; the two files are self-contained.

---

## Phase 5 — Storybook 7→9 (parallel with 4)

**Parallel with Phase 4** (disjoint files: `.storybook/*` + `*.stories.tsx` vs `app/` + `lib/`).

- `.storybook/main.ts` — `addons` becomes `["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-docs"]`; drop `*.stories.mdx` from `stories` (MDX unsupported by the smoke runner, per README); keep `framework: { name: "@storybook/nextjs" }`.
- `.storybook/preview.ts` — `Preview` import moves `@storybook/react` → **`@storybook/nextjs`**; the `actions.argTypesRegex` param is **removed in SB9** (delete it).
- **Rewrite 2 story files** — 3 `Story` sites each, not 1:
  - `ArticleTeaser.stories.tsx`: import `StoryObj` (:2), `Template: Story<ArticleProps>` → `StoryObj<ArticleProps>` (:55), `decorators` (:47) → CSF3 `render`.
  - `ProjectTeaser.stories.tsx`: same at :2, :24, :16.
  - `Button.stories.tsx` already uses `StoryObj` — verify only.

**Risk — MEDIUM-HIGH.** Two majors. `addon-interactions` and `blocks` have **no SB9 equivalent** and must be **dropped** (correction #4), so `test-storybook`'s interaction testing is lost — but **7 Playwright e2e specs already cover interactions**, so no coverage regression. `eslint-plugin-storybook@9.1.20` needs **Node ≥20** (hence the `engines` bump in Phase 3).

**Rollback:** revert; Storybook is dev-only — no production surface.

---

## Phase 6 — `next lint` → ESLint CLI (parallel with 4/5)

`next lint` is deprecated in 15 **and removed in 16** — a **shared** cost, so doing it now is not wasted.
- `package.json:9-10` → `"lint": "eslint . --ext .ts,.tsx"`, `"lint:fix": "eslint . --ext .ts,.tsx --fix"`.
- ESLint 8 + `.eslintrc.js` **stay** (no flat config). Remove `eslint-plugin-jsx-a11y` from Phase 8's "missing" list — `eslint-config-next@15.5.24` **already bundles it** (verified in its deps).

**Risk — LOW.** Verify rule parity: `pnpm lint` output before vs after must match.

---

## Phase 7 — Verification gates (hard gate; all later phases blocked)

```bash
# 1. Full local suite
pnpm typecheck && pnpm lint && pnpm prettier --check "**/*.{js,jsx,ts,tsx}"
pnpm test && pnpm build && pnpm e2e:headless
pnpm build-storybook && pnpm test-storybook
```

```bash
# 2. THE axios gate — correction #1 makes this NON-OPTIONAL.
#    `wait-on@^7.0.0` only resolves clean at 7.2.0. Prove it landed there:
pnpm why axios
#    Expect ONLY 1.x lines. Any 0.x line = 23 CVEs survived. If 7.0.x/7.1.x got pinned:
#      add "pnpm": { "overrides": { "axios": "^1.20.0" } } to package.json, reinstall, re-check.
```

```bash
# 3. Prove 0 advisories on the final resolved tree (run on a machine with curl)
for p in "next:15.5.24" "axios:1.20.0" "storybook:9.1.20" "@storybook/test-runner:0.23.0" \
         "@storybook/nextjs:9.1.20" "flowbite:2.5.2" "flowbite-react:0.12.17"; do
  n="${p%%:*}"; v="${p##*:}"
  printf "%s@%s -> " "$n" "$v"
  curl -sk -X POST https://api.osv.dev/v1/query \
    -d "{\"package\":{\"name\":\"$n\",\"ecosystem\":\"npm\"},\"version\":\"$v\"}" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log(((j.vulns)||[]).length+" advisories")})'
done
# Every line MUST print "0 advisories".
```

```bash
# 4. Route-count truth (settles README 36 / fact-base 32 / measured 29)
pnpm build 2>&1 | grep -cE "^(○|●|ƒ)" ; diff <(pnpm build 2>&1 | grep -E "Route \(app\)" -A40) /tmp/baseline-routes.txt
```

---

## §5 — Storybook: the call

**Recommendation: upgrade to 9.1.20.**

Both options clear axios identically, so **security does not discriminate** — this is purely a capability-vs-effort call.

- **Upgrade cost:** 2 config files + 2 story rewrites (3 `Story` sites each) + 2 package removals. Bounded, known, ~2–4h.
- **Deletion cost:** lose the isolated render-smoke gate; `components/Button` (3 files) becomes orphaned; `check.yml:39-44` must be rewritten; 7 Playwright specs remain the only render coverage.
- **Deciding factor — optionality.** Deleting is a one-way door on capability; upgrading **keeps the deletion option available later** at near-zero extra cost. If Phase 5 proves painful, delete then — you lose nothing but the attempt. Deleting *now* forecloses that.
- **Counterweight, honestly:** the catalog is tiny (3 stories for 7 components), `@storybook/testing-library` is deprecated, and `addon-interactions` is gone in SB9 — so `test-storybook` becomes a pure render smoke, weaker than today's. That's a real reduction in value, not a neutral move.

**Verdict:** upgrade, but treat it as **the first thing to abandon** if Phase 5 exceeds its estimate. Deletion is the documented fallback, not a failure.

---

## Phase 8 — Cleanup (parallel lanes, after Phase 7)

**In scope (cheap, verifiable):**
- **Remove 13 unused `@radix-ui/*`** — keep only `react-tooltip`. Largest single win. Verify with `grep -rn "@radix-ui/react-" app components lib` before each removal.
- **README**: replace "36 routes" with the Phase 7 measured count; **delete both "static export" claims** (false — `app/api/health/route.ts`, 4 rewrites at `next.config.mjs:10-18`, and a real `"use server"` action).
- **`tailwind.config.js`**: drop the unused `lodash` import (:2) and the stale flowbite-react glob (:29).
- **Jest coverage thresholds** (`jest.config.js:12-19`) are **dead** — `package.json:17` runs bare `jest`, no `--coverage`. Wire `pnpm test` → `jest --coverage` **and accept the CI slowdown**, or delete the thresholds. Currently they're decorative either way.
- **Playwright**: `playwright.config.ts` declares 3 browsers; CI installs chromium only. Either pin CI to `--project=chromium` or install all three.
- **Content `#todo`s**: `content/projects/2019-process-automation-in-proptech.md:69-70`, `content/projects/2020-soudest-multimodal-travel-planner-frontend.md:71,72,81` — live placeholders on the public site.
- **Frozen dates** (`ArticleTeaser.tsx:63`, `ProjectTeaser.tsx:74`): do **NOT** add `"use client"` (breaks the build via `fs`/`gray-matter`). Fix = precompute the relative string server-side and pass it down.

**Out of scope (say so explicitly):**
- **Enforcing the CSP** (`next.config.mjs`) — `Report-Only` → enforced can break production with no staging. Flagged only.
- **Real rate limiting** (Vercel KV/Upstash) — needs a paid resource and a decision (#4).
- **Deleting `components/Button`** — it's the documented `cva` reference.
- **`scripts/check-project-frontmatter.js`** — wire it into a `pnpm` script + CI, or delete it. One line either way, but it's a genuine choice.

---

## Phase 9 — Process (root cause)

- **`renovate.json`** — **this is the root cause of the entire 3-major rot**: `packageRules: [{enabled: false, matchPackagePatterns: ["*"]}]` disables everything. **In scope, high value.** ⚠️ Note the two existing `vulnerabilityAlerts`/`osvVulnerabilityAlerts` keys at :12-15 are **inert** — `vulnerabilityAlerts` is a *packageRule* property, not top-level. Re-enabling means deleting the `packageRules` block and moving those into a proper rule.
- **`.omo/` state** (`task-18` in_progress, `task-28` blocked-but-resolved, `task-14` `completed_pending_human_approval`) — **out of scope.** Stale bookkeeping from an abandoned tool; no effect on build, test, or security.
- **`AGENTS.md`** (1100 lines / 242 rules, 2% automated) — **out of scope** for this plan, *except* the two invariants this plan introduces should be encoded as **checks, not prose**: (a) the canonical host (Phase 2C's import-based fix makes drift structurally impossible), (b) the typecheck gate (Phase 1, CI-enforced).
- **Conventional Commits hook** — defined in `.pre-commit-config.yaml`, `.git/hooks/` has zero non-sample hooks. Either run `pre-commit install -t commit-msg` or drop the config.

---

## Atomic commit strategy

One concern per commit; every commit independently revertable; no commit may leave CI red.

| # | Commit | Type | Gate |
|---|---|---|---|
| 1 | `test: add [slug] page test + jest moduleNameMapper` | test | fails until mapper lands; green after |
| 2 | `ci: add typecheck and build steps to check workflow` | ci | green on old deps |
| 3 | `chore: add typecheck script` | chore | green |
| 4 | `fix: correct GitHub handle in Footer and its test` | fix | lane 2A |
| 5 | `fix: validate input before rate limiting in sendEmail` | fix | + new test |
| 6 | `fix: unify canonical URL host on metadataBase` | fix | lane 2C |
| 7 | `perf: hoist getAllProjects call in home page marquee` | perf | e2e interactions still green |
| 8 | `chore(deps): upgrade next to 15.5.24` | chore | **may go red — expected** |
| 9 | `feat: await params and headers for Next 15` | feat | restores green |
| 10 | `chore(deps): upgrade storybook to 9.1.20` | chore | + config + 2 story rewrites |
| 11 | `chore(deps): upgrade test-runner to 0.23.0` | chore | **breaks axios 0.21.4 chain** |
| 12 | `chore: migrate lint scripts off deprecated next lint` | chore | rule parity |
| 13 | `chore(deps): pin flowbite 2.5.2 and flowbite-react 0.12.17` | chore | |
| 14 | `chore: bump engines to node >=20.9.0 and add .nvmrc` | chore | |
| 15 | `docs: correct route count and remove static-export claims` | docs | after Phase 7 count |
| 16 | `chore(deps): remove 13 unused @radix-ui packages` | chore | grep-verified |
| 17 | `chore: re-enable renovate` | chore | **root cause** |
| 18 | `fix: resolve live #todo placeholders in project content` | fix | |

**Rule:** never bundle a dependency bump with a code fix in one commit. Commits 8–11 form a deliberate red→green arc; if 9 or 10 can't restore green, revert 8–11 as a block.

---

## Risk summary

| Phase | Risk | Why | Mitigation |
|---|---|---|---|
| 1 mapper | **HIGH** | Surfaces latent failures in never-tested `[slug]` pages (`@/lib/markdown` reads `fs` under jsdom) | Landed **before** upgrade → failures are provably pre-existing |
| 3 upgrade | **HIGH** | 3 simultaneous majors | Phases 1–2 green first = clean attribution |
| 5 Storybook | **MED-HIGH** | 2 majors; 2 addons have **no SB9 replacement**; 2 story files need 3-site rewrites | 7 Playwright specs cover the interaction coverage being lost |
| 4 async params | **MED** | Touches 24/29 routes | Both files self-contained; Phase 1 test guards |
| 7 axios | **MED** | Clean only if `wait-on` resolves to **7.2.0** (correction #1) | `pnpm why axios` gate + `overrides` fallback |
| 6/8/9 | **LOW** | Additive or dev-only | Revert individually |

## Top blockers to resolve before execution

1. **A working `pnpm install`** — nothing starts until Phase 0 clears.
2. **Next 15.5.24 vs 16.3.3** — default is 15.5.24; the request said "latest", so this is being confirmed rather than decided.
3. **Which domain is real** — if `tomsegbers.de` is wrong outright, `Footer.tsx:15` and `sendEmail`'s From/To are a worse bug than the canonical mismatch.
4. **`wait-on` resolution** — verify `pnpm why axios` shows only 1.x; otherwise 23 CVEs survive the upgrade.

---

## Disproven claims — do NOT implement these

Retained so a future executor does not "rediscover" them:

- ~~Missing OG images~~ (test fixtures only) · ~~footer icon a11y bug~~ (correct `alt=""` + `sr-only`) · ~~unlabeled form fields~~ (fully labeled) · ~~duplicate `og:image`~~ (separate namespaces) · ~~`window.innerWidth` hydration crash~~ (not present) · ~~`team.json` dynamic import~~ (not present)
- ~~"3 CVEs require Next 16"~~ — falsified; each has a 15.x backport (15.5.14 / 15.5.13 / 15.5.10)
- ~~"16.1.7 is a safe floor"~~ — 16.1.7 has 23 open advisories; floor is **16.2.11**
- ~~"RSC DoS fix requires React 19"~~ — false
- ~~"Site is a static export"~~ — false; Route Handler + 4 rewrites + a server action
- ~~"Delete the duplicate marquee keyframes"~~ — breaks `e2e/interactions.spec.ts:65`; they are a correct loop pair
- ~~"Add `\"use client\"` to fix the frozen dates"~~ — breaks the build via `fs`/`gray-matter`
- ~~"Delete `components/Button`"~~ — breaks Storybook + Jest references
- ~~"Reordering rate limit breaks `sendEmail.test.tsx:138`"~~ — it does not
