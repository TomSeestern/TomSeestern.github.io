import { LegalFactsError, legalFactsSchema, readLegalFacts } from "./legal-facts"

const completeFacts = {
  name: "Test Person",
  street: "c/o Teststrasse 1",
  postalCode: "12345",
  city: "Teststadt",
  country: "Deutschland",
  email: "test@example.com",
  mstvResponsible: {
    name: "Test Person",
    street: "c/o Teststrasse 1",
    postalCode: "12345",
    city: "Teststadt",
    country: "Deutschland",
  },
  retentionPeriod: "sechs Monate nach der letzten Nachricht",
}

function missingFrom(source: unknown): readonly string[] {
  try {
    readLegalFacts(source)
  } catch (error) {
    expect(error).toBeInstanceOf(LegalFactsError)
    return (error as LegalFactsError).missing
  }

  throw new Error("expected readLegalFacts to throw")
}

describe("legal facts", () => {
  it("names every missing required field", () => {
    // An absent object reports at its own path; a present-but-empty one reports
    // at the failing leaf, which the next test covers.
    expect(missingFrom({})).toEqual(expect.arrayContaining(["name", "email", "retentionPeriod", "mstvResponsible"]))
  })

  it("refuses an incomplete postal address instead of rendering a gap", () => {
    expect(missingFrom({ ...completeFacts, postalCode: "" })).toContain("postalCode")
    expect(missingFrom({ ...completeFacts, city: "" })).toContain("city")
  })

  it("parses a complete source", () => {
    expect(readLegalFacts(completeFacts)).toMatchObject({
      name: "Test Person",
      mstvResponsible: { name: "Test Person" },
    })
  })

  it("treats phone and VAT id as optional", () => {
    expect(legalFactsSchema.safeParse(completeFacts).success).toBe(true)
    expect(legalFactsSchema.safeParse({ ...completeFacts, phone: "+49 123 456789" }).success).toBe(true)
    expect(legalFactsSchema.safeParse({ ...completeFacts, vatId: "DE123456789" }).success).toBe(true)
  })

  it("rejects an invalid contact email", () => {
    const result = legalFactsSchema.safeParse({ ...completeFacts, email: "not-an-email" })
    expect(result.success).toBe(false)
  })
})
