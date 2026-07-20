import path from "path"
import { getAllMarkdownEntries } from "./markdown"

export function getAllBlogPosts() {
  return getAllMarkdownEntries(path.join(process.cwd(), "content/blog"), "/blog")
}
