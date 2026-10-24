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
    delete process.env.VERCEL_ENV
    mockSend.mockReset()
    mockHeadersGet.mockReset()
    mockHeadersGet.mockReturnValue(null)
    jest.resetModules()
    ;({ sendEmail } = await import("./sendEmail"))
  })

  it("returns success for valid input when Resend accepts", async () => {
    mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null } as never)

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
    mockSend.mockRejectedValue(new Error("Resend unavailable") as never)
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {})

    const result = await sendEmail(validFormData)

    expect(result).toMatchObject({
      success: false,
      errors: { _form: expect.stringContaining("Failed to send email") },
    })
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error))
    consoleError.mockRestore()
  })

  it("returns a form error when Resend resolves an API error", async () => {
    mockSend.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "from domain not verified" },
    } as never)
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {})

    const result = await sendEmail(validFormData)

    expect(result).toMatchObject({
      success: false,
      errors: { _form: expect.stringContaining("Failed to send email") },
    })
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it("returns a form error when Resend resolves without a message id", async () => {
    mockSend.mockResolvedValue({ data: {}, error: null } as never)
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {})

    const result = await sendEmail(validFormData)

    expect(result).toMatchObject({
      success: false,
      errors: { _form: expect.stringContaining("Failed to send email") },
    })
    consoleError.mockRestore()
  })

  it("returns a field error for a name over 100 characters", async () => {
    const result = await sendEmail({ ...validFormData, name: "a".repeat(101) })

    expect(result).toMatchObject({
      success: false,
      errors: { name: "Please keep your name under 100 characters" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns a field error for a name containing a line break", async () => {
    const result = await sendEmail({ ...validFormData, name: "Tom\r\nBcc: x@example.com" })

    expect(result).toMatchObject({
      success: false,
      errors: { name: "Please remove line breaks from your name" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("returns a field error for a message over 5000 characters", async () => {
    const result = await sendEmail({ ...validFormData, message: "m".repeat(5001) })

    expect(result).toMatchObject({
      success: false,
      errors: { message: "Please keep your message under 5000 characters" },
    })
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("ignores the E2E shortcut in a production deployment", async () => {
    process.env.VERCEL_ENV = "production"
    mockEnv.E2E_CONTACT_FORM_SUCCESS = "true"
    mockEnv.RESEND_API_KEY = undefined

    const result = await sendEmail(validFormData)

    expect(result).toEqual({
      success: false,
      errors: { _form: "Email service is not configured." },
    })
    expect(mockSend).not.toHaveBeenCalled()
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
    mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null } as never)

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

  it("returns validation error without consuming rate limit for invalid input", async () => {
    mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null } as never)

    const invalidData = { ...validFormData, name: "" }
    for (let i = 0; i < 6; i++) {
      const result = await sendEmail(invalidData)
      expect(result).toEqual({
        success: false,
        errors: { name: "Please enter your name" },
      })
    }

    const validResult = await sendEmail(validFormData)
    expect(validResult).toEqual({ success: true })
  })

  it("extracts IP from x-forwarded-for header", async () => {
    mockHeadersGet.mockImplementation(((key: string) => {
      if (key === "x-forwarded-for") return "192.168.1.42, 10.0.0.1"
      return null
    }) as any)
    mockSend.mockResolvedValue({ data: { id: "email-id" }, error: null } as never)

    const result = await sendEmail(validFormData)

    expect(result).toEqual({ success: true })
  })
})
