import "styles/tailwind.css"
import React from "react"
import { Footer } from "../components/Footer/Footer"
import { Header } from "../components/Header/Header"
import { THEME_COLOR } from "@/lib/design-tokens"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

// Two custom families: Geist for the whole interface and Geist Mono for labels,
// counters, and the small terminal artifacts. No decorative display face.
const geist = Geist({
  subsets: ["latin"],
  // The heading is the LCP element. Let the fallback win on a slow first load
  // instead of repainting the page when the webfont arrives late.
  display: "optional",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  // Labels are not the LCP element either; avoid a late swap reflow.
  display: "optional",
  preload: false,
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://tomsegbers.de"),
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
    images: [
      {
        url: "/img/og-default.png",
        width: 1200,
        height: 630,
        alt: "TomSegbers.de — Tom Segbers, Senior Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/og-default.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: THEME_COLOR,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-canvas font-body text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TomSegbers.de",
              url: "https://tomsegbers.de",
            }),
          }}
        />
        <a
          href="#main-content"
          className="focus-ring-canvas sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-crimson focus:px-4 focus:py-2 focus:font-pixel focus:text-label focus:uppercase focus:text-canvas"
        >
          Skip to main content
        </a>
        <Header />

        <main id="main-content" tabIndex={-1} className="grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
