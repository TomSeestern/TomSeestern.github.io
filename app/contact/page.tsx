"use client"
import React, { useState } from "react"
import { Alert } from "flowbite-react"
import { sendEmail } from "../../lib/sendEmail"

export default function Contact() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as typeof event.target & {
      email: { value: string }
      subject: { value: string }
      message: { value: string }
    }

    const email = target.email.value ?? "website@tomsegbers.de"
    const subject = target.subject.value ?? "Failed to parse subject"
    const message = target.message.value ?? "Failed to parse message"

    const success = await sendEmail({ email: email, subject: subject, message: message })
    if (success) {
      setShowConfirmation(true)
    } else {
      alert("Failed to send email, please contact me via contact@tomsegbers.de")
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      {showConfirmation && (
        <Alert color="success" onDismiss={() => setShowConfirmation(false)} className="fixed inset-x-1/3 top-8 z-50">
          <span className="font-medium">Success!</span> Email sent successfully.
        </Alert>
      )}
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Get in Touch
        </h2>
        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
          Whether you have a collaboration idea, a project proposal, or just want to say hello, I'd love to hear from
          you. Drop me a message, and I'll get back to you soon.
        </p>
        <form onSubmit={handleAction} className="space-y-8">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:shadow-sm-light dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="your.email@example.com"
              required={true}
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:shadow-sm-light dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="Subject of your message"
              required={true}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400">
              Your Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="What would you like to talk about?"
              defaultValue={""}
            />
          </div>
          <button
            type="submit"
            className={
              "rounded-lg bg-primary-700 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit " +
              (showConfirmation ? "!bg-green-700" : "")
            }
            disabled={showConfirmation}
          >
            {showConfirmation ? "Done" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  )
}
