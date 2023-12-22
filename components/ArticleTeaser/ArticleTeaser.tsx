import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import PropTypes from "prop-types"
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
  authorImgSrc: string

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
    <article className="py-6">
      <div className="mb-5 flex items-center justify-between text-gray-500">
        <span className="inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-200 dark:text-primary-800">
          <Image className={"h-3 w-3"} src={"/icon/article.svg"} alt={"Article Icon"} width={32} height={32} />
          Tutorial
        </span>
        <span className="text-sm">{formatDistanceToNow(articleDate, { addSuffix: true })}</span>
      </div>
      <h2 className="mb-2 truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Link href={fullArticleLink}>{title}</Link>
      </h2>
      {/* Using min-h-[4.5rem] here to force the component to keep 3 Lines of space even is text is not long enough */}
      <p className="mb-5 line-clamp-3 min-h-[4.5rem] font-light text-gray-500 dark:text-gray-400 ">{articleContent}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image className="h-7 w-7 rounded-full" src={authorImgSrc} alt="Author's Picture" width={512} height={512} />
          <span className="font-medium dark:text-white">{authorName}</span>
        </div>
        <Link
          href={fullArticleLink}
          className="inline-flex items-center font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Read more
          <Image
            className={"ml-2 h-4 w-4"}
            src={"/icon/arrow-right.svg"}
            alt="Arrow right Icon"
            width={32}
            height={32}
          />
        </Link>
      </div>
    </article>
  )
}

ArticleComponent.propTypes = {
  title: PropTypes.string.isRequired,
  articleDate: PropTypes.instanceOf(Date).isRequired,
  articleContent: PropTypes.string.isRequired,
  authorImgSrc: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  fullArticleLink: PropTypes.string.isRequired,
}

export default React.memo(ArticleComponent)
