import "styles/tailwind.css"
import React from "react"
import { Footer } from "../components/Footer/Footer"
import { Header } from "../components/Header/Header"
import type { Metadata, Viewport } from "next"
import { Cinzel, Inter } from "next/font/google"
import { MotionConfig } from "motion/react"
import PageTransition from "../components/PageTransition/PageTransition"

const inter = Inter({ subsets: ["latin"], display: "swap" })

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://tom.segbers.de"),
  title: {
    template: "%s | TomSegbers.de",
    default: "TomSegbers.de — Senior Developer",
  },
  description:
    "Personal portfolio of Tom Segbers — Senior Developer building reliable systems and solving hard problems. Explore projects, blog posts, and get in touch.",
  openGraph: {
    siteName: "TomSegbers.de",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: { "application/rss+xml": [{ url: "/feed.xml", title: "TomSegbers.de RSS Feed" }] },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} ${cinzel.variable} dark`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-surface text-foreground dark:bg-surface-dark dark:text-foreground-dark">
        <style
          dangerouslySetInnerHTML={{
            __html: "h1, h2, h3, h4 { font-family: var(--font-heading), serif; }",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TomSegbers.de",
              url: "https://tom.segbers.de",
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var mode = localStorage.getItem("flowbite-theme-mode");
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (mode === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("flowbite-theme-mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("flowbite-theme-mode", "light");
    }
  } catch (e) {}
})();
`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to main content
        </a>
        <Header />

        <MotionConfig reducedMotion="user">
          <PageTransition>{children}</PageTransition>
        </MotionConfig>

        <Footer />
      </body>
    </html>
  )
}
