import path from "path"
import { getAllMarkdownEntries } from "./markdown"

export function getAllProjects() {
  return getAllMarkdownEntries(path.join(process.cwd(), "content/projects"), "/projects")
}
