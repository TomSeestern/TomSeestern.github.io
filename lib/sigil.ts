export type SigilColor = "ink" | "crimson" | "gold"

export interface SigilPath {
  readonly color: SigilColor
  readonly d: string
}

const GRID = 8
const CELL = 8

/**
 * FNV-1a over the slug. A stable 32-bit seed keeps every project/article sigil
 * reproducible across builds and servers without storing generated art.
 */
export function fnv1a(value: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** Mulberry32: tiny, deterministic PRNG for the 4-column half-grid. */
function mulberry32(seed: number): () => number {
  return () => {
    let value = (seed += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function rect(x: number, y: number): string {
  return `M${x * CELL} ${y * CELL}h${CELL}v${CELL}h-${CELL}Z`
}

/**
 * Builds an 8×8 mirrored glyph and groups its lit cells by token colour. Every
 * colour becomes one `<path>` with many rectangle subpaths, so a sigil is 2–3
 * DOM nodes instead of 64. The mirror makes a random half-grid read as a
 * deliberate emblem.
 */
export function createSigil(slug: string): readonly SigilPath[] {
  const random = mulberry32(fnv1a(slug))
  const lit = new Set<string>()

  for (let row = 0; row < GRID; row += 1) {
    for (let column = 0; column < GRID / 2; column += 1) {
      if (random() > 0.46) {
        lit.add(`${row}:${column}`)
        lit.add(`${row}:${GRID - 1 - column}`)
      }
    }
  }

  // Guarantee a readable mark even for an unlucky seed.
  const forced = [
    [2, 2],
    [2, 5],
    [3, 3],
    [3, 4],
    [4, 2],
    [4, 5],
    [5, 3],
    [5, 4],
  ] as const
  for (const [row, column] of forced) lit.add(`${row}:${column}`)

  const cells = Array.from(lit).map((key) => {
    const [row, column] = key.split(":").map(Number) as [number, number]
    return { row, column }
  })

  const colored = new Map<string, SigilColor>()
  for (const { row, column } of cells) {
    colored.set(`${row}:${column}`, "ink")
  }

  // Accent rails give the grid structure; the seed determines which lit cells
  // become crimson, while a deterministic pair anchors the gold highlight.
  for (const { row, column } of cells) {
    if ((row + column) % 4 === 0) colored.set(`${row}:${column}`, "crimson")
  }
  const ordered = cells.slice().sort((a, b) => a.row - b.row || a.column - b.column)
  const goldIndex = fnv1a(slug) % ordered.length
  const goldCell = ordered[goldIndex]
  if (goldCell) colored.set(`${goldCell.row}:${goldCell.column}`, "gold")
  const crimsonCell = ordered[(goldIndex + 3) % ordered.length]
  if (crimsonCell) colored.set(`${crimsonCell.row}:${crimsonCell.column}`, "crimson")

  const groups: Record<SigilColor, string[]> = { ink: [], crimson: [], gold: [] }
  for (const { row, column } of ordered) {
    const color = colored.get(`${row}:${column}`) ?? "ink"
    groups[color].push(rect(column, row))
  }

  return (["ink", "crimson", "gold"] as const)
    .filter((color) => groups[color].length > 0)
    .map((color) => ({ color, d: groups[color].join("") }))
}
