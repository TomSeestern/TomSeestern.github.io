import { PixelGlyph, type PixelGlyphName } from "../PixelArt/PixelGlyph"

export interface CapabilityIndexTechnology {
  readonly name: string
  readonly count: number
}

export interface CapabilityIndexProps {
  technologies: readonly CapabilityIndexTechnology[]
}

const capabilities: ReadonlyArray<{
  title: string
  description: string
  glyph: PixelGlyphName
}> = [
  {
    title: "Systems",
    description: "Service boundaries, data flows, and the unglamorous glue that keeps a product predictable.",
    glyph: "systems",
  },
  {
    title: "Interfaces",
    description: "Interfaces that make complex state legible, work by keyboard, and stay fast under real content.",
    glyph: "interfaces",
  },
  {
    title: "Delivery",
    description: "Pragmatic architecture, observability, and release paths that do not depend on heroics.",
    glyph: "delivery",
  },
  {
    title: "Product",
    description: "Working close enough to the problem to know which complexity is necessary and which is theatre.",
    glyph: "product",
  },
]

/**
 * The practice band is an index of capabilities, not a wall of technology
 * logos. The recurring tools sit underneath as evidence, in the same terminal
 * voice as the case files.
 */
export function CapabilityIndex({ technologies }: CapabilityIndexProps) {
  return (
    <>
      <div data-testid="home-practice" className="mt-9 grid gap-x-12 sm:grid-cols-2">
        {capabilities.map((capability, index) => (
          <article
            key={capability.title}
            className="group grid grid-flow-col grid-cols-[1.25rem_minmax(0,1fr)] grid-rows-[auto_1fr] gap-x-4 gap-y-3 border-t border-rule py-5"
          >
            <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">
              {String(index + 1).padStart(2, "0")}
            </span>
            <PixelGlyph
              name={capability.glyph}
              className="size-4 text-ink-muted transition-colors duration-200 group-hover:text-crimson"
            />
            <h3 className="text-h3 text-ink">{capability.title}</h3>
            <p className="max-w-measure-card font-body text-sm leading-relaxed text-ink-muted">
              {capability.description}
            </p>
          </article>
        ))}
      </div>

      {technologies.length > 0 ? (
        <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-rule pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
          <span className="text-crimson">Recurring tools</span>
          {technologies.map((technology) => (
            <span key={technology.name}>
              {technology.name} {String(technology.count).padStart(2, "0")}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}

export default CapabilityIndex
