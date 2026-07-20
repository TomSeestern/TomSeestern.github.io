# TomSegbers.de Design System

## 1. Atmosphere & Identity

Clear, technical portfolio surface with calm white-to-slate contrast and a familiar blue action color. Signature is restrained content-first hierarchy: white or slate surfaces, gray supporting text, and blue reserved for links, calls to action, and focus.

## 2. Color

### Palette

| Role | Tailwind token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Primary surface | `surface` | `#ffffff` | `#111827` | Page backgrounds |
| Muted surface | `surface-muted` | `#f9fafb` | `#1f2937` | Section and hover surfaces |
| Foreground | `foreground` | `#111827` | `#ffffff` | Headings and primary text |
| Muted foreground | `muted` | `#6b7280` | `#9ca3af` | Supporting text and metadata |
| Border | `border` | `#d1d5db` | `#4b5563` | Inputs and dividers |
| Accent | `accent` | `#2563eb` | `#3b82f6` | Custom links and focus affordances |
| Accent hover | `accent-hover` | `#1d4ed8` | `#60a5fa` | Custom link hover affordances |
| Accent soft | `accent-soft` | `#dbeafe` | `#1e3a8a` | Custom badges |

`primary-50` through `primary-900` remain Flowbite-compatible aliases. They map exactly to the established blue scale. `primary-600` equals `accent`; `primary-700` equals `accent-hover`; `primary-100` equals `accent-soft`; `primary-500` equals `accent-dark`.

### Rules

- Use semantic tokens for custom presentation.
- Retain `primary-*` on Flowbite-owned or Flowbite-pattern utilities.
- Apply dark variants through the token's `-dark` shade; dark mode remains class-based.

## 3. Typography

| Level | Utility | Usage |
| --- | --- | --- |
| H1 | `text-h1`, `text-h1-sm` | Page headings |
| H2 | `text-h2`, `text-h2-sm` | Section headings |
| H3 | `text-h3`, `text-h3-sm` | Card headings |
| Body | `text-body`, `text-body-lg` | Paragraphs |
| Small | `text-small`, `text-caption` | Metadata and labels |

Primary font: Inter, ui-sans-serif, system-ui, sans-serif.

## 4. Spacing & Layout

Base unit: 4px. Tailwind's default spacing scale is source of truth. Public-route content wrappers use `mx-auto max-w-screen-xl px-4 sm:px-6`; page sections use `py-8 sm:py-16 lg:py-24`. Headers narrow with `max-w-screen-sm` or `max-w-3xl`; article detail content narrows with `max-w-3xl`. Listing grids use `gap-8`; compact card internals retain their existing `gap-4`. Full-bleed surfaces sit outside content wrappers, never use viewport-width translation utilities.

## 5. Components

### Flowbite primitives

- **Structure:** Navbar, Card, Breadcrumb, Tooltip, and form patterns from Flowbite React.
- **Color:** retain full `primary-*` scale for Flowbite compatibility.
- **States:** Flowbite default, hover, focus, disabled, dark-mode states remain unchanged.

### Custom teasers and links

- **Structure:** headings, metadata, descriptions, and links built with semantic color tokens.
- **States:** custom anchors, buttons, cards, and social controls use `transition-colors duration-200`; links gain an underline or accent-color hover state, and cards may use `motion-safe:hover:-translate-y-1` without layout changes.
- **Focus:** custom focusable controls use `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:focus-visible:ring-accent-soft-dark`; primary Flowbite-pattern CTAs retain their compatible `primary-*` focus rings.
- **Accessibility:** foreground/muted contrast preserved from existing gray palette.

## 6. Motion & Interaction

Motion honors current Tailwind behavior and uses composited properties where animation exists. Marquees use `motion-safe:animate-marquee` or `motion-safe:animate-marquee2`, so `prefers-reduced-motion: reduce` prevents continuous movement while all links remain usable.

## 7. Depth & Surface

Mixed strategy: Flowbite cards retain their shadow treatment; page and section backgrounds use semantic surface tonal shifts. No new depth recipes introduced by this token migration.
