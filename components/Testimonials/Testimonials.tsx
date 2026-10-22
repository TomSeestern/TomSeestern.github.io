import React from "react"
import { SectionHeading } from "../SectionHeading/SectionHeading"

type IllustrativeExample = {
  readonly id: string
  readonly quote: string
  readonly attribution: string
}

// Placeholder examples only (R19.1 / UWG §5). The quotes are intentionally
// written as examples and attributed to generic roles — never real people or
// companies — and the visible "Example" badge plus disclaimer below makes that
// unmistakable in the rendered UI. Replace with real, approved quotes and
// remove the labelling only when genuine testimonials exist.
const ILLUSTRATIVE_EXAMPLES: readonly IllustrativeExample[] = [
  {
    id: "product-lead",
    quote:
      "Placeholder quote. This shows where a short client testimonial would appear and illustrates the intended length and tone.",
    attribution: "Example — Product Lead",
  },
  {
    id: "engineering-manager",
    quote:
      "Another illustrative quote. It demonstrates the layout only and is not a real endorsement from any person or company.",
    attribution: "Example — Engineering Manager",
  },
  {
    id: "startup-founder",
    quote: "A third example quote. Replace every placeholder with real, approved feedback before publishing.",
    attribution: "Example — Startup Founder",
  },
]

const EXAMPLE_DISCLAIMER = "Illustrative examples — not real client testimonials."

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading id="testimonials-heading" title="Illustrative examples" lead={EXAMPLE_DISCLAIMER} />
        <p className="max-w-measure-card rounded-full border border-rule-strong bg-panel px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          Example only
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {ILLUSTRATIVE_EXAMPLES.map((example) => (
          <figure
            key={example.id}
            className="flex flex-col gap-4 rounded-lg border border-rule bg-panel p-5"
            data-testid="illustrative-example"
          >
            <blockquote className="font-body text-body leading-7 text-ink">
              <p>{example.quote}</p>
            </blockquote>
            <figcaption className="mt-auto border-t border-rule pt-3">
              <cite className="font-mono text-[10px] uppercase not-italic tracking-[0.12em] text-crimson">
                {example.attribution}
              </cite>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
