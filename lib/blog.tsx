import path from "path"
import fs from "fs"
import matter from "gray-matter"

export function getAllBlogPosts() {
  const postsDirectory = path.join(process.cwd(), "app/blog/entry/")
  const filenames = fs.readdirSync(postsDirectory)

  return filenames
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
          technologies: data.technologies || [],
        }
      } else {
        return null
      }
    })
    .filter(Boolean) // Filter out undefined values (directories)
    .sort((a, b) => b.articleDate.valueOf() - a.articleDate.valueOf()) // Sort by date, newest first (descending)
}
