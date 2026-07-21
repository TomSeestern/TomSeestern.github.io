import fs from "fs"
import os from "os"
import path from "path"
import { getAllMarkdownEntries } from "./markdown"

const TEST_DIRECTORY_PREFIX = "tomsegbers-markdown-reader-"

function writeMarkdownEntry(directoryPath: string, filename: string, frontmatter: string): void {
  fs.writeFileSync(path.join(directoryPath, filename), `---\n${frontmatter}\n---\n\n# Entry\n`)
}

describe("getAllMarkdownEntries", () => {
  let fixtureDirectory = ""

  beforeEach(() => {
    fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), TEST_DIRECTORY_PREFIX))
  })

  afterEach(() => {
    fs.rmSync(fixtureDirectory, { recursive: true, force: true })
  })

  it("parses valid frontmatter and preserves article teaser fields", () => {
    // Given
    writeMarkdownEntry(
      fixtureDirectory,
      "valid-entry.md",
      [
        "title: Valid entry",
        "articleDate: 2024-03-01",
        "articleContent: Valid teaser",
        "authorImgSrc: /img/tom.png",
        "authorName: Tom",
        "technologies:",
        "  - TypeScript",
      ].join("\n")
    )

    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries).toEqual([
      {
        id: "valid-entry",
        title: "Valid entry",
        articleDate: new Date("2024-03-01"),
        articleContent: "Valid teaser",
        authorImgSrc: "/img/tom.png",
        authorName: "Tom",
        fullArticleLink: "/blog/entry/valid-entry",
        technologies: ["TypeScript"],
        tags: [],
      },
    ])
  })

  it("applies consumer-safe defaults when frontmatter fields are missing", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "missing-fields.md", "")

    // When
    const [entry] = getAllMarkdownEntries(fixtureDirectory, "/projects")

    // Then
    expect(entry).toEqual({
      id: "missing-fields",
      title: "Untitled",
      articleDate: new Date("1990-01-01"),
      articleContent: "Failed to load content",
      authorImgSrc: "/img/placeholder.png",
      authorName: "Anonymous",
      fullArticleLink: "/projects/entry/missing-fields",
      technologies: [],
      tags: [],
    })
  })

  it("applies defaults when frontmatter field values are malformed", () => {
    // Given
    writeMarkdownEntry(
      fixtureDirectory,
      "malformed-fields.md",
      ["title:", "  - unexpected", "articleDate: not-a-date", "technologies: TypeScript"].join("\n")
    )

    // When
    const [entry] = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entry).toMatchObject({
      title: "Untitled",
      articleDate: new Date("1990-01-01"),
      technologies: [],
    })
  })

  it("returns no entries when directory is empty", () => {
    // Given
    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries).toEqual([])
  })

  it("ignores non-Markdown files", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "post.md", "title: Post")
    fs.writeFileSync(path.join(fixtureDirectory, "notes.txt"), "not markdown")

    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries.map(({ id }) => id)).toEqual(["post"])
  })

  it("sorts entries by article date descending", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "older.md", "articleDate: 2020-01-01")
    writeMarkdownEntry(fixtureDirectory, "newer.md", "articleDate: 2024-01-01")

    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries.map(({ id }) => id)).toEqual(["newer", "older"])
  })

  it("uses filename slug for identifier and entry URL", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "reliable-slug.md", "title: Entry")

    // When
    const [entry] = getAllMarkdownEntries(fixtureDirectory, "/projects")

    // Then
    expect(entry).toMatchObject({
      id: "reliable-slug",
      fullArticleLink: "/projects/entry/reliable-slug",
    })
  })

  it("preserves multiple technology names", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "technology-stack.md", "technologies:\n  - TypeScript\n  - Next.js")

    // When
    const [entry] = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entry?.technologies).toEqual(["TypeScript", "Next.js"])
  })

  it("defaults malformed author fields independently", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "malformed-author.md", "authorImgSrc: 42\nauthorName: [invalid]")

    // When
    const [entry] = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entry).toMatchObject({
      authorImgSrc: "/img/placeholder.png",
      authorName: "Anonymous",
    })
  })

  it("defaults malformed article content without discarding valid title", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "mixed-frontmatter.md", "title: Preserved title\narticleContent: [invalid]")

    // When
    const [entry] = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entry).toMatchObject({
      title: "Preserved title",
      articleContent: "Failed to load content",
    })
  })

  it("ignores Markdown-looking directory names", () => {
    // Given
    fs.mkdirSync(path.join(fixtureDirectory, "nested.md"))
    writeMarkdownEntry(fixtureDirectory, "actual-entry.md", "title: Entry")

    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries.map(({ id }) => id)).toEqual(["actual-entry"])
  })

  it("includes entries with default date after dated entries", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "undated.md", "title: Undated")
    writeMarkdownEntry(fixtureDirectory, "dated.md", "articleDate: 2024-01-01")

    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries.map(({ id }) => id)).toEqual(["dated", "undated"])
  })
})
