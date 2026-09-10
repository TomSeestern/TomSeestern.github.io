import { fireEvent, render, screen } from "@testing-library/react"
import ContactForm from "./ContactForm"
import { sendEmail } from "../../lib/sendEmail"

jest.mock("../../lib/sendEmail", () => ({ sendEmail: jest.fn() }))

const mockSendEmail = jest.mocked(sendEmail)

const INVALID_EMAIL_MESSAGE = "Email address is missing an @ symbol"
const MISSING_NAME_MESSAGE = "Please enter your name"

describe("ContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSendEmail.mockResolvedValue({ success: true })
  })

  it("does not validate while typing (blur-only validation)", () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText("Your Email"), { target: { value: "not-an-email" } })

    expect(screen.queryByText(INVALID_EMAIL_MESSAGE)).not.toBeInTheDocument()
  })

  it("shows an inline error on blur for an edited invalid field", () => {
    render(<ContactForm />)

    const email = screen.getByLabelText("Your Email")
    fireEvent.change(email, { target: { value: "not-an-email" } })
    fireEvent.blur(email)

    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).toBeInTheDocument()
  })

  it("wires aria-describedby and aria-invalid to the field error", () => {
    render(<ContactForm />)

    const email = screen.getByLabelText("Your Email")
    fireEvent.change(email, { target: { value: "not-an-email" } })
    fireEvent.blur(email)

    expect(screen.getByText(INVALID_EMAIL_MESSAGE)).toHaveAttribute("id", "email-error")
    expect(email).toHaveAttribute("aria-describedby", "email-error")
    expect(email).toHaveAttribute("aria-invalid", "true")
  })

  it("does not flag an untouched empty field on its first blur", () => {
    render(<ContactForm />)

    const name = screen.getByLabelText("Your Name")
    fireEvent.focus(name)
    fireEvent.blur(name)

    expect(screen.queryByText(MISSING_NAME_MESSAGE)).not.toBeInTheDocument()
    expect(name).not.toHaveAttribute("aria-invalid")
  })

  it("announces the success message as a polite live region", async () => {
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText("Your Name"), { target: { value: "Tom" } })
    fireEvent.change(screen.getByLabelText("Your Email"), { target: { value: "sender@example.com" } })
    fireEvent.change(screen.getByLabelText("Your Message"), { target: { value: "Hello." } })
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }))

    const status = await screen.findByRole("status")
    expect(status).toHaveTextContent("Email sent successfully.")
  })
})
