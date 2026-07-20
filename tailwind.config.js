/* eslint-disable @typescript-eslint/no-var-requires */
const { pick, omit } = require("lodash")
const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

const primary = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
}

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
          DEFAULT: "#ffffff",
          muted: "#f9fafb",
          elevated: "#ffffff",
          dark: "#111827",
          "muted-dark": "#1f2937",
          "elevated-dark": "#1f2937",
        },
        foreground: {
          DEFAULT: "#111827",
          muted: "#6b7280",
          dark: "#ffffff",
          "muted-dark": "#9ca3af",
          "foreground-muted-dark": "#d1d5db",
        },
        accent: {
          DEFAULT: primary[600],
          light: primary[400],
          hover: primary[700],
          soft: primary[100],
          "soft-contrast": primary[200],
          "soft-foreground": primary[800],
          dark: primary[500],
          "hover-dark": primary[400],
          "soft-dark": primary[900],
          "soft-foreground-dark": primary[300],
        },
        muted: {
          DEFAULT: "#6b7280",
          surface: "#f3f4f6",
          dark: "#9ca3af",
          "surface-dark": "#1f2937",
        },
        border: {
          DEFAULT: "#d1d5db",
          subtle: "#e5e7eb",
          dark: "#4b5563",
          "subtle-dark": "#374151",
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
            color: theme("colors.foreground.foreground-muted-dark"),
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
