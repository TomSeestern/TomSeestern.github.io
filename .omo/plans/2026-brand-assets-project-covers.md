# Brand mark and project hero system

## TL;DR

Replace the inconsistent warm favicon with a crisp COLOSSUS monogram, unify it
with the header/footer mark, and give every project a distinct case-file hero
plate. Keep real product screenshots as framed evidence instead of replacing
them with generated imagery.

## Decisions

- Palette: `canvas` #050505, `ink` #FAFAFA, `crimson` #FF5C35, `rule` #1F1F1F.
- Mark: terminal tile + arch + T monogram + single crimson pixel. Designed at
  64×64 and checked at 16/32/180 px.
- Project cards and detail pages share one 29-key cover system: 28 project
  keys plus an `archive` fallback. Every project gets its own diagram and label.
- Existing project screenshots remain evidence. `CaseStudyHero` becomes a framed
  evidence plate with metadata and `object-contain`, so no UI is cropped.
- Missing screenshots continue to use the project-specific vector plate as the
  detail hero.

## Steps

- [x] Audit current icons, hero assets, and rendering paths.
- [x] Replace `app/icon.svg`, `public/icon/brand-mark.svg`, `app/apple-icon.png`,
      and `app/favicon.ico` with the new mark.
- [x] Split and expand `ProjectCover` art to 28 unique project plates.
- [x] Redesign `CaseStudyHero` as a consistent evidence plate.
- [x] Update component/page tests for the new cover and hero contracts.
- [x] Run typecheck, Jest, lint, Prettier, build, content/asset gates.
- [x] Verify favicon at 16/32/180 px and every project route at desktop/mobile.
- [x] Commit and push.

## Success criteria

- 28/28 projects have a distinct cover key and visible label.
- No project detail page renders an empty hero.
- Existing raster screenshots are fully visible (`object-contain`) inside the
  branded frame.
- Favicon and header mark share the same geometry and palette.
- No new raw hex outside allowed token sources.
- Build and browser checks pass with no console errors or mobile overflow.
