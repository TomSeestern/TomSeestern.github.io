"use client"

import React from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="grow motion-safe:animate-[fadeIn_300ms_ease-out]">
      {children}
    </main>
  )
}
