import { formatDate } from "@/lib/format-date"
import { normalizeTagKey, tagSlug } from "@/lib/tags"
import { TagChip } from "../TagChip/TagChip"

export interface ArticleMetaProps {
  date: Date
  readingTimeMinutes: number
  tags: readonly string[]
  author: string
  className?: string
}

/**
 * Detail-page metadata strip: absolute date, reading time, topic links, and
 * author. It is a description list in spirit but a flex row in practice; the
 * labels stay explicit for screen readers.
 */
export function ArticleMeta({ date, readingTimeMinutes, tags, author, className }: ArticleMetaProps) {
  return (
    <div
      data-testid="article-meta"
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-rule py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted ${
        className ?? ""
      }`}
    >
      <span>{formatDate(date)}</span>
      <span aria-hidden="true" className="text-crimson">
        /
      </span>
      <span>{readingTimeMinutes} min read</span>
      <span aria-hidden="true" className="text-crimson">
        /
      </span>
      <span>By {author}</span>
      {tags.length > 0 ? (
        <>
          <span aria-hidden="true" className="text-crimson">
            /
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                href={`/tags/${tagSlug(normalizeTagKey(tag))}`}
                variant="outline"
                testId="article-meta-tag"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ArticleMeta
