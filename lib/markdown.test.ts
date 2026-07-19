import fs from "fs"
import os from "os"
import path from "path"
import {getAllMarkdownEntries} from "./markdown"

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
    fs.rmSync(fixtureDirectory, {recursive: true, force: true})
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
      ].join("\n"),
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
    })
  })

  it("applies defaults when frontmatter field values are malformed", () => {
    // Given
    writeMarkdownEntry(
      fixtureDirectory,
      "malformed-fields.md",
      ["title:", "  - unexpected", "articleDate: not-a-date", "technologies: TypeScript"].join("\n"),
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
    expect(entries.map(({id}) => id)).toEqual(["post"])
  })

  it("sorts entries by article date descending", () => {
    // Given
    writeMarkdownEntry(fixtureDirectory, "older.md", "articleDate: 2020-01-01")
    writeMarkdownEntry(fixtureDirectory, "newer.md", "articleDate: 2024-01-01")

    // When
    const entries = getAllMarkdownEntries(fixtureDirectory, "/blog")

    // Then
    expect(entries.map(({id}) => id)).toEqual(["newer", "older"])
  })
})
