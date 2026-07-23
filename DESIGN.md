# TomSegbers.de Design System

## 1. Atmosphere & Identity

Warm, Roman-inspired portfolio surface with Pompeian-red action color and
marble-to-warm-charcoal contrast. Signature is restrained content-first
hierarchy: warm marble surfaces, warm gray supporting text, and Pompeian red
reserved for links, calls to action, and focus.

The site evokes Roman materiality — travertine warmth, aged terracotta,
carved inscription headings — without literal ancient-Rome theming.
Every surface decision asks: does this feel warm, grounded, and
deliberate?

## 2. Color

### Palette

| Role                   | Tailwind token            | Light     | Dark      | Usage                                                          |
| ---------------------- | ------------------------- | --------- | --------- | -------------------------------------------------------------- |
| Primary surface        | `surface` / `marble`      | `#F5F0E6` | `#1C1917` | Page backgrounds (warm marble)                                 |
| Muted surface          | `surface-muted`           | `#EEE7DA` | `#292524` | Section and hover surfaces                                     |
| Elevated surface       | `surface-elevated`        | `#FFFCF6` | `#292524` | Cards and overlays                                             |
| Foreground             | `foreground` / `charcoal` | `#2A2017` | `#F5F0E6` | Headings and primary text (warm charcoal)                      |
| Muted foreground       | `foreground-muted`        | `#625B54` | `#C8C1B5` | Supporting text and metadata                                   |
| Accent                 | `accent` / `pompeian`     | `#A82A38` | `#A82A38` | Links, CTAs, focus rings (Pompeian red)                        |
| Accent hover           | `accent-hover`            | `#8B202D` | `#D57E8B` | Link/button hover                                              |
| Accent soft            | `accent-soft`             | `#F1CDD2` | `#4B0F18` | Badges, soft backgrounds                                       |
| Accent soft foreground | `accent-soft-foreground`  | `#6F1723` | `#E4A8B1` | Text on soft backgrounds                                       |
| Muted                  | `muted`                   | `#625B54` | `#C8C1B5` | General muted text                                             |
| Border                 | `border`                  | `#D7CFC1` | `#4B4540` | Inputs and dividers                                            |
| Border subtle          | `border-subtle`           | `#E6DED1` | `#292524` | Light separators                                               |
| Decorative gold        | `gold`                    | `#C9A34F` | `#C9A34F` | Rules, dividers, icon strokes only — never text or backgrounds |

The `primary-50` through `primary-900` scale maps to the Pompeian-red
gradient:

| Key           | Hex                           |
| ------------- | ----------------------------- |
| `primary-50`  | `#F9E8EA`                     |
| `primary-100` | `#F1CDD2`                     |
| `primary-200` | `#E4A8B1`                     |
| `primary-300` | `#D57E8B`                     |
| `primary-400` | `#C55B6A`                     |
| `primary-500` | `#B73C4D`                     |
| `primary-600` | `#A82A38` ← accent / Pompeian |
| `primary-700` | `#8B202D` ← accent-hover      |
| `primary-800` | `#6F1723`                     |
| `primary-900` | `#4B0F18`                     |

### Rules

- Use semantic tokens (`accent`, `surface`, `foreground`, `border`) for
  custom presentation.
- Retain `primary-*` on Flowbite-owned or Flowbite-pattern utilities.
- Gold is decorative-only. Never use `text-gold`, map it to a text
  foreground role, or use it as a CTA/background color; its contrast is
  intentionally insufficient for text.
- Apply dark variants through the token's `-dark` shade; dark mode
  remains class-based (`dark:` prefix).

## 3. Typography

| Level        | Utility                      | Font        | Usage                                     |
| ------------ | ---------------------------- | ----------- | ----------------------------------------- |
| H1           | `text-h1`, `text-h1-sm`      | Cinzel      | Page display headings                     |
| H2           | `text-h2`, `text-h2-sm`      | Cinzel      | Section display headings                  |
| H3           | `text-h3`, `text-h3-sm`      | Inter       | Card headings                             |
| H4           | `text-h4`                    | Inter       | Sub-headings                              |
| Article body | `font-body`                  | EB Garamond | Prose and long-form paragraphs only       |
| UI body      | `font-sans`                  | Inter       | UI text, buttons, nav, metadata, captions |
| Small        | `text-small`, `text-caption` | Inter       | Metadata and labels                       |

- **Display headings:** `font-heading` → Cinzel, weights 400/600/700.
  Apply only to h1 and h2 display headings; never to body copy, buttons,
  navigation, metadata, or card headings.
- **Long-form body:** `font-body` → EB Garamond, weights 400/500. Apply only
  to article prose and long-form paragraph content.
- **UI text:** `font-sans` → Inter, weights 400/500/600. This is the body
  default for navigation, controls, labels, metadata, and captions.
- **Code:** system monospace only: `ui-monospace, SFMono-Regular, Menlo,
monospace`; no fourth web font.
- All three web fonts are loaded through `next/font/google` with
  `display: "swap"`, Latin subsets, preload, and CSS variables in the root
  layout. `Cinzel Decorative` is forbidden.

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

### Project collection

- **Structure:** project cards render as an ordered semantic list. Mobile uses
  a native horizontal scroll container with `snap-x snap-mandatory`; each
  card occupies the collection content width and snaps as a whole. Desktop
  changes the same list to a responsive grid.
- **States:** native scroll obeys reduced-motion preferences without custom
  animation. Card and anchor hover/focus states remain token-driven.
- **Accessibility:** list items retain real project links in normal tab order;
  no duplicate cards, masks, edge guards, or autoplaying tracks obscure copy.

## 6. Motion & Interaction

Motion uses [Motion](https://motion.dev/) (formerly Framer Motion) via
the `motion/react` package. Key animations:

| Pattern           | Implementation                                                                                   | Purpose                                              |
| ----------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Hero stagger      | `motion.div` with `staggerChildren` on the hero section                                          | Introduces heading + subtitle with sequenced fade-up |
| Page reveal       | `motion.div` wrapper with `initial={{ opacity: 0, y: 20 }}` and `animate={{ opacity: 1, y: 0 }}` | Smooth page entry transitions                        |
| Card hover spring | `whileHover={{ scale: 1.02 }}` with `spring` transition on teaser cards                          | Subtle lift on hover                                 |

Project collections use native scroll-snap at narrow widths and responsive
CSS grids at wider widths. They do not use an autoplaying track or custom
motion, so all readable card content remains whole at collection boundaries.

All animations respect `prefers-reduced-motion` — wrap motion in
`motion-safe:` variants or configure Motion's
`useReducedMotion` hook.

## 7. Depth & Surface

Mixed strategy: Flowbite cards retain their shadow treatment; page and
section backgrounds use semantic surface tonal shifts. The warm marble
palette creates depth through subtle warmth gradients rather than heavy
drop shadows — lighter sections (`surface`) sit behind elevated cards
(`surface-elevated`) to create natural separation without harsh borders.
