const defaultTheme = require("tailwindcss/defaultTheme")

const primary = {
  50: "#F9E8EA",
  100: "#F1CDD2",
  200: "#E4A8B1",
  300: "#D57E8B",
  400: "#C55B6A",
  500: "#B73C4D",
  600: "#A82A38",
  700: "#8B202D",
  800: "#6F1723",
  900: "#4B0F18",
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
        pompeian: "#A82A38",
        marble: "#F5F0E6",
        charcoal: "#1C1917",
        gold: "#C9A34F",
        surface: {
          DEFAULT: "#F5F0E6",
          muted: "#EEE7DA",
          elevated: "#FFFCF6",
          dark: "#1C1917",
          "muted-dark": "#292524",
          "elevated-dark": "#292524",
        },
        foreground: {
          DEFAULT: "#2A2017",
          muted: "#625B54",
          dark: "#F5F0E6",
          "muted-dark": "#C8C1B5",
          "foreground-muted-dark": "#C8C1B5",
        },
        accent: {
          DEFAULT: primary[600],
          light: primary[400],
          hover: primary[700],
          soft: primary[100],
          "soft-contrast": primary[200],
          "soft-foreground": primary[800],
          dark: primary[300],
          "hover-dark": primary[200],
          "soft-dark": primary[900],
          "soft-foreground-dark": primary[200],
        },
        muted: {
          DEFAULT: "#625B54",
          surface: "#EEE7DA",
          dark: "#C8C1B5",
          "surface-dark": "#292524",
        },
        border: {
          DEFAULT: "#D7CFC1",
          subtle: "#E6DED1",
          dark: "#4B4540",
          "subtle-dark": "#292524",
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
        h1: ["3rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" }],
        "h1-sm": ["2.25rem", { lineHeight: "1.1", letterSpacing: "0.05em", fontWeight: "700" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "0.05em", fontWeight: "700" }],
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
            fontFamily: theme("fontFamily.body"),
            maxWidth: "none",
            a: { color: theme("colors.accent.DEFAULT") },
            h2: { color: theme("colors.foreground.DEFAULT"), fontFamily: theme("fontFamily.heading") },
            h3: { color: theme("colors.foreground.DEFAULT") },
            strong: { color: theme("colors.foreground.DEFAULT") },
          },
        },
        invert: {
          css: {
            color: theme("colors.foreground.foreground-muted-dark"),
            fontFamily: theme("fontFamily.body"),
            a: { color: theme("colors.accent.dark") },
            h2: { color: theme("colors.foreground.dark"), fontFamily: theme("fontFamily.heading") },
            h3: { color: theme("colors.foreground.dark") },
            strong: { color: theme("colors.foreground.dark") },
          },
        },
      }),
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "serif"],
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
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
      spacing: {
        112: "28rem",
      },
      zIndex: {
        marquee: "60",
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
