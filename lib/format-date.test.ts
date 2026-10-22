import { formatDate, formatYear } from "./format-date"

describe("format-date", () => {
  it("formats an absolute UTC date in uppercase en-GB form", () => {
    // Given / When
    const formatted = formatDate(new Date("2021-12-31T23:30:00Z"))

    // Then
    expect(formatted).toBe("31 DEC 2021")
  })

  it("uses UTC rather than the host timezone", () => {
    // Given — this instant is 2021 in UTC but 2022 in UTC+2.
    const instant = new Date("2021-12-31T23:30:00Z")

    // When / Then
    expect(formatYear(instant)).toBe("2021")
  })

  it("formats the four-digit year", () => {
    // Given / When / Then
    expect(formatYear(new Date("2020-01-01T00:00:00Z"))).toBe("2020")
  })
})
