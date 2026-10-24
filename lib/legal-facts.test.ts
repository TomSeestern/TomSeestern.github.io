import { LegalFactsError, legalFactsSchema, legalFactsSource, readLegalFacts } from "./legal-facts"

const completeFacts = {
  name: "Test Person",
  street: "Teststrasse 1",
  postalCode: "12345",
  city: "Teststadt",
  country: "Deutschland",
  email: "test@example.com",
  phone: "+49 123 456789",
  mstvResponsible: {
    name: "Test Person",
    street: "Teststrasse 1",
    postalCode: "12345",
    city: "Teststadt",
    country: "Deutschland",
  },
  supervisoryAuthority: "Testaufsichtsbehörde",
  mailboxHost: "Test Mailbox Host",
  retentionPeriod: "6 Monate",
}

describe("legal facts", () => {
  it("rejects the shipped empty source and names every missing field", () => {
    expect(() => readLegalFacts()).toThrow(LegalFactsError)

    try {
      readLegalFacts()
      throw new Error("expected readLegalFacts to throw")
    } catch (error) {
      expect(error).toBeInstanceOf(LegalFactsError)
      const { missing } = error as LegalFactsError
      expect(missing).toContain("name")
      expect(missing).toContain("email")
      expect(missing).toContain("mstvResponsible.name")
      expect(missing).toContain("retentionPeriod")
    }
  })

  it("parses a complete source", () => {
    expect(readLegalFacts(completeFacts)).toMatchObject({
      name: "Test Person",
      mstvResponsible: { name: "Test Person" },
    })
  })

  it("treats the VAT id as optional", () => {
    expect(legalFactsSchema.safeParse(completeFacts).success).toBe(true)
    expect(legalFactsSchema.safeParse({ ...completeFacts, vatId: "DE123456789" }).success).toBe(true)
  })

  it("rejects an invalid contact email", () => {
    const result = legalFactsSchema.safeParse({ ...completeFacts, email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("ships an empty source until the owner fills it", () => {
    expect(legalFactsSource.name).toBe("")
  })
})
