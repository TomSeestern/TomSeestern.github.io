import { jest } from "@jest/globals"

const mockSend = jest.fn()

jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: { send: mockSend },
  })),
}))

const mockHeadersGet = jest.fn()

jest.mock("next/headers", () => ({
  headers: jest.fn(() => ({
    get: mockHeadersGet,
  })),
}))

const mockEnv: {
  RESEND_API_KEY: string | undefined
  E2E_CONTACT_FORM_SUCCESS: string | undefined
} = {
  RESEND_API_KEY: "test-resend-key",
  E2E_CONTACT_FORM_SUCCESS: undefined,
}

jest.mock("../env.mjs", () => ({ env: mockEnv }))

let sendEmail: typeof import("./sendEmail").sendEmail

const validFormData = {
  name: "Test User",
  email: "sender@example.com",
  message: "Hello Tom",
}

describe("sendEmail", () => {
  beforeEach(async () => {
    mockEnv.RESEND_API_KEY = "test-resend-key"
    mockEnv.E2E_CONTACT_FORM_SUCCESS = undefined
    mockSend.mockReset()
    mockHeadersGet.mockReset()
    mockHeadersGet.mockReturnValue(null)
    jest.resetModules()
    ;({ sendEmail } = await import("./sendEmail"))
  })

  it("returns success for valid input when Resend accepts", async () => {
    mockSend.mockResolvedValue({ id: "email-id" })

    const result = await sendEmail(validFormData)

    expect(result).toEqual({ success: true })
    expect(mockSend).toHaveBeenCalledWith({
      from: "website@tomsegbers.de",
      reply_to: "sender@example.com",
      to: ["website@tomsegbers.de"],
      subject: "Portfolio contact from Test User",
      text: "Name: Test User\nEmail: sender@example.com\n\nHello Tom",
    })
  })

  it("returns field error for missing name", async () => {
    const result = await sendEmail({ ...validFormData, name: "" })

    expect(result).toEqual({
      success: false,
      errors: { name: "Please enter your name" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns field error for missing email", async () => {
    const result = await sendEmail({ ...validFormData, email: "" })

    expect(result).toEqual({
      success: false,
      errors: { email: "Email address is missing an @ symbol" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns field error for invalid email", async () => {
    const result = await sendEmail({ ...validFormData, email: "not-an-email" })

    expect(result).toEqual({
      success: false,
      errors: { email: "Email address is missing an @ symbol" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns field error for empty message", async () => {
    const result = await sendEmail({ ...validFormData, message: "" })

    expect(result).toEqual({
      success: false,
      errors: { message: "Please enter a message" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns form error when Resend API rejects", async () => {
    mockSend.mockRejectedValue(new Error("Resend unavailable"))
    const consoleError = jest.spyOn(console, "error").mockImplementation()

    const result = await sendEmail(validFormData)

    expect(result).toMatchObject({
      success: false,
      errors: { _form: expect.stringContaining("Failed to send email") },
    })
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error))
    consoleError.mockRestore()
  })

  it("returns form error when RESEND_API_KEY is not set", async () => {
    mockEnv.RESEND_API_KEY = undefined

    const result = await sendEmail(validFormData)

    expect(result).toEqual({
      success: false,
      errors: { _form: "Email service is not configured." },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns success via E2E shortcut without calling Resend", async () => {
    mockEnv.E2E_CONTACT_FORM_SUCCESS = "true"

    const result = await sendEmail(validFormData)

    expect(result).toEqual({ success: true })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns form error when rate limit exceeded", async () => {
    mockSend.mockResolvedValue({ id: "email-id" })

    // 5 requests within the window should succeed
    for (let i = 0; i < 5; i++) {
      const result = await sendEmail(validFormData)
      expect(result).toEqual({ success: true })
    }

    // 6th request should be rate limited
    const result = await sendEmail(validFormData)
    expect(result).toEqual({
      success: false,
      errors: { _form: "Too many messages. Please try again later." },
    })
  })

  it("extracts IP from x-forwarded-for header", async () => {
    mockHeadersGet.mockImplementation((key: string) => {
      if (key === "x-forwarded-for") return "192.168.1.42, 10.0.0.1"
      return null
    })
    mockSend.mockResolvedValue({ id: "email-id" })

    const result = await sendEmail(validFormData)

    expect(result).toEqual({ success: true })
  })
})
