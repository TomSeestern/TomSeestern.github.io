import Image from "next/image"
import React from "react"

export type CaseStudyHeroProps = {
  readonly src: string
  readonly title?: string
  readonly year?: string
  readonly index?: number
}

export default function CaseStudyHero({ src, title, year, index = 0 }: CaseStudyHeroProps): JSX.Element | null {
  const heroSource = src.trim()

  if (heroSource.length === 0) {
    return null
  }

  const figure = String(index + 1).padStart(2, "0")

  return (
    <figure
      data-testid="case-study-hero"
      className="relative mb-8 overflow-hidden rounded-lg border border-rule bg-night"
    >
      <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em]">
        <span className="text-crimson">Evidence / Case file</span>
        <span className="text-night-muted">{year ?? "Case file"}</span>
      </div>

      <div className="relative aspect-[16/9] bg-canvas-deep p-3 sm:p-5">
        <div className="relative size-full">
          {/* object-contain keeps every UI control visible; the dark plate owns
              the letterbox instead of cropping evidence to fill the frame. */}
          <Image src={heroSource} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-contain" />
        </div>
        <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-10" />
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-rule px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em]">
        <span className="min-w-0 break-words text-night-ink">{title ?? "Project evidence"}</span>
        <span className="shrink-0 text-night-muted">Fig. {figure}</span>
      </figcaption>
    </figure>
  )
}
