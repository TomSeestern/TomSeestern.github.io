"use client"
import React, { useState } from "react"
import { InlineAlert } from "@/components/InlineAlert/InlineAlert"
import { sendEmail, type SendEmailResult } from "../../lib/sendEmail"

export default function Contact() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
        <InlineAlert
          color="success"
          onDismiss={() => setShowConfirmation(false)}
          className="fixed inset-x-1/3 top-8 z-50"
        >
          <span className="font-medium">Success!</span> Email sent successfully.
        </InlineAlert>
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
          <InlineAlert color="failure" onDismiss={() => setFormError(null)} className="mb-6">
            {formError}
          </InlineAlert>
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
              className="block w-full rounded-sm border border-border bg-surface-muted p-2.5 text-sm text-foreground shadow-sm transition-colors duration-200 focus-visible:border-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:border-border-dark dark:bg-muted-surface-dark dark:text-foreground-dark dark:placeholder-muted-dark dark:focus-visible:border-accent-dark dark:focus-visible:ring-accent-soft-dark"
              placeholder="Your full name"
              required={true}
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
              className="block w-full rounded-sm border border-border bg-surface-muted p-2.5 text-sm text-foreground shadow-sm transition-colors duration-200 focus-visible:border-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:border-border-dark dark:bg-muted-surface-dark dark:text-foreground-dark dark:placeholder-muted-dark dark:focus-visible:border-accent-dark dark:focus-visible:ring-accent-soft-dark"
              placeholder="your.email@example.com"
              required={true}
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
              className="block w-full rounded-sm border border-border bg-surface-muted p-2.5 text-sm text-foreground shadow-sm transition-colors duration-200 focus-visible:border-accent-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft dark:border-border-dark dark:bg-muted-surface-dark dark:text-foreground-dark dark:placeholder-muted-dark dark:focus-visible:border-accent-dark dark:focus-visible:ring-accent-soft-dark"
              placeholder="What would you like to talk about?"
              defaultValue={""}
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
