import { metadata } from "./page"

jest.mock("./ContactForm", () => ({
  __esModule: true,
  default: () => null,
}))

describe("contact page", () => {
  it("exports a page title", () => {
    expect(metadata.title).toBe("Contact")
  })

  it("exports a non-empty description", () => {
    expect(typeof metadata.description).toBe("string")
    expect(metadata.description).not.toHaveLength(0)
  })

  it("exports the canonical URL for the contact route", () => {
    expect(metadata.alternates?.canonical).toBe("https://tom.segbers.de/contact")
  })
})
