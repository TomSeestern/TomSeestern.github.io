# TomSegbers.de Design System

## 1. Atmosphere & Identity

A single light mode built on warm parchment. Ink-dark text sits on an unbleached,
paper-like surface; two warm accents — terracotta and a deep oxblood/wine — carry
action and secondary emphasis. The signature is restrained, content-first
hierarchy: warm surfaces, warm-grey supporting text, and accent colour reserved for
links, calls to action, focus affordances, and the second accent's editorial
metadata. There is no dark mode and no cool-toned hue anywhere in the palette.

## 2. Color

### Palette

All values live in `tailwind.config.js` under `theme.extend.colors`. The semantic
token names are stable — components reference them and do not embed raw values.

| Role                | Tailwind token               | Value     | Usage                                        |
| ------------------- | ---------------------------- | --------- | -------------------------------------------- |
| Primary surface     | `surface`                    | `#F5EFE1` | Page backgrounds — warm parchment            |
| Muted surface       | `surface-muted`              | `#EDE4D1` | Section, card-hover, and inset surfaces      |
| Elevated surface    | `surface-elevated`           | `#FBF7EE` | Raised panels above parchment                |
| Foreground (ink)    | `foreground`                 | `#1B1B1F` | Headings and primary body text               |
| Muted foreground    | `foreground-muted` / `muted` | `#5C5548` | Supporting text and metadata (warm grey)     |
| Border              | `border`                     | `#D8CDB6` | Dividers and boundaries (decorative)         |
| Border subtle       | `border-subtle`              | `#E6DDCB` | Low-contrast internal rules                  |
| Accent (terracotta) | `accent`                     | `#A63D28` | Links, accent-as-text, solid CTA background  |
| Accent hover        | `accent-hover`               | `#7F2E1E` | Link hover, CTA hover background             |
| Accent light        | `accent-light`               | `#A63D28` | Filled button surface (Button primary)       |
| Accent soft         | `accent-soft`                | `#BE6A50` | Focus-ring halo and badge chip background    |
| Accent soft fg      | `accent-soft-foreground`     | `#1F0F0A` | Badge chip label; CTA hover background       |
| Second accent       | `accent-secondary`           | `#5E2130` | Deep oxblood/wine — secondary accent as text |
| Second accent hover | `accent-secondary-hover`     | `#471824` | Second-accent hover                          |

`primary-50` through `primary-900` remain Flowbite-compatible aliases and now map
to the warm terracotta ramp (`primary-600` = `accent` = `#A63D28`,
`primary-700` = `accent-hover`, `primary-500` = `accent-dark`, `primary-100` =
`accent-soft-contrast`). They exist for Flowbite-owned utilities and the retained
Flowbite `Card`; custom presentation should use the semantic tokens above.

### Rules

- Use semantic tokens for custom presentation; retain `primary-*` only for
  Flowbite-owned or Flowbite-pattern utilities.
- The site ships one light mode. The `-dark` token values remain resolvable so the
  dormant `dark:*` utilities still compile, but no code adds the `dark` class and
  no dark surface is ever shown. Their values are warm toned for consistency.
- Never introduce a cool-toned (non-warm) hue. Every token above is warm.
- `border` / `border-subtle` are decorative rules and are exempt from the WCAG
  1.4.11 non-text minimum; interactive boundaries (focus rings, accent borders)
  are not, and are contrast-gated.

## 3. Typography

| Level | Utility                      | Usage               |
| ----- | ---------------------------- | ------------------- |
| H1    | `text-h1`, `text-h1-sm`      | Page headings       |
| H2    | `text-h2`, `text-h2-sm`      | Section headings    |
| H3    | `text-h3`, `text-h3-sm`      | Card headings       |
| Body  | `text-body`, `text-body-lg`  | Paragraphs          |
| Small | `text-small`, `text-caption` | Metadata and labels |

Primary font: Inter, ui-sans-serif, system-ui, sans-serif. (The two-font carved
identity is owned by T14.)

## 4. Spacing, Measure & Layout

Base unit: 4px. Tailwind's default spacing scale is source of truth.

Reading widths are **measure tokens** defined as Tailwind `maxWidth` entries (not
CSS custom properties), so every page shares one vertical rhythm instead of ad-hoc
`max-w-*` values:

| Token             | Class                   | Value   | Usage                        |
| ----------------- | ----------------------- | ------- | ---------------------------- |
| `measure-article` | `max-w-measure-article` | `66ch`  | Long-form Markdown body text |
| `measure-lead`    | `max-w-measure-lead`    | `46ch`  | Lead paragraphs and intros   |
| `measure-card`    | `max-w-measure-card`    | `38ch`  | Card and teaser copy         |
| `measure-display` | `max-w-measure-display` | `20ch`  | Display headlines            |
| `width-page`      | `max-w-width-page`      | `78rem` | Full page content wrapper    |

Public-route content wrappers use `mx-auto max-w-screen-xl px-4 sm:px-6`; page
sections use `py-8 sm:py-16 lg:py-24`. Listing grids use `gap-8`; compact card
internals retain their existing `gap-4`. Full-bleed surfaces sit outside content
wrappers and never use viewport-width translation utilities.

## 5. Components

### Flowbite primitives

- **Structure:** Navbar, Card, Breadcrumb, and form patterns from Flowbite React.
- **Color:** the full `primary-*` scale maps to the warm terracotta ramp for
  Flowbite compatibility.
- **States:** Flowbite default, hover, and focus states remain; dark-mode states
  are dormant (single light mode).

### Custom teasers and links

- **Structure:** headings, metadata, descriptions, and links built with semantic
  color tokens.
- **States:** custom anchors, buttons, cards, and social controls use a
  color-only transition (`transition-colors`, `duration-200`); links gain an
  underline or accent-color hover state. For entrances use the `.motion-*`
  primitives in §6 — never an ad-hoc animation.
- **Motif:** the only structural ornament is the 1px vertical column rule in §6.
  No classical (Roman) ornament and no precious-material tokens are permitted;
  `scripts/check-ornaments.mjs` rejects them by name.
- **Focus:** custom focusable controls use
  `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft`;
  the `accent-soft` ring is contrast-gated against parchment so it clears the
  WCAG 1.4.11 3:1 non-text minimum. Primary Flowbite-pattern CTAs retain their
  compatible `primary-*` focus rings.
- **Accessibility:** every text and interactive pair is enforced by the contrast
  gate below, not by eyeballing.

## 6. Motion & Interaction

### Motion rules

"Engineered calm": motion is composited, short, and only ever an entrance or a
state change. An animation is **never** the only signal for an interaction.
Every animation and transition uses **opacity and `translateY` only** — no
`clip-path`, no `backdrop-filter`, and no layout-property animation. There is a
single easing curve and a 200–320 ms duration band.

| Token / primitive    | Value                                  | Usage                                    |
| -------------------- | -------------------------------------- | ---------------------------------------- |
| `ease-calm`          | `cubic-bezier(0.16, 1, 0.3, 1)`        | every custom transition                  |
| `duration-calm-fast` | `200ms`                                | fades                                    |
| `duration-calm`      | `280ms`                                | default                                  |
| `duration-calm-slow` | `320ms`                                | large surface entrances                  |
| `.motion-rise`       | `280ms` opacity + `translateY(0.5rem)` | entrance of a section or card grid       |
| `.motion-fade`       | `200ms` opacity                        | entrance where translation would shift layout |

The `calm-rise` / `calm-fade` keyframes live in `styles/tailwind.css`; the
matching `animate-calm-rise` / `animate-calm-fade` utilities are token-defined
in `tailwind.config.js` and take the same curve and range. Reach for a
primitive, or `motion-safe:animate-calm-*`; never invent a bespoke animation.

### Reduced motion

`prefers-reduced-motion: reduce` is absolute. A global guard in
`styles/tailwind.css` forces every animation and transition to `0.01ms` with a
single iteration (`scroll-behavior: auto`), covering even the Flowbite-owned and
page-owned utilities this token layer does not edit. The `.motion-*` primitives
are additionally wrapped in `prefers-reduced-motion: no-preference`, so they are
inert by construction. The one legacy marquee uses
`motion-reduce:animate-none` and is removed by T16.

### The column-rule motif

The single structural ornament: a **1px vertical column rule** drawn as a plain
CSS border via `.column-rule` (`border-inline-start: 1px solid border`). No
pseudo-element, gradient, or shadow is used. Apply it to a column that must be
separated from the one before it. No other ornament is permitted — the
banned-ornament gate in §8 enforces this.

## 7. Depth & Surface

Mixed strategy: Flowbite cards retain their shadow treatment; page and section
backgrounds use semantic surface tonal shifts. No new depth recipes introduced by
this token migration.

## 8. Contrast Gate Contract

The palette is enforced by an executable, dependency-free gate — not by review:

```bash
node scripts/check-contrast.mjs
```

- `scripts/check-contrast.mjs` computes WCAG 2.x relative-luminance contrast ratios
  (pure JavaScript, zero dependencies) and exits non-zero on any violation.
- `tests/budgets/contrast.json` is the committed manifest. It enumerates **every
  shipping foreground/background pair**, each tagged `text` or `ui`, with the
  minimums `text: 4.5:1` (WCAG 2.2 AA) and `ui: 3:1` (WCAG 1.4.11). The manifest
  is the contract — it describes what the UI actually renders, not the palette in
  the abstract.
- The script prints a per-pair table and fails the run when a `text` pair is below
  4.5:1 or a `ui` pair is below 3:1.

**Token-change rule:** any change to a value in `theme.extend.colors`, or any new
foreground/background combination, must update `tests/budgets/contrast.json` and
pass `node scripts/check-contrast.mjs` before commit. A token that is not in the
manifest is unverified; a pair that fails is not shippable. The gate is the
single source of truth for colour accessibility (R5.2, R15.8).

### Banned-ornament gate

The identity forbids classical ornament and precious-material tokens. This is
also executable, not a convention:

```bash
node scripts/check-ornaments.mjs   # pnpm ornaments
```

`scripts/check-ornaments.mjs` walks the source tree (excluding `node_modules/`,
`.next/`, and `.omo/`) and exits non-zero when any banned term appears as a whole
word in a code, style, config, or markup file. The banned set is the Roman props
(`laurel`, `bust`, `spqr`, `colosseum`, `toga`, `papyrus`) and the `gold` and
`marble` design tokens. Content prose is out of scope — the gate guards shipped
code and tokens. It runs in `check.yml` next to the contrast gate.
