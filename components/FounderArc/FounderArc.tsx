import React from "react"

type FounderArcBeat = {
  readonly id: string
  readonly label: string
}

// T25 owns the final founder-arc copy. This scaffold renders structure only:
// neutral, non-factual beat labels — no biography, metrics, clients, or
// outcomes (R19.1). T25 replaces the labels and adds the narrative copy.
const FOUNDER_ARC_BEATS: readonly FounderArcBeat[] = [
  { id: "01", label: "Origin" },
  { id: "02", label: "Turning Point" },
  { id: "03", label: "Practice" },
  { id: "04", label: "Direction" },
]

export default function FounderArc() {
  return (
    <section className="bg-surface-muted" aria-labelledby="founder-arc-heading">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <h2 id="founder-arc-heading" className="text-h2-sm text-foreground sm:text-h2">
          Background
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {FOUNDER_ARC_BEATS.map((beat, index) => (
            <li
              key={beat.id}
              data-testid="founder-arc-beat"
              className={
                index === 0
                  ? "border-t border-border pt-6 lg:border-t-0 lg:pt-0"
                  : "border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              }
            >
              <span className="text-caption uppercase tracking-widest text-accent-secondary">{beat.id}</span>
              <h3 className="mt-3 text-h3-sm text-foreground">{beat.label}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
