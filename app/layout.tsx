import "styles/tailwind.css"
import React from "react"
import { Footer } from "../components/Footer/Footer"
import { Header } from "../components/Header/Header"
import { TooltipProvider } from "../components/Providers/TooltipProvider"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], display: "swap" })

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
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen flex-col bg-surface text-foreground dark:bg-surface-dark dark:text-foreground-dark">
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
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
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
