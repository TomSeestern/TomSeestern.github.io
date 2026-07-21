"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"

interface CardMotionWrapperProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export function CardMotionWrapper({ children, className }: CardMotionWrapperProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      {...(!prefersReduced && {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      })}
    >
      {children}
    </motion.div>
  )
}
