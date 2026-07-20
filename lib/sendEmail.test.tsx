import {jest} from "@jest/globals"

const mockSend = jest.fn()

jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: {send: mockSend},
  })),
}))

const mockEnv: {RESEND_API_KEY: string | undefined} = {
  RESEND_API_KEY: "test-resend-key",
}

jest.mock("../env.mjs", () => ({env: mockEnv}))

let sendEmail: typeof import("./sendEmail").sendEmail

const emailRequest = {
  email: "sender@example.com",
  subject: "Portfolio enquiry",
  message: "Hello Tom",
}

describe("sendEmail", () => {
  beforeEach(async () => {
    mockEnv.RESEND_API_KEY = "test-resend-key"
    mockSend.mockReset()
    jest.resetModules()
    ;({sendEmail} = await import("./sendEmail"))
  })

  it("returns true and forwards contact details when Resend accepts email", async () => {
    // Given
    mockSend.mockResolvedValue({id: "email-id"})

    // When
    const sent = await sendEmail(emailRequest)

    // Then
    expect(sent).toBe(true)
    expect(mockSend).toHaveBeenCalledWith({
      from: "website@tomsegbers.de",
      reply_to: "sender@example.com",
      to: ["website@tomsegbers.de"],
      subject: "Portfolio enquiry",
      text: "Hello Tom",
    })
  })

  it("returns false when Resend rejects email", async () => {
    // Given
    process.env.RESEND_API_KEY = "test-resend-key"
    mockSend.mockRejectedValue(new Error("Resend unavailable"))
    const consoleError = jest.spyOn(console, "error").mockImplementation()

    // When
    const sent = await sendEmail(emailRequest)

    // Then
    expect(sent).toBe(false)
    expect(mockSend).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error))

    consoleError.mockRestore()
  })

  it("returns false without Resend API key and does not send email", async () => {
    // Given
    mockEnv.RESEND_API_KEY = undefined

    // When
    const sent = await sendEmail(emailRequest)

    // Then
    expect(sent).toBe(false)
    expect(mockSend).not.toHaveBeenCalled()
  })
})
