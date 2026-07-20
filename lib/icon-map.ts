import fs from "fs"
import path from "path"

const ICONS_DIR = path.join(process.cwd(), "public", "icon")

/** Set of known icon filenames (lowercased) read once at module load.
 *  Falls back to empty set when fs is unavailable (e.g. browser/Storybook). */
let knownIcons: Set<string>
try {
  knownIcons = new Set(fs.readdirSync(ICONS_DIR).map((f: string) => f.toLowerCase()))
} catch {
  knownIcons = new Set()
}

/**
 * Normalize a technology name to match icon filename convention.
 * Matches the original `(tech + ".svg").replace(" ", "").toLowerCase().trim()` logic.
 */
function normalizeTechName(techName: string): string {
  return (techName + ".svg").replaceAll(" ", "").toLowerCase().trim()
}

/**
 * Look up the icon path for a given technology name.
 * Returns the public URL path (e.g. `/icon/react.svg`) if an icon exists,
 * or `null` if no matching icon file is found.
 */
export function getIconPath(techName: string): string | null {
  const normalizedFilename = normalizeTechName(techName)
  if (knownIcons.has(normalizedFilename)) {
    return `/icon/${normalizedFilename}`
  }
  return null
}
