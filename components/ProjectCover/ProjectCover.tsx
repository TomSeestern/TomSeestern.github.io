import { twMerge } from "tailwind-merge"
import { coverKeyForSlug, projectArt, projectCoverLabels } from "./art"

export interface ProjectCoverProps {
  slug: string
  index?: number
  className?: string
}

/**
 * Project-specific case-file cover. Every project gets its own diagram and
 * label; the shared frame, scanlines, and single accent keep 28 cards legible
 * as one archive rather than a colour wall.
 */
export function ProjectCover({ slug, index = 0, className }: ProjectCoverProps) {
  const variant = coverKeyForSlug(slug)
  const Art = projectArt[variant]
  const figure = String(index + 1).padStart(2, "0")
  const label = projectCoverLabels[variant]

  return (
    <div
      data-testid="project-cover"
      data-variant={variant}
      className={twMerge("relative aspect-[16/10] w-full overflow-hidden bg-night text-night-ink", className)}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 400 240"
        className="size-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <Art />
      </svg>
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 opacity-30" />
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.14em] text-night-ink/80">
        {label} / Fig. {figure}
      </span>
    </div>
  )
}

export default ProjectCover
