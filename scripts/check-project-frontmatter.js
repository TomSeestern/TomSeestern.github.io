const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const EXPECTED_PROJECT_COUNT = 21
const projectDirectory = path.join(process.cwd(), "content/projects")
const projectFiles = fs.readdirSync(projectDirectory).filter((filename) => filename.endsWith(".md")).sort()

if (projectFiles.length !== EXPECTED_PROJECT_COUNT) {
  throw new Error(`Expected ${EXPECTED_PROJECT_COUNT} project files, found ${projectFiles.length}.`)
}

for (const filename of projectFiles) {
  matter(fs.readFileSync(path.join(projectDirectory, filename), "utf8"))
  console.log(`PASS ${filename}`)
}

console.log(`COUNT ${projectFiles.length}`)
