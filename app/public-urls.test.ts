import robots from "./robots"
import sitemap from "./sitemap"

const PUBLIC_ORIGIN = "https://tomsegbers.de"

describe("public URL metadata", () => {
  it("serves every sitemap entry from the public domain", async () => {
    // Given / When
    const entries = await sitemap()

    // Then
    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      expect(new URL(entry.url).origin).toBe(PUBLIC_ORIGIN)
    }
  })

  it("points robots.txt at the public sitemap", () => {
    // Given / When
    const value = robots()

    // Then
    expect(value.sitemap).toBe(`${PUBLIC_ORIGIN}/sitemap.xml`)
  })
})
