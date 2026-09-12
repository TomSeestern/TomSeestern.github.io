import React from "react"

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

const EXAMPLE_BADGE_LABEL = "Example"
const EXAMPLE_DISCLAIMER = "Illustrative examples — not real client testimonials."

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="mt-12 lg:mt-16">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-caption font-semibold uppercase tracking-widest text-accent-soft-foreground">
          {EXAMPLE_BADGE_LABEL}
        </span>
        <h2 id="testimonials-heading" className="text-h2-sm text-foreground sm:text-h2">
          Illustrative feedback
        </h2>
        <p className="text-body font-medium text-muted">{EXAMPLE_DISCLAIMER}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {ILLUSTRATIVE_EXAMPLES.map((example) => (
          <figure
            key={example.id}
            className="flex flex-col gap-4 rounded-lg bg-surface-muted p-6"
            data-testid="illustrative-example"
          >
            <blockquote className="text-body text-foreground">
              <p>{example.quote}</p>
            </blockquote>
            <figcaption className="mt-auto">
              <cite className="text-small font-medium not-italic text-muted">{example.attribution}</cite>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
