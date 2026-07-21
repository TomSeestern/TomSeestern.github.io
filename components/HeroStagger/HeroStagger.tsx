"use client"

import React from "react"
import { motion, useReducedMotion } from "motion/react"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

interface HeroStaggerProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export function HeroContainer({ children, className }: HeroStaggerProps) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      variants={container}
      initial={prefersReduced ? undefined : "hidden"}
      animate={prefersReduced ? undefined : "show"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroItem({ children, className }: HeroStaggerProps) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}

export function HeroH1({ children, className }: HeroStaggerProps) {
  return (
    <motion.h1 variants={item} className={className}>
      {children}
    </motion.h1>
  )
}

export function HeroP({ children, className }: HeroStaggerProps) {
  return (
    <motion.p variants={item} className={className}>
      {children}
    </motion.p>
  )
}
