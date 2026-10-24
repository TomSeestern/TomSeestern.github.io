# critic-roma — Round 2 Cross-Attack

**Lens:** every rival proposal is judged by (1) does it serve or dilute the Rome concept, and (2) is the Rome concept itself defensible. Severity = critical / high / medium. Evidence cited as `file:line`.

Ground facts verified in-repo before attacking:
- `tailwind.config.js:118-155` — `fontFamily` defines only `body` and `sans` (both Inter). There is **no** `open-sans`, **no** `text-2xs`, **no** `rounded-0.5md`.
- `components/Tooltip/Tooltip.tsx:5` — `"rounded-0.5md bg-zinc-700 px-4 py-2.5 font-open-sans text-2xs text-white"`. Three class names are **dead tokens** → tooltips already render with fallback fonts/radii.
- `tailwind.config.js:163-166` — `minHeight.teaser: "4.5rem"` **does exist** (`min-h-teaser` is valid; not drift).
- `app/page.tsx:110-141` — marquee renders `projects.map()` twice; `content/projects/` has 21 files → 42 cards.
- `app/page.tsx:111,127` — `motion-reduce:animate-none` **is already present**.
- `lib/markdown.ts:88` — `fullArticleLink = ${urlPrefix}/entry/${slug}` → a **route**, never an image.
- `app/page.tsx:117,133` — `imageUrl={article.fullArticleLink}` → passes a route into an image prop (latent bug).
- `components/ProjectTeaser/ProjectTeaser.tsx:20,28-35` — `imageUrl` declared, destructured, **never rendered**.
- `app/page.tsx:86-93` — hero `Image` is `hidden … xl:block`, no `priority`.
- `app/layout.tsx:35` — `<html className={`${inter.className} dark`}>` hardcodes dark.
- `next.config.mjs` — CSP header is `Content-Security-Policy-Report-Only` (not enforced), includes `script-src 'self' 'unsafe-inline'`.
- `tsconfig.json:5` — `"target": "es5"`.
- `app/blog/entry/[slug]/page.tsx:39`, `app/projects/entry/[slug]/page.tsx:39` — `prose prose-lg max-w-none` inside a `max-w-3xl` wrapper.
- `app/contact/page.tsx` — inputs have `id`, errors have `id="name-error"`, but no input carries `aria-describedby`/`aria-invalid`; validation fires only on submit.
- `package.json:44` — `@vercel/otel` present; no `instrumentation.ts` in repo → dead dep.
- `e2e/` actually contains 7 specs (`contact`, `dark-mode`, `interactions`, `responsive`, `home`, `static-routes`, `dynamic-content`) — AGENTS.md R24.1's "example.spec.ts / minimal" is stale.

---

## Attacks on critic-legacy (design)

**R-L1 — "Zero brand identity" is a mislabelled UX/code audit; it never answers the actual brief. [high]**
Every prescription legacy offers (case studies, OG images, proof, CTA semantics, IA) is content/UX/code hygiene. The user asked for a *visual restyle* ("peak web design agency… ancient Rome with a modern twist"). Legacy diagnoses the symptom ("generic Flowbite/Tailwind template") but proposes no visual language — no type, color, surface, motion system. Under this brief, legacy is the most thorough auditor and the least useful designer. It should be re-tagged "content & UX audit", not "design".

**R-L2 — Direct contradiction with critic-tech on the hero. [high]**
Legacy demands a richer, branded hero with proof and a better portrait; critic-tech demands server-first, fewer client surfaces, and (per perf) LCP discipline. A decorated hero with a portrait, motion, and a custom webfont is the single biggest LCP/CLS surface on the page. Neither legacy nor tech reconciles "branded hero" with "LCP priority" — and neither names who wins. Shipping both unmerged = a slow "agency-looking" site.

**R-L3 — WCAG citation is imprecise and therefore the fix is wrong. [medium]**
Legacy says the marquee is "an antipattern (WCAG 2.2.2, duplicates /projects)". 2.2.2 requires a *pause/stop/hide* mechanism for content moving automatically — reduced-motion handling does not satisfy it. Meanwhile the duplicate focusable clones are a 2.4.3 (focus order) problem. Legacy fuses two distinct failures into one citation; the correct remediation is: remove the marquee entirely (curated grid), not "add motion-reduce" (already present at `page.tsx:111,127`).

**R-L4 — "imageUrl declared but never rendered" understates the cost. [medium]**
Correct observation (`ProjectTeaser.tsx:20,28-35`), but legacy treats it as a render bug. It is a **content-model gap**: `app/page.tsx:117` passes `article.fullArticleLink` (a route, `lib/markdown.ts:88`) into `imageUrl`, so there is no image field in the schema at all. Fixing it means extending the Zod frontmatter schema in `lib/markdown.ts`, migrating 21 Markdown files, and sourcing 21 images. Legacy's framing hides a multi-hour content+code change behind a "render it" verb.

**R-L5 — "prose max-w-none → 90+ char lines" is real but the proposed fix collides with the Rome concept. [medium]**
Confirmed at `app/blog/entry/[slug]/page.tsx:39` and `app/projects/entry/[slug]/page.tsx:39`: `prose-lg max-w-none` cancels the parent `max-w-3xl`. But legacy offers no measure system. Rome "carved" long-form wants a *deliberate* measure (55–75ch). Simply deleting `max-w-none` re-centers content and deletes the wide editorial feel; the right fix is a tokenized `max-w-prose` with a tracked-display/loose-body pairing — which legacy doesn't have.

**R-L6 — Ignores the dead-token bug it claims to care about. [medium]**
Legacy's "class-string drift" is vague. The concrete instance is `components/Tooltip/Tooltip.tsx:5`: `font-open-sans`, `text-2xs`, `rounded-0.5md` are **not in `tailwind.config.js`**. Every tech-icon tooltip on every project card is silently mis-styled. A design critic that lists "class-string drift" without finding the three broken classes in the one custom primitive has not finished the audit.

---

## Attacks on critic-tech (Next.js architecture)

**R-T1 — "Kill Flowbite" is a small-file-count / large-surface trap. [critical]**
Tech's justification ("only 6 importing files") is the classic refactor underestimate. Flowbite owns `Navbar` + `DarkThemeToggle` (`components/Header/Header.tsx:3-4`), `Card` (`ProjectTeaser.tsx:1`), `Alert` (`app/contact/page.tsx:2`), `Breadcrumb` (both entry pages), `Tooltip` patterns, and the `primary-*` scale contract (`DESIGN.md:22,52-53`). Radix (installed) provides none of Card/Navbar/Breadcrumb — so "use Radix" means hand-building accessible equivalents plus Storybook stories plus e2e updates, then re-validating R15.1–R15.4. That is net-new component work, not a swap.

**R-T2 — Contradiction with critic-legacy over the same primitives. [high]**
Legacy wants to *fix* the Flowbite Card (render images, outcomes, badges); tech wants it *gone*. Two mutually exclusive migrations on the same files with no proposed sequencing. Whichever lands second invalidates the first's tests. There is no decision owner in either brief.

**R-T3 — Security framing is backwards; the real dead code was missed. [high]**
Tech says "CSP relies on 'unsafe-inline'". In fact `next.config.mjs` ships `Content-Security-Policy-**Report-Only**` — it enforces **nothing** today. The finding is "CSP is not enforced at all (and would need nonces before it can be)", not "it uses unsafe-inline". Separately, `package.json:44` lists `@vercel/otel` with no `instrumentation.ts` in the repo — a dead dependency tech's dependency audit should have caught and didn't.

**R-T4 — "Tokens → CSS custom properties" reinvents Tailwind v4 while refusing it. [medium]**
Tech says "stay on v3, not v4". Reasonable on cost — but then recommends hand-rolling CSS custom properties for tokens, which is precisely the v4 `@theme` model. If the plan is a full brand restyle (custom display serif, new palette, motion tokens), v3 + hand-rolled vars is *more* custom infrastructure than upgrading. The recommendation is internally inconsistent; it optimizes for migration pain now at the cost of the actual restyle.

**R-T5 — `target: es5` is overstated as a defect. [medium]**
`tsconfig.json:5` is es5, true, but `noEmit: true` and Next/SWC transpile the app; the target mostly affects typechecker emit expectations. It is not the browser-compat/perf bug tech implies. Fix it, but don't rank it alongside real architecture issues.

**R-T6 — Framer-motion "3 surfaces only" contradicts perf's INP budget and legacy's interaction asks. [medium]**
Tech greenlights LazyMotion on three surfaces; legacy wants micro-interactions everywhere; perf flags "more complex interactions" as the top INP risk and demands a budget. Tech never states which three surfaces, never sets a JS budget, and never reconciles with perf. This is a coordination gap that will surface as a CI failure at integration time.

---

## Attacks on critic-content (content/IA)

**R-C1 — The Rome IA map is the exact costume cliché and it breaks routing/SEO. [critical]**
"Forum=home, Via Appia=how-I-build, Legions=team/Layzr, Colosseum=projects, Triumph arch=timeline, Tabularium=blog" converts the brand into navigation skins. This violates R15.13 (URLs must be human-readable, stable, deep-linkable) and destroys SEO equity in existing paths (`/blog`, `/projects`, `/about`). It is also internally inconsistent: there is no "how-I-build" or "team" page, and LAYZR has **no content file** (see R-C2). This is the cliché my Round 1 explicitly warned against — critic-content proposed it while criticising generic design.

**R-C2 — "Latest Project: LAYZR.gg" is a content gap that invalidates C's own IA. [critical]**
C correctly notes the hardcode (`app/page.tsx:53-60`) and that `content/projects/` stops at 2021 (last file `2021-skinshark-nft-minecraft-skin-trading.md`). But C then builds an IA on "Legions=team/Layzr" — depending on the very content that doesn't exist. Worse: LAYZR.gg is a real company; publishing founder-year metrics/testimonials may require clearance, and C lists "testimonials" without noting the consent/legal step. C's own plan is blocked on content it hasn't costed.

**R-C3 — Newsletter contradicts the site's no-tracking, static architecture. [high]**
C offers "RSS not newsletter" then treats newsletter as viable. The site is statically exported with no DB and deliberately no telemetry (R15.11, README). A newsletter needs an ESP → third-party script/embeds → tracking risk and a consent surface. RSS is the only correct answer for static; presenting newsletter as an option is scope-creep against the project's core privacy posture.

**R-C4 — 4-act narrative + testimonials + case-study template is a content project, not a "2026 restyle". [high]**
C's proposals require authoring (founder story 2021–2024, metrics, testimonials, services). None of that is design or code; it is a months-long content initiative. Bundling it into the restyle guarantees the restyle ships either late or half-done. It also contradicts critic-legacy's own admission that content is stale — you cannot restyle your way to credibility.

**R-C5 — Impressum/Datenschutz is a P0 legal blocker buried as a bullet. [high]**
C mentions "No Impressum/Datenschutz (German legal risk)" in one clause. For a German, business-purpose site this is a legal requirement independent of any redesign and should gate launch. Under the Rome concept it also creates a concrete design constraint: legal pages must remain high-contrast, plain, and readable — Roman "carved" light-on-travertine styling must never be applied to legal text (WCAG contrast trap). C neither escalates the severity nor connects it to the design system.

**R-C6 — "IA missing Services/Case Studies/Now/Press" ignores the single-page personal-portfolio reality. [medium]**
A solo static portfolio does not need Press/Now/Services as top-level IA; adding them multiplies empty pages, which is worse than a lean site. C is importing an agency-site sitemap onto a personal site — the same "agency" aspiration the user used, but executed as scope, not craft.

---

## Attacks on critic-perf (perf/a11y)

**R-P1 — The logo finding is right but under-scoped; the OG asset is the bigger half. [high]**
`Header.tsx` renders `logo.png` (**81,810 bytes**, `public/img/logo.png`) at `h-6 w-6`/`h-9 w-9`. True. But the same 512×512 asset is reused as the OG image on home (`app/page.tsx:23-27`), about (`app/about/page.tsx:20-24`), and both entry pages (`app/blog/entry/[slug]/page.tsx`, `app/projects/entry/[slug]/page.tsx`) into `summary_large_image` 1200×630 slots. The fix is not "resize the logo" — it is a second, purpose-built 1200×630 OG asset plus a metadata refactor across ≥4 files. P undercounts the work.

**R-P2 — "42 cards → INP" undercounts the actual client cost, and the real culprit is the Tooltip Provider. [high]**
Each project card renders one `RadixTooltip.Provider` per technology icon (`ProjectTeaser.tsx:57-70` → `Tooltip.tsx` wraps `RadixTooltip.Provider` around every single tooltip). 42 cards × ~3–5 icons ≈ 120–200 provider trees, all client. P blames "42 cards" generically; the multiplier is the per-icon provider. The fix is one shared Provider at an island root, not "reduce cards". P's diagnosis is directionally right, mechanically wrong.

**R-P3 — "Hero not prioritized → LCP" is imprecise and the suggested fix is wrong on mobile. [medium]**
The hero image is `hidden … xl:block` (`app/page.tsx:86`); it is not in the layout (and often not the LCP) below `xl`. Adding `priority` blanket-style would preload an image that mobile never displays, wasting the critical path. P must scope the recommendation to `xl+` and confirm the actual LCP element per breakpoint before touching it.

**R-P4 — Theme-flash root cause is misstated; the real bug is the hardcoded `dark` class. [medium]**
P says the flash is due to `"dark"` on `<html>` *and* the script in `<body>`. The script (`app/layout.tsx:37-69`) is a synchronous inline script that runs before main content paints; the definite SSR bug is `className={`${inter.className} dark`}` at `app/layout.tsx:35`, which forces dark server HTML and then strips it for light users → FOUC for light-mode first paint. P and critic-tech both propose fixes (next-themes) without acknowledging they overlap; duplicate work risk.

**R-P5 — No sequencing means perf's wishlist loses to legacy's richer pages. [high]**
P recommends axe-core, budgets, image formats, and tooling, but gives no phase plan. Meanwhile legacy adds proof/CX, content adds narrative/testimonials, tech adds framer-motion — all of which *increase* JS/CSS/requests. Without a frozen baseline + budget gate landing **before** the restyle, P's own metrics will be violated at integration and there will be no regression signal. P is a measurement platform, not a plan.

**R-P6 — Ignores the already-existing test surface it could have leveraged. [medium]**
`e2e/` already has `contact.spec.ts`, `dark-mode.spec.ts`, `interactions.spec.ts`, `responsive.spec.ts` — not "minimal example.spec.ts" as AGENTS.md R24.1 claims. P asks for reduced-motion and axe tests but doesn't note that a form-a11y spec and a dark-mode spec already exist to extend (R8.2: prefer extending over parallel tests). P also misses that `app/contact/page.tsx` errors are unlinked (`id="name-error"` exists but no `aria-describedby`/`aria-invalid` on inputs) — a concrete a11y defect under P's own domain that legacy found first.

---

## Cross-cutting themes where I AGREE with a rival

**AGREE-1 — Marquee must die; replace with a curated grid (legacy + perf + content).**
Legacy (antipattern), perf (42 client nodes / focus duplication), and content (uncured 21-project list incl. 2010 LEGO) converge on the same object. This is the highest-confidence, lowest-compromise change in the whole review — and it *serves* the Rome concept: a curated set of 3–5 "monuments" reads as far more imperial than an infinite scroll strip. My Round-1 "monumentality = restraint" and their "curate, don't dump" are the same argument from opposite ends.

**AGREE-2 — Fix the image pipeline before adding any Roman texture (tech + perf + content).**
Tech (next/image formats/AVIF/TTL — note `next.config.mjs` sets no `formats`), perf (LCP/CLS/dimensions), and content (no real project imagery exists) all point at the same truth: the site cannot currently render a single project image. Any marble/travertine/grain asset must flow through the fixed pipeline (self-hosted, sized, AVIF/WebP) or the Rome concept becomes a performance liability. I concede Round-1's grain/marble must be CSS/SVG, never a raster texture, precisely for this reason.

---

## Defending the Rome concept

Against "cliché": the critics attacking Rome-by-props are attacking an execution I already rejected. Critic-content's Forum/Colosseum map (R-C1) is the costume; my Round-1 explicitly banned it. Critic-legacy's "generic template" is the *absence* of brand, and Rome-as-engineering is the differentiating positioning that fills it. The Vitruvian triad (firmitas / utilitas / venustas = durability / utility / beauty) is not a costume — it is literally the value proposition of a developer-turned-entrepreneur: systems that last, do their job, and are well made. That is sharper differentiation than another blue-and-white dev portfolio.

Against "overreach": the Rome layer I proposed is *additive and thin* — one display face, one palette, one motion easing — layered on the existing Inter/blue bones. It does not require killing Flowbite (unlike critic-tech) nor renaming routes (unlike critic-content). It is the lowest-scope way to satisfy "peak agency, ancient Rome, modern twist".

## Self-attack — where my Rome concept is genuinely weak

**S-A1 — Custom display serif adds webfont cost against perf's constraints. [high]**
Adding Fraunces/Newsreader on top of Inter (`app/layout.tsx:8`) is a second font family. If self-hosted via `next/font` with subsetting + `display: swap`, cost is manageable; if not, it is an FCP/bundle regression. My Round-1 did not budget this and critic-perf is right to demand numbers. Mitigation: one variable face, latin subset, weights limited to two.

**S-A2 — Travertine + tracked small-caps is an accessibility trap. [high]**
Light travertine surfaces (`#F4F1EA`/`#E8E2D6`) with muted text, plus wide-tracked uppercase display (0.15–0.25em), both hurt legibility and contrast — exactly the WCAG 2.2 AA target (R15.2). My own palette must be validated for 4.5:1 on every pairing before it ships; decorative "carved" text must never carry essential information.

**S-A3 — "Monumentality" can read as slow and empty. [medium]**
Low density, large whitespace, and 900ms motion are the aesthetic perf and content warn about from the other side. If the restyle increases whitespace without adding substance, it looks expensive but feels hollow. My concept depends on content (proof/metrics) that critic-content correctly says is missing. **Brand cannot rescue an empty content model** — I concede this to legacy/content.

**S-A4 — Rome may be the wrong register for a solo German developer. [medium]**
"Imperial" risks reading grandiose for a one-person portfolio. The defensible framing is "engineered calm / civic infrastructure", not "empire". If any prop (laurel/bust/gold/SPQR) leaks into implementation, the concept collapses into comedy and undercuts the "reliable systems" promise. The concept's safety margin is thinner than I presented in Round 1.

**S-A5 — The concept is not testable by the existing CI. [medium]**
Nothing in `.forgejo/workflows/check.yml` can verify "monumental" or "not a costume". The concept's success is an editorial/human call (R7.6, R15.16). To be agent-executable it must be reduced to checkable proxies: contrast AA pass, reduced-motion pass, one display family, banned-ornament lint (grep for `laurel|bust|spqr|gold`). Without that, "Rome" is an aspiration, not a spec.
