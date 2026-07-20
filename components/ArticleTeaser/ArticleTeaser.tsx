import { formatDistanceToNow } from "date-fns"
import { Card } from "flowbite-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export interface ArticleProps {
  /**
   * Title of the article.
   */
  title: string

  /**
   * Date when the article was published.
   */
  articleDate: Date

  /**
   * The teaser text for the article.
   */
  articleContent: string

  /**
   * Source URL of the author's image.
   */
  authorImgSrc?: string

  /**
   * Name of the author.
   */
  authorName: string

  /**
   * URL to the full article.
   */
  fullArticleLink: string
}

/**
 * @function ArticleComponent
 * @description This is an article teaser component used to give a brief description of blog-like articles.
 * It includes title, teaser text, author name, publish date, and an image thumbnail.
 *
 * @param {ArticleProps} props The properties that define the content of the article teaser.
 * @returns {JSX.Element} Returns a well formatted article teaser component ready for rendering.
 *
 */
const ArticleComponent: React.FC<ArticleProps> = ({
  title,
  articleDate,
  articleContent,
  authorImgSrc,
  authorName,
  fullArticleLink,
}) => {
  return (
    <Card className="min-w-0 p-2 transition-colors duration-200 hover:bg-surface-muted motion-safe:hover:-translate-y-1 dark:hover:bg-muted-surface-dark">
      <div className="mb-5 flex items-center justify-between text-muted">
        <span className="inline-flex items-center rounded bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-foreground dark:bg-accent-soft-dark dark:text-accent-soft-foreground-dark">
          <Image className={"h-3 w-3"} src={"/icon/article.svg"} alt={"Article Icon"} width={32} height={32} />
          Tutorial
        </span>
        <span className="text-sm">{formatDistanceToNow(articleDate, { addSuffix: true })}</span>
      </div>
      <h3 className="mb-2 truncate text-h3 text-foreground dark:text-foreground-dark">
        <Link
          href={fullArticleLink}
          className="rounded transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
        >
          {title}
        </Link>
      </h3>
      {/* Using min-h-[4.5rem] here to force the component to keep 3 Lines of space even is text is not long enough */}
      <p className="mb-5 line-clamp-3 min-h-[4.5rem] font-light text-muted dark:text-muted-dark ">{articleContent}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            className="h-7 w-7 rounded-full"
            src={authorImgSrc ?? "/img/placeholder.png"}
            alt="Author's Picture"
            width={512}
            height={512}
          />
          <span className="font-medium dark:text-foreground-dark">{authorName}</span>
        </div>
        <Link
          href={fullArticleLink}
          className="inline-flex items-center rounded font-medium text-accent transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:text-accent-dark dark:hover:text-accent-hover-dark dark:focus-visible:ring-accent-soft-dark"
        >
          Read more
          <Image
            className={"ml-2 h-4 w-4 dark:invert"}
            src={"/icon/arrow-right.svg"}
            alt="Arrow right Icon"
            width={32}
            height={32}
          />
        </Link>
      </div>
    </Card>
  )
}

export default React.memo(ArticleComponent)
