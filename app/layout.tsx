import "styles/tailwind.css"
import React from "react"
import { Footer } from "../components/Footer/Footer"
import { Header } from "../components/Header/Header"
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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-surface text-foreground dark:bg-surface-dark dark:text-foreground-dark">
        <Header />

        <main className="grow">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
