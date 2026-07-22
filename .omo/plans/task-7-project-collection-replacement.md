# Task 7 project collection replacement

## TL;DR

Replace duplicated animated project tracks and opaque edge guards with semantic whole-card collection layouts: native CSS scroll-snap at mobile, responsive grid at desktop. Preserve Roman tokens, links, and keyboard semantics. Prove geometry in production browser checks, not guard styles.

## Scope and file ownership

- `app/page.tsx`: Task 7 owner. Replace project marquee markup only.
- `e2e/home.spec.ts`: Task 7 owner. Replace guard-style test with geometry, scroll-snap/grid, and keyboard activation behavior.
- `DESIGN.md`: Task 7 owner. Document responsive project collection primitive; retire marquee description.
- `tailwind.config.js`: Task 7 owner only if dead marquee token cleanup is required after source search.
- `.omo/evidence/task-7-font-system.txt`, `.omo/notepads/roman-redesign/learnings.md`, `.omo/boulders/task-7-visual-closure.md`: append/update Task 7 evidence only.

## Plan

1. Record failure invariant: translated fixed-width tracks must intersect a viewport edge between card boundaries; guards can conceal but cannot make intersecting card copy whole.
2. Update `DESIGN.md` primitive contract before UI code: mobile scroll-snap, desktop grid, semantic list and visible focus states.
3. Replace guard test with failing production-browser behavior test: visible cards bounded within collection viewport; mobile native snap; desktop grid; Tab/Enter project activation.
4. Replace homepage marquee markup with CSS-only list; remove duplicated track and guards; remove dead theme marquee definitions if no use remains.
5. Build and serve isolated production output. Capture 375/1280 light/dark screenshots, DOM bounds, Axe results, raw E2E logs twice; stop server through trap and record port receipt.
6. Run independent reviewer from required session context; commit only intended Task 7 files after approval.

## Acceptance

- No project card title, body, CTA, or date appears as an edge fragment.
- Mobile uses native `scroll-snap-type: x mandatory`; desktop uses a responsive grid.
- Project links remain semantic and keyboard-operable.
- No marquee keyframes/classes/guards remain for projects.
- Production browser geometry proves every intersecting card is fully inside collection bounds.
