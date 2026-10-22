import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { formatDate } from "@/lib/format-date"
import type { MarkdownEntry } from "@/lib/markdown"
import { ArrowRight } from "../Icon/ArrowRight"
import { TagChip } from "../TagChip/TagChip"

export interface ArticleCardProps {
  entry: MarkdownEntry
  index?: number
  variant?: "standard" | "feature"
  className?: string
}

function chapterLabel(index: number): string {
  return `Dispatch ${String(index + 1).padStart(2, "0")}`
}

/**
 * Dispatch card: a quiet terminal surface with date, tag, title, and the first
 * paragraph. The feature variant gives the newest entry more room without
 * changing the information order.
 */
export function ArticleCard({ entry, index = 0, variant = "standard", className }: ArticleCardProps) {
  const [firstTag] = entry.tags
  const isFeature = variant === "feature"

  return (
    <article
      data-testid="article-card"
      className={twMerge(
        "group flex min-w-0 flex-col rounded-lg border border-rule bg-panel p-5 transition-colors duration-200 hover:border-rule-strong sm:p-6",
        isFeature && "bg-canvas-deep",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">{chapterLabel(index)}</span>
        <span className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          {formatDate(entry.articleDate)}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {firstTag ? <TagChip label={firstTag} testId="article-tag" /> : null}
      </div>

      <h3 className={twMerge("mt-3 text-balance text-h3 text-ink", isFeature && "text-display-md")}>
        <Link
          href={entry.fullArticleLink}
          className="focus-ring inline-block w-full rounded-sm py-0.5 decoration-crimson decoration-2 underline-offset-4 hover:text-crimson hover:underline"
        >
          {entry.title}
        </Link>
      </h3>

      <p
        className={twMerge(
          "mt-3 line-clamp-3 max-w-measure-card font-body text-sm text-ink-muted",
          isFeature && "line-clamp-4 text-body-lg"
        )}
      >
        {entry.articleContent}
      </p>

      <Link
        href={entry.fullArticleLink}
        className="focus-ring mt-auto inline-flex min-h-11 w-fit items-center gap-2 pt-5 font-body text-sm font-medium text-crimson hover:text-ink"
      >
        Read dispatch
        <ArrowRight className="size-4" />
      </Link>
    </article>
  )
}

export default ArticleCard
