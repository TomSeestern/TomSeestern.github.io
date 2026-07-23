"use client"

import React from "react"

interface CardMotionWrapperProps {
  readonly children: React.ReactNode
  readonly className?: string
}

export function CardMotionWrapper({ children, className }: CardMotionWrapperProps) {
  return (
    <div
      className={`${
        className ?? ""
      } motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-0.5`}
    >
      {children}
    </div>
  )
}
