import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { formatYear } from "@/lib/format-date"
import type { MarkdownEntry } from "@/lib/markdown"
import Card from "../Card/Card"
import { ArrowUpRight } from "../Icon/ArrowUpRight"
import { ProjectCover } from "../ProjectCover/ProjectCover"

export interface MonumentCardProps {
  project: MarkdownEntry
  index: number
  variant?: "standard" | "lead"
  className?: string
}

function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0")
}

/**
 * Case-file card: a project-specific cover, the work's own identity, and the
 * facts a reader needs to decide whether to open it. The `lead` variant turns
 * the first home card into an editorial feature without changing the DOM ids
 * the archive and e2e suite depend on.
 */
export function MonumentCard({ project, index, variant = "standard", className }: MonumentCardProps) {
  const isLead = variant === "lead"

  const body = (
    <div className={twMerge("flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-6", isLead && "lg:justify-between lg:p-8")}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
          {ordinal(index)} / <span data-testid="project-year">{formatYear(project.articleDate)}</span>
        </span>
        {project.featured ? (
          <span
            data-testid="featured-badge"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted"
          >
            Selected
          </span>
        ) : null}
      </div>

      <div>
        <h3 className={twMerge("text-balance text-h3 text-ink", isLead && "text-display-md")}>
          <Link
            data-testid={project.featured ? "featured-project" : undefined}
            href={project.fullArticleLink}
            className="focus-ring inline-block w-full rounded-sm py-0.5 decoration-crimson decoration-2 underline-offset-4 hover:text-crimson hover:underline"
          >
            {project.title}
          </Link>
        </h3>
        <p
          className={twMerge(
            "mt-3 line-clamp-3 max-w-measure-card font-body text-sm text-ink-muted",
            isLead && "line-clamp-4 text-body-lg"
          )}
        >
          {project.articleContent}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {project.technologies.slice(0, 3).join(" · ")}
        </span>
        <Link
          href={project.fullArticleLink}
          className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 font-body text-sm font-medium text-crimson hover:text-ink"
        >
          View case file
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  )

  return (
    <article
      data-testid="project-teaser"
      data-featured={project.featured ? "true" : undefined}
      className={twMerge("group min-w-0", className)}
    >
      <Card data-testid="monument-card" innerClassName="gap-0 p-0">
        {isLead ? (
          <div className="grid h-full lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)]">
            <ProjectCover slug={project.id} index={index} className="border-b border-rule lg:aspect-auto" />
            {body}
          </div>
        ) : (
          <>
            <ProjectCover slug={project.id} index={index} className="border-b border-rule" />
            {body}
          </>
        )}
      </Card>
    </article>
  )
}

export default MonumentCard
