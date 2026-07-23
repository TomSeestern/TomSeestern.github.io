import { Metadata } from "next"
import ArticleComponent from "../../components/ArticleTeaser/ArticleTeaser"
import { getAllBlogPosts } from "../../lib/blog"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on technology, homelabs, and software engineering. Personal blog by Tom Segbers covering AI, self-hosting, automation, and lessons learned from real projects.",
  openGraph: {
    url: "https://tom.segbers.de/blog",
    siteName: "TomSegbers.de",
    title: "Blog | TomSegbers.de",
    description: "Thoughts on technology, homelabs, and software engineering by Tom Segbers.",
    images: [
      {
        url: "/img/logo.png",
        width: 512,
        height: 512,
        alt: "TomSegbers.de logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/logo.png"],
  },
}

function Articles() {
  const articles = getAllBlogPosts()

  return (
    <section className="bg-surface dark:bg-surface-dark">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
          <h1 className="mb-4 text-h1-sm text-foreground dark:text-foreground-dark lg:text-h1">Blog</h1>
          <p className="font-light text-muted dark:text-muted-dark sm:text-xl">
            Thoughts on technology, homelabs, and software engineering.
          </p>
        </div>
        <h2 className="sr-only">Blog entries</h2>
        {articles.length === 0 ? (
          <p className="py-12 text-center text-muted dark:text-muted-dark">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {articles.map((article) => (
              <ArticleComponent
                key={article.id}
                title={article.title}
                articleDate={article.articleDate}
                articleContent={article.articleContent}
                authorImgSrc={article.authorImgSrc}
                authorName={article.authorName}
                fullArticleLink={article.fullArticleLink}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Articles
