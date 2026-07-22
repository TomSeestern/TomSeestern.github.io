"use client"

import { motion } from "motion/react"
import React from "react"

interface CardMotionWrapperProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export function CardMotionWrapper({ children, className }: CardMotionWrapperProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}
