# TomSegbers.de Design System

## 1. Atmosphere & Identity

Warm, Roman-inspired portfolio surface with terracotta action color and
marble-white-to-warm-charcoal contrast. Signature is restrained
content-first hierarchy: warm marble surfaces, warm gray supporting
text, and terracotta reserved for links, calls to action, and focus.

The site evokes Roman materiality — travertine warmth, aged terracotta,
carved inscription headings — without literal ancient-Rome theming.
Every surface decision asks: does this feel warm, grounded, and
deliberate?

## 2. Color

### Palette

| Role | Tailwind token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Primary surface | `surface` | `#FAF9F6` | `#1C1917` | Page backgrounds (warm marble) |
| Muted surface | `surface-muted` | `#F5F0E8` | `#292524` | Section and hover surfaces |
| Elevated surface | `surface-elevated` | `#FFFFFF` | `#292524` | Cards and overlays |
| Foreground | `foreground` | `#1C1917` | `#FAF9F6` | Headings and primary text (warm charcoal) |
| Muted foreground | `foreground-muted` | `#78716C` | `#A8A29E` | Supporting text and metadata |
| Accent | `accent` | `#C2410C` | `#E85D3A` | Links, CTAs, focus rings (terracotta) |
| Accent hover | `accent-hover` | `#9A3412` | `#F48062` | Link/button hover |
| Accent soft | `accent-soft` | `#FDE4DA` | `#431407` | Badges, soft backgrounds |
| Accent soft foreground | `accent-soft-foreground` | `#7C2D12` | `#F8A48C` | Text on soft backgrounds |
| Muted | `muted` | `#78716C` | `#A8A29E` | General muted text |
| Border | `border` | `#D6D3D1` | `#44403C` | Inputs and dividers |
| Border subtle | `border-subtle` | `#E7E5E4` | `#292524` | Light separators |

The `primary-50` through `primary-900` scale maps to the terracotta
gradient:

| Key | Hex |
| --- | --- |
| `primary-50` | `#FEF2EE` |
| `primary-100` | `#FDE4DA` |
| `primary-200` | `#FBC8B6` |
| `primary-300` | `#F8A48C` |
| `primary-400` | `#F48062` |
| `primary-500` | `#E85D3A` |
| `primary-600` | `#C2410C` ← accent |
| `primary-700` | `#9A3412` ← accent-hover |
| `primary-800` | `#7C2D12` |
| `primary-900` | `#431407` |

### Rules

- Use semantic tokens (`accent`, `surface`, `foreground`, `border`) for
  custom presentation.
- Retain `primary-*` on Flowbite-owned or Flowbite-pattern utilities.
- Apply dark variants through the token's `-dark` shade; dark mode
  remains class-based (`dark:` prefix).

## 3. Typography

| Level | Utility | Font | Usage |
| --- | --- | --- | --- |
| H1 | `text-h1`, `text-h1-sm` | Cinzel | Page headings |
| H2 | `text-h2`, `text-h2-sm` | Cinzel | Section headings |
| H3 | `text-h3`, `text-h3-sm` | Cinzel | Card headings |
| H4 | `text-h4` | Inter / Cinzel | Sub-headings |
| Body | `text-body`, `text-body-lg` | Inter | Paragraphs |
| Small | `text-small`, `text-caption` | Inter | Metadata and labels |

- **Headings:** `font-heading` → Cinzel (serif, small caps feel,
  classical inscription weight). Applied via the `font-heading` utility
  or explicit `font-family: Cinzel, serif`.
- **Body:** `font-body` / `font-sans` → Inter (clean, modern readability).
  Inter remains the default sans-serif stack for body text, UI labels,
  and metadata.
- Cinzel is loaded via `next/font/google` in the root layout and applied
  to all heading elements through the typography scale tokens.

## 4. Spacing & Layout

Base unit: 4px. Tailwind's default spacing scale is source of truth.
Public-route content wrappers use `mx-auto max-w-screen-xl px-4 sm:px-6`;
page sections use `py-8 sm:py-16 lg:py-24`. Headers narrow with
`max-w-screen-sm` or `max-w-3xl`; article detail content narrows with
`max-w-3xl`. Listing grids use `gap-8`; compact card internals retain
their existing `gap-4`. Full-bleed surfaces sit outside content wrappers,
never use viewport-width translation utilities.

## 5. Components

### Flowbite primitives

- **Structure:** Navbar, Card, Breadcrumb, Tooltip, and form patterns
  from Flowbite React.
- **Color:** retain full `primary-*` scale for Flowbite compatibility.
  The terracotta scale replaces the old blue scale.
- **States:** Flowbite default, hover, focus, disabled, dark-mode states
  remain unchanged.

### Custom teasers and links

- **Structure:** headings, metadata, descriptions, and links built with
  semantic color tokens.
- **States:** custom anchors, buttons, cards, and social controls use
  `transition-colors duration-200`; links gain an underline or
  accent-color hover state, and cards may use
  `motion-safe:hover:-translate-y-1` without layout changes.
- **Focus:** custom focusable controls use
  `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:focus-visible:ring-accent-soft-dark`;
  primary Flowbite-pattern CTAs retain their compatible `primary-*`
  focus rings.
- **Accessibility:** foreground/muted contrast preserved at WCAG AA
  minimum (4.5:1 for body text, 3:1 for large text).

## 6. Motion & Interaction

Motion uses [Motion](https://motion.dev/) (formerly Framer Motion) via
the `motion/react` package. Key animations:

| Pattern | Implementation | Purpose |
| --- | --- | --- |
| Hero stagger | `motion.div` with `staggerChildren` on the hero section | Introduces heading + subtitle with sequenced fade-up |
| Page reveal | `motion.div` wrapper with `initial={{ opacity: 0, y: 20 }}` and `animate={{ opacity: 1, y: 0 }}` | Smooth page entry transitions |
| Card hover spring | `whileHover={{ scale: 1.02 }}` with `spring` transition on teaser cards | Subtle lift on hover |

**Marquees** use `motion-safe:animate-marquee` or
`motion-safe:animate-marquee2` (CSS keyframe animations defined in
`tailwind.config.js`). The `motion-safe:` prefix ensures
`prefers-reduced-motion: reduce` prevents continuous movement while all
links remain usable.

All animations respect `prefers-reduced-motion` — wrap motion in
`motion-safe:` variants or configure Motion's
`useReducedMotion` hook.

## 7. Depth & Surface

Mixed strategy: Flowbite cards retain their shadow treatment; page and
section backgrounds use semantic surface tonal shifts. The warm marble
palette creates depth through subtle warmth gradients rather than heavy
drop shadows — lighter sections (`surface`) sit behind elevated cards
(`surface-elevated`) to create natural separation without harsh borders.
