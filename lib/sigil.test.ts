import { createSigil, fnv1a } from "./sigil"

describe("sigil", () => {
  it("hashes deterministically and distinguishes slugs", () => {
    // Given / When
    const first = fnv1a("paymenow")
    const second = fnv1a("paymenow")

    // Then
    expect(first).toBe(second)
    expect(first).not.toBe(fnv1a("iseeunet"))
  })

  it("builds a deterministic 2–3 path sigil for the same slug", () => {
    // Given / When
    const first = createSigil("paymenow")
    const second = createSigil("paymenow")

    // Then
    expect(first).toEqual(second)
    expect(first.length).toBeGreaterThanOrEqual(2)
    expect(first.length).toBeLessThanOrEqual(3)
    expect(first.every((path) => path.d.startsWith("M"))).toBe(true)
  })

  it("serialises every lit cell into path data, never rect nodes", () => {
    // Given / When
    const paths = createSigil("2020-soudest-backend-nodejs")

    // Then
    expect(paths.length).toBeLessThanOrEqual(4)
    expect(paths.some((path) => path.d.includes("h8v8h-8Z"))).toBe(true)
    expect(paths.map((path) => path.color)).toEqual(expect.arrayContaining(["ink"]))
  })

  it("gives different projects different glyphs", () => {
    // Given / When
    const first = createSigil("project-a")
    const second = createSigil("project-b")

    // Then
    expect(first).not.toEqual(second)
  })
})
