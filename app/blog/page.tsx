import ArticleComponent from "../../components/ArticleTeaser/ArticleTeaser"
import { getAllBlogPosts } from "../../lib/blog"
import { Metadata } from "next"

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
        url: "/img/og-default.png",
        width: 1200,
        height: 630,
        alt: "TomSegbers.de — Tom Segbers, Senior Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/og-default.png"],
  },
}

function Articles() {
  const articles = getAllBlogPosts()

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <header className="mx-auto max-w-measure-lead text-center">
          <h1 className="text-h1-sm text-foreground sm:text-h1">Blog</h1>
          <p className="mt-4 text-body-lg font-light text-muted sm:text-xl">
            Thoughts on technology, homelabs, and software engineering. {articles.length} posts, newest first.
          </p>
        </header>
        <h2 className="sr-only">Blog entries</h2>
        <div className="motion-rise mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleComponent
              key={article.id}
              title={article.title}
              articleDate={article.articleDate}
              articleContent={article.articleContent}
              authorImgSrc={article.authorImgSrc}
              authorName={article.authorName}
              fullArticleLink={article.fullArticleLink}
              tags={article.tags}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Articles
