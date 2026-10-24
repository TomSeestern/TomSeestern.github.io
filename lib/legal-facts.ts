import { z } from "zod"

/**
 * Legal facts published by `/impressum` and `/datenschutz`.
 *
 * They live here, not inline in the pages, so a missing fact fails the build
 * instead of rendering a visible placeholder on a live domain (§ 5 DDG,
 * § 18 Abs. 2 MStV, Art. 13 DSGVO).
 *
 * Only the facts that legally apply to a natural person operating this site are
 * required. `phone`, `vatId` and `supervisoryAuthority` are optional because
 * none of them is mandatory here: § 5 Abs. 1 Nr. 2 DDG asks for a channel that
 * enables immediate contact (the e-mail address satisfies it), § 27a UStG only
 * applies to holders of a USt-IdNr., and Art. 13 DSGVO does not require naming
 * a supervisory authority.
 *
 * There is no `mailboxHost` field: `web@tomsegbers.de` is not outsourced to a
 * mailbox provider, so there is no processor to disclose.
 */
export const legalFactsSchema = z.object({
  name: z.string().min(1),
  street: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  vatId: z.string().min(1).optional(),
  mstvResponsible: z.object({
    name: z.string().min(1),
    street: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  /** Stated policy, not a placeholder: it must match how enquiries are handled. */
  retentionPeriod: z.string().min(1),
})

export type LegalFacts = z.infer<typeof legalFactsSchema>

/**
 * The facts the site owner must provide. Empty values are deliberate until the
 * owner supplies them: the runtime check below turns each one into a build
 * failure that names the field, which is the only reliable way to keep an
 * unfilled legal notice from shipping.
 *
 * Typed as `Record<string, unknown>` on purpose — an empty literal must not
 * satisfy `LegalFacts`, or the compiler would hide the gap this check exists to
 * catch.
 */
export const legalFactsSource: Record<string, unknown> = {
  name: "Tom Segbers",
  street: "c/o Drei-Kreuz-Straße 26",
  postalCode: "89584",
  city: "Ehingen (Donau)",
  country: "Deutschland",
  email: "web@tomsegbers.de",
  mstvResponsible: {
    name: "Tom Segbers",
    street: "c/o Drei-Kreuz-Straße 26",
    postalCode: "89584",
    city: "Ehingen (Donau)",
    country: "Deutschland",
  },
  retentionPeriod:
    "Kontaktanfragen und die daraus entstehende Korrespondenz werden nach Abschluss der Bearbeitung, spätestens " +
    "sechs Monate nach der letzten Nachricht, gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten " +
    "entgegenstehen.",
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
