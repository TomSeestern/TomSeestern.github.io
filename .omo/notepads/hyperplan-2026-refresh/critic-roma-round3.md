# critic-roma — Round 3: Defend / Refine / Concede

Evidence computed this round (WCAG 2.1 contrast, node script, no external claim):
| pair | ratio | verdict |
|---|---|---|
| terracotta #B4462F on travertine #F4F1EA | **4.83** | AA text PASS |
| terracotta #B4462F on travertine #E8E2D6 | 4.22 | AA-large only |
| verdigris #4E7A6B on #F4F1EA / #E8E2D6 | 4.31 / 3.77 | non-text only |
| Tyrian #5B2A4A on #F4F1EA | **9.93** | AA text PASS |
| brass #A8894F on #F4F1EA | 2.93 | FAIL (decor only) |
| #2F7BFF on white / #F4F1EA / basalt | 3.89 / 3.45 / 4.57 | text FAIL on light |
| existing #2563eb on white | **5.17** | AA text PASS |
| ink #1B1B1F on #F4F1EA / #E8E2D6 | 15.22 / 13.31 | AA text PASS |
| muted #6b7280 on #F4F1EA | 4.29 | AA-large only |
| Δ euclid #2F7BFF vs #2563eb | **32.8 / 441 (~7%)** | near-neighbour |

---

## Round-3 responses

**1. [legacy L-A1] Tyrian purple contradicts "civic engineering, not empire". → REFINE.**
The attack is correct at the level of *naming and framing*: "Tyrian imperial dye" re-imports the empire thesis I said I was abandoning. But the **color itself** is not the problem (9.93:1 on travertine, the strongest text accent in the palette). Resolution: keep the hue only as an occasional deep-ink/heading alternative, renamed away from "Tyrian/imperial" (call it "oxblood"/"wine"), and demote it below terracotta. Under the one-motif rule it is not a brand accent at all.

**2. [legacy L-A2] #2F7BFF is a near-neighbour of #2563eb → a no-op. → CONCEDE.**
Measured: 32.8/441 ≈ 7% sRGB distance, and #2F7BFF is *less* accessible (3.89 on white) than the current #2563eb (5.17 on white). Adding a second, worse blue is churn with zero brand delta. Drop #2F7BFF. Keep #2563eb as the sole accent; it already meets AA text.

**3. [legacy L-A3] Six signifiers = set-dressing; structural numerals harm scanning. → CONCEDE (six), REFINE (numerals).**
Conceded: six motifs is a moodboard, not a system, and contradicts my own "numeral overload" ban. Drop arches, cage-cup glass, Latin, procedural marble, gold/brass, and Roman numerals as structure. One motif survives (see Final Position): the column as a 1px vertical rule. Numerals, if ever used, are `aria-hidden` decorative eyebrows that never replace a real number, so grep/scan/copy-paste of values is unaffected — but under one-motif they are out.

**4. [legacy L-A4] No art direction for the white-bg studio headshot. → REFINE.**
Accept the gap. Concrete direction: hero becomes **type-led, no portrait** (also removes an LCP surface; confirms perf's playbook). The existing portrait (`public/img/Tom_Segbers_Frontal.webp`, 31KB) moves to About, graded duotone in travertine/basalt, cropped to a plain 4:5 rectangle (no arch mask), no white studio background. In-repo evidence the asset is real and light: `app/page.tsx:89`. Dead 442KB `.jpg` (`public/img/Tom_Segbers_Frontal.jpg`) gets deleted.

**5. [legacy L-A5 / tech T-R3 / perf P-R1] GT Sectra is paid; 3 families +120–200KB; Fraunces "wonky". → CONCEDE (Sectra, 3 families), REFINE (one face).**
GT Sectra was listed as a *paid option*; concede and remove. Narrow to **exactly one** additional face, self-hosted via `next/font` (same mechanism as Inter at `app/layout.tsx:8`), latin subset, two weights, `display: swap`. Default choice: **Newsreader** (variable, disciplined, no wonk axis) rather than Fraunces, which directly answers the "wonky vs rigor" objection. Budget: ≤60KB woff2 for the extra face. If the budget gate cannot be met, drop the serif entirely and use Inter with a carved treatment (uppercase + tracking).

**6. [tech T-R1 / perf P-R2 / content C-R4] Procedural marble (feTurbulence/canvas) is GPU-hostile; cage-cup backdrop-filter forces readback; no fallback. → CONCEDE.**
Drop `feTurbulence`, canvas grain, and every `backdrop-filter`. My Round-1 "vasa diatreta glass" was the weakest idea in the set — it is a render pipeline for a cosmetic effect. Texture reduces to at most one **static** tiled noise asset ≤5KB at ≤4% opacity, or nothing. Marble becomes *flat color + 1px rules*; no texture pipeline.

**7. [tech T-R2 / perf P-R3] 600–900ms clip-path is main-thread repaint, conflicts with INP, no reduced-motion gate. → CONCEDE.**
`clip-path` animation is not a compositor property. Drop it and drop 900ms. Motion becomes opacity + `translateY` only, 200–320ms, `cubic-bezier(0.16, 1, 0.3, 1)`, every instance behind `motion-safe:` (project rule R15.7; the marquee already demonstrates the pattern at `app/page.tsx:111,127`).

**8. [tech T-R4 / perf P-R5] Palette fails AA; no contrast gate. → REFINE (with measurement).**
Half right, half wrong. Measured: terracotta on #F4F1EA is **4.83:1 (PASS)** — legacy's "~3.5" is inaccurate — but on the darker travertine #E8E2D6 it is 4.22 (large only). Verdigris 4.31/3.77 fails text. #2F7BFF fails text. So: adopt a **computed contrast gate in CI**, restrict verdigris/brass to non-text, restrict terracotta text to #F4F1EA only, and keep #2563eb as the single AA-passing accent. The gate is the real deliverable here.

**9. [content C-R1] Metaphor unearnable: 3 posts (one cheesecake), 21 projects frozen 2021, no outcomes. → CONCEDE.**
Correct. Rome cannot be earned by styling an empty corpus. This restyle is **visual only**; content credibility (founder era 2021–2024, outcomes, case-study template) is a separate, blocking-precondition workstream. I will not claim the Rome layer creates credibility.

**10. [content C-R3 / perf P-R4] Anti-cliché list is a moodboard and silently rewrites the DESIGN.md token contract. → REFINE.**
The list is constraints, not a moodboard — but the second half is a fair integration catch. Accepted: every surviving color/type value must be added as semantic tokens in `tailwind.config.js` and reflected in `DESIGN.md` (R5.2, R15.8), never as inline hex. The current token layer is the contract; the restyle edits it explicitly, it does not quietly bypass it.

**11. [content C-R5] Audience/message mismatch + Latin a11y/SEO/translation friction on a German site. → CONCEDE (Latin), REFINE (audience).**
Concede Latin in full: drop FECIT/OPUS/CIVITAS. Plain English UI on an English-copy site avoids `lang`/pronunciation/SEO friction. Audience refined: developer/entrepreneur selling to clients and recruiters — the register is "engineered calm", explicitly not "empire".

**12. [self-attacks S-A1..S-A5] → CONCEDE, folded in.**
All five stand. S-A1 (font cost) → one face, budgeted. S-A2 (travertine/tracked-caps trap) → contrast gate + no decorative essential text. S-A3 (monumental can read empty) → content is a separate blocker (attack 9). S-A4 (imperial register risky for a solo dev) → "engineered calm", no props. S-A5 (not CI-testable) → reduced to checkable proxies: contrast gate, reduced-motion test, one-serif check, banned-token grep.

---

## FINAL POSITION (≤15 lines)

Rome survives only as **"engineered calm"** — structure and restraint, zero Roman props.
1. ONE motif: a 1px vertical **column rule** as the layout grid on travertine/basalt. Pure CSS borders; no arches, numerals, Latin, cage-cup glass, marble, or gold.
2. Typography: keep Inter (`app/layout.tsx:8`) for UI/body; add at most ONE self-hosted variable serif (Newsreader) for H1/H2, latin, 2 weights, `swap`, ≤60KB. Drop GT Sectra and Fraunces.
3. Palette: travertine #F4F1EA, basalt #17181A, ink #1B1B1F, accent #2563eb (5.17:1). Terracotta #B4462F text only on #F4F1EA (4.83:1). Verdigris/brass non-text only. Drop Tyrian, #2F7BFF.
4. Motion: opacity + translateY only, 200–320ms, cubic-bezier(0.16,1,0.3,1), all `motion-safe:`. No clip-path, no 900ms, no backdrop-filter.
5. Texture: at most one static ≤5KB noise tile at ≤4% opacity, or none.
6. Hero is type-led with no portrait; portrait moves to About, duotone travertine/basalt, plain rectangle.
7. All values land as semantic tokens in `tailwind.config.js` + `DESIGN.md` (R5.2/R15.8); no inline hex.
8. Ship gate: computed contrast CI check, reduced-motion test, image pipeline fixed, content-credibility workstream separate and blocking.
9. If the contrast gate or the ≤60KB font budget fails, the Rome layer collapses to "Inter + travertine/basalt + one rule" and that is still a defensible restyle.

## ACCEPTED CONSTRAINTS
- Rome is a thin additive layer, never a rewrite: no Flowbite kill, no route renames, no new render pipeline.
- One motif, one extra font face, one accent color.
- Every color must pass a computed WCAG AA gate before ship; decorative colors never carry text.
- Animation is compositor-only (opacity/transform) and `motion-safe:`-gated.
- No texture/filter pipeline; texture is optional and static.
- Latin dropped; copy is plain English.
- Content credibility is out of scope for the visual layer and is a separate blocker.
- Token changes are explicit edits to `tailwind.config.js` + `DESIGN.md`.

## OPEN DECISIONS
1. Newsreader vs Inter-only-with-carved-treatment — depends on the measured ≤60KB extra-face cost after subsetting.
2. Keep terracotta at all, or run a single-accent (#2563eb) palette — depends on whether the hero needs a second, non-CTA accent.
3. Whether any Roman numeral eyebrow appears at all (aria-hidden, non-substituting) or is fully dropped.
4. Which exact travertine is the default light surface (#F4F1EA vs #E8E2D6) — it changes where terracotta text may be used (4.83 vs 4.22).
5. Whether the vertical rule is decorative-only or also an interaction affordance (e.g. active-section marker) — affects INP budget.
6. Who owns the content-credibility workstream and whether it gates launch.
