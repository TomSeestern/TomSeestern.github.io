import { getTopTechnologies } from "./technologies"

describe("getTopTechnologies", () => {
  it("counts technologies across projects and sorts by count then name", () => {
    // Given
    const projects = [
      { technologies: ["React", "TypeScript", "AWS"] },
      { technologies: ["React", "Node.js"] },
      { technologies: ["AWS", "React"] },
    ]

    // When
    const result = getTopTechnologies(projects, 3)

    // Then
    expect(result.map(({ name, count }) => [name, count])).toEqual([
      ["React", 3],
      ["AWS", 2],
      ["Node.js", 1],
    ])
  })

  it("resolves an icon path when the public icon exists", () => {
    // Given / When
    const [react] = getTopTechnologies([{ technologies: ["React"] }], 1)

    // Then
    expect(react?.iconPath).toBe("/icon/react.svg")
  })

  it("returns no entries for a non-positive limit", () => {
    // Given / When / Then
    expect(getTopTechnologies([{ technologies: ["React"] }], 0)).toEqual([])
  })
})
