import { z } from "zod"

/**
 * Legal facts published by `/impressum` and `/datenschutz`.
 *
 * They live here, not inline in the pages, so a missing fact fails the build
 * instead of rendering a visible placeholder on a live commercial domain
 * (§ 5 DDG, § 18 Abs. 2 MStV, Art. 13 DSGVO).
 *
 * `vatId` is optional on purpose: § 27a UStG only requires one where the
 * operator actually holds a USt-IdNr.
 */
const postalAddressSchema = z.object({
  street: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
})

export const legalFactsSchema = z.object({
  name: z.string().min(1),
  street: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  vatId: z.string().min(1).optional(),
  mstvResponsible: z
    .object({
      name: z.string().min(1),
    })
    .and(postalAddressSchema),
  supervisoryAuthority: z.string().min(1),
  mailboxHost: z.string().min(1),
  retentionPeriod: z.string().min(1),
})

export type LegalFacts = z.infer<typeof legalFactsSchema>

/**
 * The facts the site owner must provide. Empty by design until they do: the
 * runtime check below turns each empty string into a build failure naming the
 * field, which is the only reliable way to keep an unfilled legal notice from
 * shipping.
 *
 * Typed as `unknown` input on purpose — the empty literal must not satisfy
 * `LegalFacts`, or the compiler would hide the gap this check exists to catch.
 */
export const legalFactsSource: Record<string, unknown> = {
  name: "",
  street: "",
  postalCode: "",
  city: "",
  country: "",
  email: "",
  phone: "",
  mstvResponsible: {
    name: "",
    street: "",
    postalCode: "",
    city: "",
    country: "",
  },
  supervisoryAuthority: "",
  mailboxHost: "",
  retentionPeriod: "",
}

/** Thrown when a page renders before the legal facts are complete. */
export class LegalFactsError extends Error {
  readonly missing: readonly string[]

  constructor(missing: readonly string[]) {
    super(
      `Legal facts are incomplete: ${missing.join(
        ", "
      )}. Fill legalFactsSource in lib/legal-facts.ts before publishing.`
    )
    this.name = "LegalFactsError"
    this.missing = missing
  }
}

/**
 * Parse and return the legal facts.
 *
 * Throws `LegalFactsError` when any required fact is missing. Because both
 * legal pages call this during render, an incomplete source fails `next build`
 * rather than publishing `TODO(Tom)`.
 *
 * @param source — overridable for tests; defaults to {@link legalFactsSource}.
 */
export function readLegalFacts(source: unknown = legalFactsSource): LegalFacts {
  const parsed = legalFactsSchema.safeParse(source)

  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".") || "(root)")
    throw new LegalFactsError(missing)
  }

  return parsed.data
}
