"use client"

import { motion } from "motion/react"
import React from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      id="main-content"
      tabIndex={-1}
      className="grow"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  )
}
