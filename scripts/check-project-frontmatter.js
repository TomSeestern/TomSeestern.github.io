const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const EXPECTED_PROJECT_COUNT = 28
const REQUIRED_STRING_FIELDS = ["title", "articleContent", "authorName", "authorImgSrc", "role", "outcome"]
const REQUIRED_ARRAY_FIELDS = ["tags", "technologies"]
const PLACEHOLDER_PATTERN = /#todo|to be inserted|to be included|lorem ipsum/i
const projectDirectory = path.join(process.cwd(), "content/projects")
const projectFiles = fs
  .readdirSync(projectDirectory)
  .filter((filename) => filename.endsWith(".md"))
  .sort()

if (projectFiles.length !== EXPECTED_PROJECT_COUNT) {
  throw new Error(`Expected ${EXPECTED_PROJECT_COUNT} project files, found ${projectFiles.length}.`)
}

for (const filename of projectFiles) {
  const raw = fs.readFileSync(path.join(projectDirectory, filename), "utf8")
  const parsed = matter(raw)
  const data = parsed.data

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof data[field] !== "string" || data[field].trim().length === 0) {
      throw new Error(`${filename}: missing required string field "${field}".`)
    }
  }

  if (data.articleContent.trim().length <= 60) {
    throw new Error(`${filename}: articleContent must be longer than a placeholder teaser.`)
  }

  for (const field of REQUIRED_ARRAY_FIELDS) {
    if (!Array.isArray(data[field]) || data[field].length === 0) {
      throw new Error(`${filename}: missing required non-empty array field "${field}".`)
    }
  }

  if (PLACEHOLDER_PATTERN.test(raw)) {
    throw new Error(`${filename}: contains a TODO/template placeholder.`)
  }

  if (data.metrics !== undefined) {
    if (!Array.isArray(data.metrics)) {
      throw new Error(`${filename}: metrics must be an array.`)
    }
    for (const metric of data.metrics) {
      if (typeof metric?.label !== "string" || metric.label.trim().length === 0) {
        throw new Error(`${filename}: every metric needs a non-empty label.`)
      }
      if (typeof metric?.value !== "string" || metric.value.trim().length === 0) {
        throw new Error(`${filename}: every metric value must be a quoted string.`)
      }
    }
  }

  if (data.featured === true && (!Array.isArray(data.metrics) || data.metrics.length === 0)) {
    throw new Error(`${filename}: featured case files need at least one evidence metric.`)
  }

  if (data.recentHighlight !== undefined && typeof data.recentHighlight !== "boolean") {
    throw new Error(`${filename}: recentHighlight must be a boolean.`)
  }

  if (data.recentHighlight === true && data.featured !== true) {
    throw new Error(`${filename}: recentHighlight requires featured: true.`)
  }

  if (data.links !== undefined) {
    if (!Array.isArray(data.links)) {
      throw new Error(`${filename}: links must be an array.`)
    }
    for (const link of data.links) {
      if (typeof link?.label !== "string" || link.label.trim().length === 0) {
        throw new Error(`${filename}: every link needs a non-empty label.`)
      }
      if (typeof link?.href !== "string" || !/^https?:\/\//.test(link.href)) {
        throw new Error(`${filename}: every link needs an http(s) href.`)
      }
    }
  }

  console.log(`PASS ${filename}`)
}

console.log(`COUNT ${projectFiles.length}`)
