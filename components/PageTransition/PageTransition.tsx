"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.main
      id="main-content"
      tabIndex={-1}
      className="grow"
      initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  )
}
