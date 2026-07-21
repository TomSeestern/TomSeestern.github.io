import { Feed } from "feed"
import { getAllBlogPosts } from "../../lib/blog"

const siteUrl = "https://tom.segbers.de"

export async function GET() {
  const posts = getAllBlogPosts()

  const feed = new Feed({
    title: "TomSegbers.de",
    description: "Personal blog of Tom Segbers — Senior Developer",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    image: `${siteUrl}/img/logo.png`,
    favicon: `${siteUrl}/icon.png`,
    copyright: `© ${new Date().getFullYear()} Tom Segbers`,
    updated: posts[0] ? new Date(posts[0].articleDate) : new Date(),
    author: { name: "Tom Segbers", email: "contact@tom.segbers.de", link: siteUrl },
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}${post.fullArticleLink}`,
      link: `${siteUrl}${post.fullArticleLink}`,
      description: post.articleContent,
      date: new Date(post.articleDate),
      author: [{ name: post.authorName }],
    })
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
