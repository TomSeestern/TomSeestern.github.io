import "styles/tailwind.css"
import React from "react"
import { Header } from "../components/Header/Header"
import { Footer } from "../components/Footer/Footer"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-grow bg-gray-100 dark:bg-gray-900">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
