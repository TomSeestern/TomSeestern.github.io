# 2026 Audit Remediation — Learnings

## T01: Theme-safe dark mode initialization (2026-07-20)

### What worked
- Inline `<script>` with `dangerouslySetInnerHTML` as first child of `<body>` in root layout
- Script executes synchronously before visual content — no FOUC
- SSR default `class="dark"` on `<html>` tag, inline script corrects for light-preferring users before paint
- `DarkThemeToggle` from flowbite-react v0.7.8 works correctly, uses `useThemeMode` hook internally
- `page.addInitScript()` in Playwright to set `localStorage("flowbite-theme-mode")` before page load

### What didn't work
1. **`<script>` as direct child of `<html>`**: React hydration error "In HTML, <script> cannot be a child of <html>". Causes full document replacement by React, resetting className.
2. **`<head>` wrapper**: Next.js App Router strips custom `<head>` elements in root layout — script never appears in output HTML.
3. **`next/script` with `strategy="beforeInteractive"`**: Inline scripts get serialized into `self.__next_f` RSC payload instead of injected as blocking `<script>` tags in HTML head. Only works with `src` attribute for external scripts.
4. **`page.emulateMedia({ colorScheme: "dark" })`**: Does not propagate to synchronous inline script's `matchMedia("(prefers-color-scheme:dark)").matches` check during initial page load in Playwright.

### Key insight
The only reliable anti-FOUC pattern in Next.js 14 App Router with inline content is: `<script dangerouslySetInnerHTML={{...}} />` placed inside `<body>` as the first child. The browser pauses HTML parsing at the script, executes it synchronously, then continues rendering body content. This is fast enough to prevent visual flash.

### Files changed
- `app/layout.tsx`: Added inline script + `dark` class on `<html>`
- `components/Header/Header.tsx`: Added `DarkThemeToggle`
- `e2e/dark-mode.spec.ts`: Removed manual class hack, added toggle persistence test
