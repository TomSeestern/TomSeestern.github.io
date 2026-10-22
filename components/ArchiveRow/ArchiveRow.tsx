import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { formatYear } from "@/lib/format-date"
import type { MarkdownEntry } from "@/lib/markdown"
import { ArrowUpRight } from "../Icon/ArrowUpRight"

export interface ArchiveRowProps {
  project: MarkdownEntry
  index: number
  className?: string
}

function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0")
}

/**
 * Compact ledger row. It keeps the same stable project-teaser/featured ids as
 * MonumentCard while reading like an index entry rather than a second card.
 *
 * The title link stretches across the whole row, so the pointer target is the
 * row while the keyboard gets exactly one stop per entry. A second "Case file"
 * link used to duplicate the same destination 21 times.
 */
export function ArchiveRow({ project, index, className }: ArchiveRowProps) {
  return (
    <article
      data-testid="project-teaser"
      data-featured={project.featured ? "true" : undefined}
      className={twMerge(
        "group relative grid min-w-0 gap-4 border-b border-rule py-5 transition-colors duration-150 hover:bg-panel sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-5",
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-crimson">{ordinal(index)}</span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="min-w-0 text-h3-sm text-ink transition-colors duration-150 group-hover:text-crimson">
            <Link
              data-testid={project.featured ? "featured-project" : undefined}
              href={project.fullArticleLink}
              className="focus-ring rounded-sm decoration-crimson decoration-2 underline-offset-4 after:absolute after:inset-0"
            >
              {project.title}
            </Link>
          </h3>
          {project.featured ? (
            <span
              data-testid="featured-badge"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"
            >
              Selected
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 max-w-measure-card font-body text-sm text-ink-muted">
          {project.articleContent}
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {project.technologies.slice(0, 4).join(" · ")}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {formatYear(project.articleDate)}
        </span>
        <ArrowUpRight aria-hidden="true" className="size-3.5 text-crimson" />
      </div>
    </article>
  )
}

export default ArchiveRow
