/* eslint-disable @typescript-eslint/no-var-requires */
const { pick, omit } = require("lodash")
const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

// Warm terracotta ramp — the single accent family for the parchment palette
// (D4/D13: two warm accents only). `accent` below is the semantic layer on
// top of this ramp; `primary-*` stays available for Flowbite-owned utilities.
// Every text/UI pair is contrast-gated by scripts/check-contrast.mjs.
const primary = {
  50: "#fbf3ef",
  100: "#f6e3da",
  200: "#edc9b9",
  300: "#dea48c",
  400: "#c97a5c",
  500: "#b45036",
  600: "#a63d28",
  700: "#7f2e1e",
  800: "#652417",
  900: "#4a1a10",
}

// Carved display tracking (T14) — single source for the uppercase H1/H2 serif
// treatment, consumed by the base heading styles in styles/tailwind.css.
const displayTracking = "0.025em"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#F5EFE1",
          muted: "#EDE4D1",
          elevated: "#FBF7EE",
          dark: "#211E1A",
          "muted-dark": "#2B2722",
          "elevated-dark": "#2B2722",
        },
        foreground: {
          DEFAULT: "#1B1B1F",
          muted: "#5C5548",
          dark: "#F2ECE0",
          "muted-dark": "#B7AD9C",
        },
        accent: {
          DEFAULT: "#A63D28",
          light: "#A63D28",
          hover: "#7F2E1E",
          soft: "#BE6A50",
          "soft-contrast": "#B45036",
          "soft-foreground": "#1F0F0A",
          dark: "#B45036",
          "hover-dark": "#C97A5C",
          "soft-dark": "#4A1A10",
          "soft-foreground-dark": "#DEA48C",
          // Second warm accent — deep oxblood/wine (D4). Text-safe on parchment.
          secondary: "#5E2130",
          "secondary-hover": "#471824",
        },
        muted: {
          DEFAULT: "#5C5548",
          surface: "#E9DFC9",
          dark: "#B7AD9C",
          "surface-dark": "#2B2722",
        },
        border: {
          DEFAULT: "#D8CDB6",
          subtle: "#E6DDCB",
          dark: "#57503F",
          "subtle-dark": "#3A342A",
        },
        primary,
      },
      // ── Typography scale ────────────────────────────────────────────────
      // Semantic font-size tokens. Use these (or the matching utility
      // class) instead of ad-hoc text-* values so every page shares one
      // scale. Line-height and letter-spacing are baked in via the tuple
      // form [fontSize, { lineHeight, letterSpacing, fontWeight }].
      // See `.omo/evidence/task-19-2026-portfolio-overhaul.txt` for the
      // audit that established this scale.
      fontSize: {
        // Page-level headings ──────────────────────────────────────────────
        h1: ["3rem", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "800" }],
        "h1-sm": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "800" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2-sm": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "1.25", fontWeight: "600" }],
        "h3-sm": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        // Body & ancillary ─────────────────────────────────────────────────
        body: ["1rem", { lineHeight: "1.625" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground.DEFAULT"),
            maxWidth: "none",
            a: { color: theme("colors.accent.DEFAULT") },
            h2: { color: theme("colors.foreground.DEFAULT") },
            h3: { color: theme("colors.foreground.DEFAULT") },
            strong: { color: theme("colors.foreground.DEFAULT") },
          },
        },
        invert: {
          css: {
            color: theme("colors.foreground.muted-dark"),
            a: { color: theme("colors.accent.dark") },
            h2: { color: theme("colors.foreground.dark") },
            h3: { color: theme("colors.foreground.dark") },
            strong: { color: theme("colors.foreground.dark") },
          },
        },
      }),
      fontFamily: {
        body: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        // Carved display face (T14/D3). `--font-newsreader` is set by
        // next/font on <html>; the system serif stack is the offline fallback.
        display: ["var(--font-newsreader)", "Newsreader", "ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
        serif: ["var(--font-newsreader)", "Newsreader", "ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      letterSpacing: {
        display: displayTracking,
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      minHeight: {
        ...defaultTheme.height,
        teaser: "4.5rem",
      },
      minWidth: {
        ...defaultTheme.width,
      },
      // Measure system (T13). Reading-width caps live here, not in CSS vars, so
      // every page shares one vertical rhythm instead of ad-hoc max-w values.
      maxWidth: {
        "measure-article": "66ch",
        "measure-lead": "46ch",
        "measure-card": "38ch",
        "measure-display": "20ch",
        "width-page": "78rem",
      },
      animation: {
        marquee: "marquee 90s linear infinite",
        marquee2: "marquee2 90s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
