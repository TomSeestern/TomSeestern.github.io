import Image from "next/image"
import React from "react"

export type CaseStudyHeroProps = {
  readonly src: string
}

export default function CaseStudyHero({ src }: CaseStudyHeroProps): JSX.Element | null {
  const heroSource = src.trim()

  if (heroSource.length === 0) {
    return null
  }

  return (
    <div
      data-testid="case-study-hero"
      className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-muted"
    >
      {/* The fixed-aspect wrapper reserves the hero's layout box so the image
          never shifts the article below it (CLS). */}
      <Image src={heroSource} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
    </div>
  )
}
