/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require("tailwindcss/defaultTheme")

// Geist wants tight, display-scale tracking, but never tighter than -0.04em:
// past that, counters close up and the terminal voice turns into a squeeze.
// The base H1-H3 bridge in styles/tailwind.css and the display scale share it.
const displayTracking = "-0.04em"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── COLOSSUS / terminal palette ─────────────────────────────────
        // One dark surface mode. Roman warmth is limited to the single accent;
        // everything structural stays monochrome so the pixel marks can breathe.
        canvas: {
          DEFAULT: "#050505",
          deep: "#0A0A0A",
        },
        panel: {
          DEFAULT: "#0F0F0F",
        },
        ink: {
          DEFAULT: "#FAFAFA",
          muted: "#A1A1AA",
        },
        night: {
          DEFAULT: "#000000",
          soft: "#141414",
          ink: "#FAFAFA",
          muted: "#A1A1AA",
        },
        crimson: {
          DEFAULT: "#FF5C35",
          hover: "#FF7A57",
        },
        gold: {
          DEFAULT: "#F5F5F5",
          ink: "#FAFAFA",
        },
        verdigris: {
          DEFAULT: "#4ADE80",
        },
        rule: {
          DEFAULT: "#1F1F1F",
          strong: "#333333",
        },
        focus: {
          DEFAULT: "#FAFAFA",
          inverse: "#FAFAFA",
        },
        danger: {
          DEFAULT: "#FF6B6B",
          surface: "#2A0F0F",
        },
      },
      // ── Typography scale ────────────────────────────────────────────────
      fontSize: {
        "display-xl": [
          "clamp(3.25rem, 6.8vw, 5.75rem)",
          { lineHeight: "0.98", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        "display-lg": [
          "clamp(2.5rem, 4.8vw, 4rem)",
          { lineHeight: "1.02", letterSpacing: "-0.04em", fontWeight: "600" },
        ],
        "display-md": [
          "clamp(2rem, 3.2vw, 2.75rem)",
          { lineHeight: "1.08", letterSpacing: "-0.035em", fontWeight: "600" },
        ],
        label: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.12em", fontWeight: "500" }],
        h1: ["3rem", { lineHeight: "1.02", letterSpacing: "-0.04em", fontWeight: "600" }],
        "h1-sm": ["2.25rem", { lineHeight: "1.08", letterSpacing: "-0.04em", fontWeight: "600" }],
        h2: ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.04em", fontWeight: "600" }],
        "h2-sm": ["1.875rem", { lineHeight: "1.18", letterSpacing: "-0.035em", fontWeight: "600" }],
        h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "600" }],
        "h3-sm": ["1.125rem", { lineHeight: "1.35", letterSpacing: "-0.015em", fontWeight: "600" }],
        h4: ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.55" }],
        caption: ["0.75rem", { lineHeight: "1.45" }],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.ink.muted"),
            fontFamily: theme("fontFamily.prose").join(", "),
            maxWidth: "none",
            a: { color: theme("colors.crimson.DEFAULT"), textDecorationColor: theme("colors.crimson.DEFAULT") },
            h2: {
              color: theme("colors.ink.DEFAULT"),
              fontFamily: theme("fontFamily.display").join(", "),
              fontWeight: "600",
              letterSpacing: displayTracking,
            },
            h3: { color: theme("colors.ink.DEFAULT"), fontWeight: "600" },
            h4: { color: theme("colors.ink.DEFAULT"), fontWeight: "600" },
            strong: { color: theme("colors.ink.DEFAULT") },
            code: {
              color: theme("colors.ink.DEFAULT"),
              backgroundColor: theme("colors.panel.DEFAULT"),
              borderRadius: "0.25rem",
              padding: "0.15rem 0.35rem",
              fontWeight: "500",
            },
            blockquote: { borderLeftColor: theme("colors.crimson.DEFAULT"), color: theme("colors.ink.muted") },
            hr: { borderColor: theme("colors.rule.DEFAULT") },
            thead: { borderBottomColor: theme("colors.rule.strong") },
            "tbody tr": { borderBottomColor: theme("colors.rule.DEFAULT") },
          },
        },
        invert: {
          css: {
            color: theme("colors.ink.muted"),
            fontFamily: theme("fontFamily.prose").join(", "),
            a: { color: theme("colors.crimson.DEFAULT") },
            h2: { color: theme("colors.ink.DEFAULT") },
            h3: { color: theme("colors.ink.DEFAULT") },
            strong: { color: theme("colors.ink.DEFAULT") },
            blockquote: { borderLeftColor: theme("colors.crimson.DEFAULT") },
            hr: { borderColor: theme("colors.rule.DEFAULT") },
          },
        },
      }),
      fontFamily: {
        body: [
          "var(--font-geist-sans)",
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
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
        display: [
          "var(--font-geist-sans)",
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        pixel: ["var(--font-geist-mono)", "Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        prose: [
          "var(--font-geist-sans)",
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
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
      maxWidth: {
        "measure-article": "68ch",
        "measure-lead": "46ch",
        "measure-card": "38ch",
        "measure-display": "20ch",
        "width-page": "80rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0, 0, 0, 0.45), 0 12px 40px rgba(0, 0, 0, 0.35)",
        glow: "0 0 0 1px rgba(255, 255, 255, 0.06), 0 24px 80px rgba(0, 0, 0, 0.55)",
        pixel: "4px 4px 0 0 #FAFAFA",
        "pixel-sm": "2px 2px 0 0 #FAFAFA",
        "pixel-gold": "4px 4px 0 0 #FF5C35",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
