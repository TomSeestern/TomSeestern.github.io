# Next 15 + React 19 + Flowbite 0.7 Compatibility Spike

**Date:** 2026-07-22
**Task:** Phase 1D — Compatibility Spike (research only, no production files modified)
**Status:** COMPLETE

## TL;DR

Next 15 upgrade is **GREEN — proceed to task 5** with specific migration steps.
All breaking changes are mechanical and codemod-covered. Flowbite-react@0.7.8
supports React 19. The `next-compose-plugins` package is unmaintained and must
be removed (trivial — wraps only one plugin). 5 page/action files need `params`
and `headers()` converted from synchronous to async access.

---

## Installed Versions (Evidence)

| Package | package.json | Installed |
|---|---|---|
| `next` | `14.2.35` | 14.2.35 |
| `react` | `^18.2.0` | 18.3.1 |
| `react-dom` | `^18.2.0` | 18.3.1 |
| `flowbite-react` | `^0.7.0` | 0.7.8 |
| `next-compose-plugins` | `^2.2.1` | 2.2.1 |

Source: `node_modules/<pkg>/package.json` `version` field + `package.json` deps.

---

## Q1: Does `flowbite-react@0.7.x` work with React 19 peer deps?

### Verdict: GREEN

### Evidence

**Installed `node_modules/flowbite-react/package.json` peerDependencies:**
```json
"peerDependencies": {
  "react": ">=18",
  "react-dom": ">=18",
  "tailwindcss": "^3"
}
```

`react: ">=18"` is an open-ended range — it includes React 19.x.
`react-dom: ">=18"` likewise.

The `pnpm info flowbite-react peerDependencies` command returned
`^18 || ^19` — but that reflects the **latest published version** (0.12+),
not the installed 0.7.8. The installed 0.7.8 uses `>=18`, which is broader
and already covers React 19.

**Tailwind peer dep:** `^3` — current project uses Tailwind 3. No conflict.

### Caveat

flowbite-react@0.7.8 is 5 minors behind 0.12+. While peer deps allow React 19,
there may be runtime behavior changes (React 19 removed `defaultProps` for
function components, changed `ref` as prop, removed `propTypes` warnings).
These are unlikely to break Flowbite 0.7 components at runtime since they
use explicit props, but untested. The Phase 2 Flowbite replacement (task TBD)
removes this risk entirely.

---

## Q2: Does `next@15` break `lib/sendEmail.tsx`?

### Verdict: RED (fixable — codemod covers it)

### Evidence

**File:** `lib/sendEmail.tsx` (confirmed — plan said `app/actions/sendEmail.tsx`
but actual path is `lib/sendEmail.tsx` per README and filesystem)

**Line 2:** `import { headers } from "next/headers"`

**Line 34-36:** `getClientIP()` calls `headers()` **synchronously**:
```typescript
function getClientIP(): string {
  try {
    const headersList = headers()          // ← line 36: synchronous call
    const forwarded = headersList.get("x-forwarded-for")  // ← line 37
```

In Next 15, `headers()` from `next/headers` returns a `Promise<ReadonlyHeaders>`.
Synchronous access is deprecated and will eventually error. The codemod
`next-async-request-api` converts this automatically.

**Required fix:**
```typescript
async function getClientIP(): Promise<string> {
  try {
    const headersList = await headers()
    const forwarded = headersList.get("x-forwarded-for")
    // ...
```

And the caller at line 84 (`const ip = getClientIP()`) must become
`const ip = await getClientIP()`. The enclosing `sendEmail` function is
already `async` (line 79), so this is a mechanical change.

No `cookies()` or `draftMode()` usage found anywhere in the codebase (grep
confirmed).

### Risk

Low. Single function, already in async context, codemod-supported.

---

## Q3: Does `next.config.mjs` need changes for Next 15?

### Verdict: YELLOW — `next-compose-plugins` must be removed (unmaintained)

### Evidence

**File:** `next.config.mjs` (40 lines, read in full)

**Line 2:** `import withPlugins from "next-compose-plugins"`

**Line 8:** Config wrapped via:
```javascript
const config = withPlugins([[withBundleAnalyzer({enabled: env.ANALYZE})]], {
    reactStrictMode: true,
    rewrites() { ... },
    async headers() { ... },
    images: { remotePatterns: [...] },
})
```

**`next-compose-plugins@2.2.1`:** Last published 2021. The GitHub repo
(`cyrilwanner/next-compose-plugins`) is archived. It is a thin wrapper that
composes plugin functions. It mechanically still works with Next 15 (it just
calls functions in sequence), but it is unmaintained and the Next.js team
does not recommend it for Next 15+.

**All other config options are valid in Next 15:**
- `reactStrictMode: true` — still supported (see Q4)
- `rewrites()` — still supported, signature unchanged
- `async headers()` — still supported, signature unchanged
- `images.remotePatterns` — still supported, signature unchanged

### Required change

Remove `next-compose-plugins` and inline the single plugin:
```javascript
import withBundleAnalyzer from "@next/bundle-analyzer"
import { env } from "./env.mjs"

const nextConfig = {
  reactStrictMode: true,
  // ... rewrites, headers, images ...
}

export default withBundleAnalyzer({ enabled: env.ANALYZE })(nextConfig)
```

This removes an unmaintained dependency and simplifies the config. The
`withBundleAnalyzer` plugin is the only one wrapped — no need for a
composition utility.

---

## Q4: Does `reactStrictMode` behavior change?

### Verdict: GREEN — no change needed

### Evidence

**Current setting:** `next.config.mjs` line 9: `reactStrictMode: true`

**Next.js 15:** The `reactStrictMode` config option is still supported and
unaffected by the Next 15 upgrade. It wraps the app in `<React.StrictMode>`
in development.

**React 19:** `<React.StrictMode>` is still supported. React 19 did not
remove or change strict mode behavior in a way that affects this project.
The double-invoke behavior in development (intentional for catching bugs)
remains the same.

No action required for this question.

---

## Q5: Do `generateStaticParams` and `params` access still work?

### Verdict: RED for `params` access (codemod covers it), GREEN for `generateStaticParams` itself

### Evidence

**Files using `generateStaticParams` (grep + codegraph confirmed):**

1. `app/blog/entry/[slug]/page.tsx` — line 110
2. `app/projects/entry/[slug]/page.tsx` — line 100
3. `app/blog/entry/[slug]/opengraph-image.tsx` — line 9

All three export:
```typescript
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getMarkdownSlugs(CONTENT_DIR)
}
```

**`generateStaticParams` API:** Unchanged in Next 15. Signature is still
`Promise<{ [key: string]: string | string[] }[]>`. No migration needed for
the function itself.

**`params` access — RED (all 5 page/metadata functions break):**

Next 15 makes `params` a `Promise`. Synchronous property access (`params.slug`)
is deprecated. The codemod `next-async-request-api` converts these.

| File | Line | Function | Current (sync) | Next 15 (async) |
|---|---|---|---|---|
| `app/blog/entry/[slug]/page.tsx` | 33 | `Page({ params })` | `params.slug` (L34, L40) | `const { slug } = await params` |
| `app/blog/entry/[slug]/page.tsx` | 114 | `generateMetadata({ params })` | `params.slug` (L115, L124) | `const { slug } = await params` |
| `app/projects/entry/[slug]/page.tsx` | 22 | `Page({ params })` | `params.slug` (L23, L30) | `const { slug } = await params` |
| `app/projects/entry/[slug]/page.tsx` | 104 | `generateMetadata({ params })` | `params.slug` (L105, L121) | `const { slug } = await params` |
| `app/blog/entry/[slug]/opengraph-image.tsx` | 13 | `Image({ params })` | `params.slug` (L14) | `const { slug } = await params` |

**Required pattern change (per Next.js 15 docs via Context7):**
```typescript
// Before (Next 14)
type Params = { slug: string }
export function Page({ params }: { params: Params }) {
  const { slug } = params
}

// After (Next 15)
type Params = Promise<{ slug: string }>
export async function Page(props: { params: Params }) {
  const { slug } = await props.params
}
```

**No `getStaticProps` or `generateStaticProps` usage found** — the project
uses the App Router exclusively. Pages Router APIs are not present.

### Risk

Low-medium. 5 functions across 3 files. All mechanical, codemod-covered.
The functions become `async` (they mostly already are or can be). The
`Params` interface type changes from `{ slug: string }` to
`Promise<{ slug: string }>`.

---

## Bonus: `app/layout.tsx` — FOUC / Hydration Risk

### Verdict: GREEN — no Next 15 migration concern

### Evidence

**File:** `app/layout.tsx` (100 lines, read in full)

**Line 46:** `<html lang="en" className="...dark" suppressHydrationWarning>`

The `dark` class is hardcoded on `<html>`, then an inline `<script>`
(lines 64-85) runs before hydration to read `localStorage` and
`matchMedia` to add/remove the `dark` class.

**`suppressHydrationWarning`** on `<html>` is the correct pattern for this
approach — it tells React the class will differ between server and client
intentionally.

**Next 15 impact:** None. This pattern (inline script + suppressHydrationWarning)
is the recommended approach for theme handling and is unaffected by Next 15's
async API changes. The script does not call any Next.js server APIs.

---

## Overall Recommendation: GREEN — Proceed to Task 5

### Rationale

All breaking changes are **mechanical, codemod-covered, and low-risk**:

1. 15 Next-related Dependabot advisories provide strong security motivation
2. Flowbite-react@0.7.8 supports React 19 (peer dep `>=18`)
3. `headers()` async migration: 1 function in 1 file (`lib/sendEmail.tsx`)
4. `params` async migration: 5 functions across 3 files
5. `next-compose-plugins` removal: 1 config file, trivial inline
6. `reactStrictMode` and `generateStaticParams`: no changes needed
7. `layout.tsx` theme script: no changes needed

### Migration Steps (for Task 5)

1. **Run codemod first:**
   ```bash
   npx @next/codemod@latest next-async-request-api .
   ```
   This handles `headers()`, `cookies()`, `draftMode()`, and `params`/`searchParams`
   property access automatically.

2. **Remove `next-compose-plugins`:**
   - Edit `next.config.mjs` — inline `withBundleAnalyzer` directly
   - `pnpm remove next-compose-plugins`

3. **Upgrade packages:**
   ```bash
   pnpm add next@15 react@19 react-dom@19
   ```

4. **Verify codemod output manually:**
   - `lib/sendEmail.tsx` — `getClientIP` must be `async`, `await headers()`
   - `app/blog/entry/[slug]/page.tsx` — `Page` and `generateMetadata` async, `await params`
   - `app/projects/entry/[slug]/page.tsx` — same
   - `app/blog/entry/[slug]/opengraph-image.tsx` — `Image` async, `await params`

5. **Update `Params` interface types:**
   - `interface Params { params: { slug: string } }` →
     `interface Params { params: Promise<{ slug: string }> }`

6. **Run full verification:**
   ```bash
   pnpm build
   ppm test
   pnpm e2e:headless
   ```

7. **Commit as conventional commit:**
   `feat: upgrade to Next 15 + React 19`

### Fallback Path (if RED issues surface during upgrade)

If the upgrade reveals unexpected breakage:
- Revert to `next@14.2.35` + `react@18`
- Use `pnpm.overrides` in `package.json` to force transitive dependency
  versions that fix the 15 Next-related CVEs without upgrading Next itself
- Defer Next 15 to post-Phase-2 Flowbite replacement
- Document in acceptable-debt ledger

### Risk Assessment

| Item | Risk | Mitigation |
|---|---|---|
| `headers()` sync → async | Low | 1 function, codemod |
| `params` sync → async | Low-medium | 5 functions, codemod |
| `next-compose-plugins` removal | Trivial | Inline 1 plugin |
| Flowbite 0.7 + React 19 runtime | Low-medium | Peer dep allows it; Phase 2 replaces Flowbite |
| `reactStrictMode` | None | No change |
| `generateStaticParams` | None | API unchanged |
| `layout.tsx` theme script | None | Pattern unaffected |
