import React from "react"
import { MarkdownEntry } from "../../lib/markdown"

export type FeaturedSetProps = {
  readonly projects: readonly MarkdownEntry[]
}

function formatOrdinal(index: number): string {
  return String(index + 1).padStart(2, "0")
}

function FeaturedMonument({ project, index }: { readonly project: MarkdownEntry; readonly index: number }) {
  return (
    <a
      data-testid="featured-project"
      href={project.fullArticleLink}
      className="group flex flex-col border-t border-border pt-6 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
    >
      <span className="text-caption uppercase tracking-widest text-accent-secondary">{formatOrdinal(index)}</span>
      <h3 className="mt-3 text-h3 text-foreground transition-colors duration-200 group-hover:text-accent-hover">
        {project.title}
      </h3>
      <p className="mt-3 line-clamp-3 max-w-measure-card text-body text-muted">{project.articleContent}</p>
      {project.technologies.length > 0 ? (
        <p className="mt-4 text-caption text-muted">{project.technologies.slice(0, 3).join(" · ")}</p>
      ) : null}
      <span className="mt-6 text-small font-medium text-accent transition-colors duration-200 group-hover:text-accent-hover group-hover:underline">
        View project
      </span>
    </a>
  )
}

export default function FeaturedSet({ projects }: FeaturedSetProps) {
  return (
    <section className="bg-surface" aria-labelledby="featured-set-heading">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="featured-set-heading" className="text-h2-sm text-foreground sm:text-h2">
            Selected Work
          </h2>
          <a
            href="/projects"
            className="rounded text-base font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft"
          >
            View all Projects
          </a>
        </div>
        <div className="motion-rise mt-8 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
          {projects.map((project, index) => (
            <FeaturedMonument key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
