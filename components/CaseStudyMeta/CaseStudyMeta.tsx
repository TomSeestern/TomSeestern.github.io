import React from "react"

export type CaseStudyMetric = {
  readonly label: string
  readonly value: string
}

export type CaseStudyMetaProps = {
  readonly role: string
  readonly outcome: string
  readonly metrics: readonly CaseStudyMetric[]
}

type MetaRow = {
  readonly label: string
  readonly value: string
}

function buildMetaRows(role: string, outcome: string): readonly MetaRow[] {
  return [
    { label: "Role", value: role.trim() },
    { label: "Outcome", value: outcome.trim() },
  ].filter((row) => row.value.length > 0)
}

function carriesProof(metric: CaseStudyMetric): boolean {
  return metric.label.trim().length > 0 && metric.value.trim().length > 0
}

export default function CaseStudyMeta({ role, outcome, metrics }: CaseStudyMetaProps): JSX.Element | null {
  const metaRows = buildMetaRows(role, outcome)
  const measuredProof = metrics.filter(carriesProof)

  if (metaRows.length === 0 && measuredProof.length === 0) {
    return null
  }

  return (
    <section data-testid="case-study-meta" aria-label="Case study details" className="not-prose mt-8">
      {metaRows.length > 0 ? (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {metaRows.map((row) => (
            <div key={row.label} className="border-t border-border-subtle pt-4">
              <dt className="text-caption uppercase tracking-widest text-accent-secondary">{row.label}</dt>
              <dd className="mt-1 max-w-measure-lead text-body text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {measuredProof.length > 0 ? (
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
          {measuredProof.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="flex flex-col-reverse gap-1">
              <dt className="text-caption uppercase tracking-wide text-muted">{metric.label}</dt>
              <dd className="text-h3-sm text-foreground sm:text-h3">{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}
