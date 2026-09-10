import "styles/tailwind.css"
import React from "react"
import { Footer } from "../components/Footer/Footer"
import { Header } from "../components/Header/Header"
import { TooltipProvider } from "../components/Providers/TooltipProvider"
import type { Metadata, Viewport } from "next"
import { Inter, Newsreader } from "next/font/google"

const inter = Inter({ subsets: ["latin"], display: "swap" })

// Display/serif face for the carved H1/H2 treatment (D3: Inter + Newsreader).
// One static weight keeps the shipped subset small (Google serves the variable
// face for multi-weight requests, which blows the 60 KiB budget); 700 covers the
// h2 token exactly and matches the h1 token without faux-bold synthesis.
const newsreader = Newsreader({ subsets: ["latin"], weight: "700", display: "swap", variable: "--font-newsreader" })

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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface text-foreground">
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
        <TooltipProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          <Header />

          <main id="main-content" tabIndex={-1} className="grow">
            {children}
          </main>

          <Footer />
        </TooltipProvider>
      </body>
    </html>
  )
}
