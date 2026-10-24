import { createSitemapEntries } from "./sitemap"
import { getAllTags, MIN_INDEXABLE_TAG_ENTRIES } from "./tags"

const BASE_URL = "https://tomsegbers.de"

describe("sitemap", () => {
  it("is stable across calls so lastmod carries information", () => {
    const first = createSitemapEntries(BASE_URL)
    const second = createSitemapEntries(BASE_URL)

    expect(second).toEqual(first)
  })

  it("omits lastModified from routes that have no content date", () => {
    const entries = createSitemapEntries(BASE_URL)
    const staticEntry = entries.find((entry) => entry.url === `${BASE_URL}/about`)
    const contactEntry = entries.find((entry) => entry.url === `${BASE_URL}/contact`)

    expect(staticEntry).toBeDefined()
    expect(staticEntry?.lastModified).toBeUndefined()
    expect(contactEntry?.lastModified).toBeUndefined()
  })

  it("keeps a real date on blog entries", () => {
    const entries = createSitemapEntries(BASE_URL)
    const blogEntry = entries.find((entry) => entry.url.includes("/blog/entry/"))

    expect(blogEntry?.lastModified).toBeInstanceOf(Date)
  })

  it("lists no tag page that is noindex", () => {
    const entries = createSitemapEntries(BASE_URL)
    const listedTagUrls = new Set(entries.map((entry) => entry.url).filter((url) => url.includes("/tags/")))
    const thinTags = getAllTags().filter((tag) => tag.count < MIN_INDEXABLE_TAG_ENTRIES)

    expect(thinTags.length).toBeGreaterThan(0)
    for (const tag of thinTags) {
      expect(listedTagUrls.has(`${BASE_URL}/tags/${tag.slug}`)).toBe(false)
    }
  })

  it("still lists every tag page above the threshold", () => {
    const entries = createSitemapEntries(BASE_URL)
    const listedTagUrls = new Set(entries.map((entry) => entry.url))
    const indexableTags = getAllTags().filter((tag) => tag.count >= MIN_INDEXABLE_TAG_ENTRIES)

    for (const tag of indexableTags) {
      expect(listedTagUrls.has(`${BASE_URL}/tags/${tag.slug}`)).toBe(true)
    }
  })

  it("serves every entry from the public origin", () => {
    const entries = createSitemapEntries(BASE_URL)

    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      expect(new URL(entry.url).origin).toBe(BASE_URL)
    }
  })
})
