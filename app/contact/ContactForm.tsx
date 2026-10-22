"use client"

import React, { useState } from "react"
import { Alert } from "../../components/Alert/Alert"
import { buttonStyles } from "../../components/Button/Button"
import { sendEmail, type SendEmailResult } from "../../lib/sendEmail"

type FieldName = "name" | "email" | "message"

const fieldErrorMessages: Record<FieldName, string> = {
  name: "Please enter your name",
  email: "Email address is missing an @ symbol",
  message: "Please enter a message",
}

// Mirrors the server-side Zod `.email()` gate closely enough for an inline
// hint; the server action remains the authoritative validation boundary.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClasses =
  "focus-ring block min-h-12 w-full rounded-md border border-rule-strong bg-canvas px-3 py-3 font-body text-sm text-ink placeholder:text-ink-muted transition-colors hover:border-ink hover:bg-panel"

function validateField(field: FieldName, value: string): string | null {
  if (field === "email") {
    return emailPattern.test(value) ? null : fieldErrorMessages.email
  }
  return value.length > 0 ? null : fieldErrorMessages[field]
}

export default function ContactForm() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({})

  const handleFieldChange = (field: FieldName) => {
    setEditedFields((edited) => (edited[field] ? edited : { ...edited, [field]: true }))
  }

  // Blur-only validation, gated on prior editing: tabbing through an untouched
  // empty form must not shout errors at the user, and typing never validates.
  // The submit path below still validates every field via the server action.
  const handleFieldBlur = (field: FieldName, value: string) => {
    if (!editedFields[field]) return

    const message = validateField(field, value)
    setFieldErrors((errors) => {
      const next = { ...errors }
      if (message) {
        next[field] = message
      } else {
        delete next[field]
      }
      return next
    })
  }

  const handleAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)
    setSubmitting(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const name = (formData.get("name") as string) ?? ""
    const email = (formData.get("email") as string) ?? ""
    const message = (formData.get("message") as string) ?? ""

    const result: SendEmailResult = await sendEmail({ name, email, message })

    setSubmitting(false)

    if (result.success) {
      setShowConfirmation(true)
      form.reset()
    } else {
      const { errors } = result
      const fieldAcc: Record<string, string> = {}
      let formErr: string | null = null

      for (const [key, value] of Object.entries(errors)) {
        if (key === "_form") {
          formErr = value
        } else {
          fieldAcc[key] = value
        }
      }

      setFieldErrors(fieldAcc)
      if (formErr) setFormError(formErr)
    }
  }

  return (
    <div data-testid="contact-form-panel">
      {showConfirmation && (
        <Alert
          variant="success"
          onDismiss={() => setShowConfirmation(false)}
          className="fixed inset-x-4 top-24 z-50 mx-auto max-w-xl"
        >
          <span className="font-semibold">Success!</span> Email sent successfully.
        </Alert>
      )}

      {formError && (
        <Alert variant="failure" onDismiss={() => setFormError(null)} className="mb-6">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleAction} className="space-y-6" noValidate>
        <div>
          <label htmlFor="name" className="mb-2 block font-body text-sm font-medium text-ink">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={inputClasses}
            placeholder="Your full name"
            required={true}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            onChange={() => handleFieldChange("name")}
            onBlur={(event) => handleFieldBlur("name", event.target.value)}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-2 font-body text-small text-danger">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-body text-sm font-medium text-ink">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={inputClasses}
            placeholder="your.email@example.com"
            required={true}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            onChange={() => handleFieldChange("email")}
            onBlur={(event) => handleFieldBlur("email", event.target.value)}
          />
          {fieldErrors.email && (
            <p id="email-error" className="mt-2 font-body text-small text-danger">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block font-body text-sm font-medium text-ink">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className={inputClasses}
            placeholder="What would you like to talk about?"
            defaultValue={""}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            onChange={() => handleFieldChange("message")}
            onBlur={(event) => handleFieldBlur("message", event.target.value)}
          />
          {fieldErrors.message && (
            <p id="message-error" className="mt-2 font-body text-small text-danger">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={buttonStyles({ variant: "primary", size: "md", className: "w-full sm:w-fit" })}
          disabled={showConfirmation || submitting}
        >
          {submitting ? "Sending..." : showConfirmation ? "Done" : "Send Message"}
        </button>
      </form>
    </div>
  )
}
