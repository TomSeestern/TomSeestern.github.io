"use client"
import React, { useState } from "react"
import { Alert } from "../../components/Alert/Alert"
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
    <section className="bg-surface dark:bg-surface-dark">
      {showConfirmation && (
        <Alert variant="success" onDismiss={() => setShowConfirmation(false)} className="fixed inset-x-1/3 top-8 z-50">
          <span className="font-medium">Success!</span> Email sent successfully.
        </Alert>
      )}
      <div className="mx-auto max-w-screen-md px-4 py-8 sm:px-6 sm:py-16 lg:py-24">
        <h1 className="mb-4 text-center text-h1-sm text-foreground dark:text-foreground-dark sm:text-h1">
          Get in Touch
        </h1>
        <p className="mb-8 text-center font-light text-muted dark:text-muted-dark sm:text-xl lg:mb-16">
          Whether you have a collaboration idea, a project proposal, or just want to say hello, I&apos;d love to hear
          from you. Drop me a message, and I&apos;ll get back to you soon.
        </p>

        {formError && (
          <Alert variant="failure" onDismiss={() => setFormError(null)} className="mb-6">
            {formError}
          </Alert>
        )}

        <form onSubmit={handleAction} className="space-y-8" noValidate>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground dark:text-foreground-muted-dark"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block w-full rounded-lg border border-border bg-surface-muted p-2.5 text-sm text-foreground shadow-sm transition-colors duration-200 focus-visible:border-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:border-border-dark dark:bg-muted-surface-dark dark:text-foreground-dark dark:placeholder-muted-dark dark:shadow-sm-light dark:focus-visible:border-accent-dark dark:focus-visible:ring-accent-soft-dark"
              placeholder="Your full name"
              required={true}
              aria-invalid={fieldErrors.name ? true : undefined}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              onChange={() => handleFieldChange("name")}
              onBlur={(event) => handleFieldBlur("name", event.target.value)}
            />
            {fieldErrors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground dark:text-foreground-muted-dark"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full rounded-lg border border-border bg-surface-muted p-2.5 text-sm text-foreground shadow-sm transition-colors duration-200 focus-visible:border-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:border-border-dark dark:bg-muted-surface-dark dark:text-foreground-dark dark:placeholder-muted-dark dark:shadow-sm-light dark:focus-visible:border-accent-dark dark:focus-visible:ring-accent-soft-dark"
              placeholder="your.email@example.com"
              required={true}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              onChange={() => handleFieldChange("email")}
              onBlur={(event) => handleFieldBlur("email", event.target.value)}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-foreground dark:text-foreground-muted-dark"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="block w-full rounded-lg border border-border bg-surface-muted p-2.5 text-sm text-foreground shadow-sm transition-colors duration-200 focus-visible:border-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:border-border-dark dark:bg-muted-surface-dark dark:text-foreground-dark dark:placeholder-muted-dark dark:shadow-sm-light dark:focus-visible:border-accent-dark dark:focus-visible:ring-accent-soft-dark"
              placeholder="What would you like to talk about?"
              defaultValue={""}
              aria-invalid={fieldErrors.message ? true : undefined}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              onChange={() => handleFieldChange("message")}
              onBlur={(event) => handleFieldBlur("message", event.target.value)}
            />
            {fieldErrors.message && (
              <p id="message-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={
              "rounded-lg bg-accent-hover px-5 py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-soft-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft-foreground-dark dark:bg-accent dark:hover:bg-accent-hover dark:focus-visible:ring-accent-soft-foreground sm:w-fit " +
              (showConfirmation ? "!bg-green-700" : "")
            }
            disabled={showConfirmation || submitting}
          >
            {submitting ? "Sending..." : showConfirmation ? "Done" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  )
}
