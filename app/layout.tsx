import "styles/tailwind.css"
import React from "react"
import { Footer } from "../components/Footer/Footer"
import { Header } from "../components/Header/Header"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />

        <main className="mx-auto w-full max-w-screen-xl grow p-4">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
