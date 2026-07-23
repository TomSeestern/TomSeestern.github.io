"use client"

import React from "react"

interface HeroStaggerProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export function HeroContainer({ children, className }: HeroStaggerProps) {
  return <div className={className}>{children}</div>
}

export function HeroItem({ children, className }: HeroStaggerProps) {
  return (
    <div
      className={`${
        className ?? ""
      } motion-safe:animate-[fadeInUp_500ms_ease-out_forwards] motion-safe:opacity-0 motion-safe:[animation-delay:200ms]`}
    >
      {children}
    </div>
  )
}

export function HeroH1({ children, className }: HeroStaggerProps) {
  return (
    <h1 className={`${className ?? ""} motion-safe:animate-[fadeInUp_500ms_ease-out_forwards] motion-safe:opacity-0`}>
      {children}
    </h1>
  )
}

export function HeroP({ children, className }: HeroStaggerProps) {
  return (
    <p
      className={`${
        className ?? ""
      } motion-safe:animate-[fadeInUp_500ms_ease-out_forwards] motion-safe:opacity-0 motion-safe:[animation-delay:100ms]`}
    >
      {children}
    </p>
  )
}
