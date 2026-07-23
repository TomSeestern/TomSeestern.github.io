import matter from "gray-matter"
import { MetadataRoute } from "next"
import fs from "fs"
import path from "path"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tom.segbers.de"

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Dynamic blog routes
  const blogDir = path.join(process.cwd(), "content/blog")
  const blogFiles = fs.readdirSync(blogDir).filter((file) => file.endsWith(".md"))
  const blogRoutes = blogFiles.map((file) => {
    const slug = file.replace(/\.md$/, "")
    const fileContents = fs.readFileSync(path.join(blogDir, file), "utf8")
    const { data } = matter(fileContents)
    return {
      url: `${baseUrl}/blog/entry/${slug}`,
      lastModified: data.articleDate ? new Date(data.articleDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }
  })

  // Dynamic project routes
  const projectsDir = path.join(process.cwd(), "content/projects")
  const projectFiles = fs.readdirSync(projectsDir).filter((file) => file.endsWith(".md"))
  const projectRoutes = projectFiles.map((file) => {
    const slug = file.replace(/\.md$/, "")
    const fileContents = fs.readFileSync(path.join(projectsDir, file), "utf8")
    const { data } = matter(fileContents)
    return {
      url: `${baseUrl}/projects/entry/${slug}`,
      lastModified: data.articleDate ? new Date(data.articleDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }
  })

  return [...staticRoutes, ...blogRoutes, ...projectRoutes]
}
