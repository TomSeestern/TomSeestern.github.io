import ArticleComponent from "../../components/ArticleTeaser/ArticleTeaser"
import path from "path"
import fs from "fs"
import matter from "gray-matter"

function Articles() {
  const postsDirectory = path.join(process.cwd(), "app/blog/entry/")
  const filenames = fs.readdirSync(postsDirectory)

  const articles = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)

      // Check if filePath is a file, not a directory
      if (fs.statSync(filePath).isFile()) {
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data } = matter(fileContents)

        return {
          id: filename.replace(/\.md?$/, ""),
          title: data.title || "Untitled",
          articleDate: new Date(data.articleDate || "1990-01-01"),
          articleContent: data.articleContent || "Failed to load content",
          authorImgSrc: data.authorImgSrc || "/img/placeholder.png",
          authorName: data.authorName || "Anonymous",
          fullArticleLink: "/blog/entry/" + filename.replace(/\.md?$/, ""),
        }
      }
    })
    .filter(Boolean) // Filter out undefined values (directories)
    .sort((a, b) => b.articleDate.valueOf() - a.articleDate.valueOf()) // Sort by date, newest first (descending)

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
            Our Blog
          </h2>
          <p className="font-light text-gray-500 dark:text-gray-400 sm:text-xl">
            We use an agile approach to test assumptions and connect with the needs of your audience early and often.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {articles.map((article, index) => (
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
      </div>
    </section>
  )
}

export default Articles
