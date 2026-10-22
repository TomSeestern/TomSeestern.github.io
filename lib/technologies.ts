import { getIconPath } from "./icon-map"

export interface TechnologySummary {
  readonly name: string
  readonly count: number
  readonly iconPath: string | null
}

export interface TechnologySource {
  readonly technologies: readonly string[]
}

/**
 * Counts every technology across the supplied projects, then returns the most
 * common `limit` entries. Ties sort by display name so the practice band is
 * stable between builds.
 */
export function getTopTechnologies(projects: readonly TechnologySource[], limit = 8): readonly TechnologySummary[] {
  if (limit <= 0) return []

  const counts = new Map<string, { name: string; count: number }>()
  for (const project of projects) {
    for (const rawTechnology of project.technologies) {
      const name = rawTechnology.trim()
      if (!name) continue
      const existing = counts.get(name)
      if (existing) existing.count += 1
      else counts.set(name, { name, count: 1 })
    }
  }

  return Array.from(counts.values())
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
    .slice(0, limit)
    .map(({ name, count }) => ({ name, count, iconPath: getIconPath(name) }))
}
