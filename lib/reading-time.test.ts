import { readingTimeLabel, readingTimeMinutes } from "./reading-time"

function words(count: number): string {
  return Array.from({ length: count }, () => "word").join(" ")
}

describe("reading-time", () => {
  it("always reports at least one minute", () => {
    // Given / When / Then
    expect(readingTimeMinutes("")).toBe(1)
    expect(readingTimeMinutes("short note")).toBe(1)
  })

  it("rounds up at 200 words per minute", () => {
    // Given / When / Then
    expect(readingTimeMinutes(words(200))).toBe(1)
    expect(readingTimeMinutes(words(201))).toBe(2)
    expect(readingTimeMinutes(words(400))).toBe(2)
    expect(readingTimeMinutes(words(401))).toBe(3)
  })

  it("ignores markdown punctuation when counting", () => {
    // Given / When
    const content = `# ${words(200)}`

    // Then
    expect(readingTimeMinutes(content)).toBe(1)
  })

  it("renders the display label", () => {
    // Given / When / Then
    expect(readingTimeLabel(words(400))).toBe("2 min read")
  })
})
