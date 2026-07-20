"use server"
import { headers } from "next/headers"
import to from "await-to-js"
import { Resend } from "resend"
import { z } from "zod"
import { env } from "../env.mjs"

const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().min(1, "Email address is missing an @ symbol").email("Email address is missing an @ symbol"),
  message: z.string().min(1, "Please enter a message"),
})

/** Discriminated result type for the contact-form server action.
 *  - `{ success: true }` — email queued with Resend (or E2E override tripped).
 *  - `{ success: false; errors }` — validation, rate-limit, or delivery failure,
 *    with per-field (`Record<string, string>`) and/or `_form`-keyed errors. */
export type SendEmailResult = { success: true } | { success: false; errors: Record<string, string> }

/*
 * In-process rate limiter: Map<IP, timestamp[]>.
 *
 * SERVERLESS LIMITATION: This Map lives in the process memory of a single
 * serverless instance. Cold starts, concurrent instances (Vercel), and
 * deployments all reset it independently. It protects against naive bursts
 * from a single IP within one warm instance but does NOT provide distributed
 * rate limiting. For production use at scale, replace with a shared store
 * (Redis, Upstash, etc.).
 */
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5

function getClientIP(): string {
  try {
    const headersList = headers()
    const forwarded = headersList.get("x-forwarded-for")
    if (forwarded) {
      return forwarded.split(",")[0]!.trim()
    }
    const realIP = headersList.get("x-real-ip")
    if (realIP) {
      return realIP.trim()
    }
  } catch {
    // headers() throws when called outside request context (e.g. build time)
  }
  return "127.0.0.1"
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []

  // Purge entries outside the window
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (valid.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, valid)
    return false
  }

  valid.push(now)
  rateLimitMap.set(ip, valid)
  return true
}

/**
 * Contact-form server action. Validates input through a Zod schema, enforces
 * an in-process rate limit (5 submissions per IP per 15-minute window), then
 * delivers the message via the Resend API. Short-circuits to `{ success: true }`
 * when the `E2E_CONTACT_FORM_SUCCESS` env var is set.
 *
 * @param formData — `{ name, email, message }` from client component. Each
 *   field must be a non-empty string; the email must pass format validation.
 * @returns `SendEmailResult` — success or a failure with per-field / form-level
 *          error messages for the UI to display.
 */
export const sendEmail = async (formData: {
  name: string
  email: string
  message: string
}): Promise<SendEmailResult> => {
  const ip = getClientIP()
  if (env.E2E_CONTACT_FORM_SUCCESS !== "true" && !checkRateLimit(ip)) {
    return {
      success: false,
      errors: { _form: "Too many messages. Please try again later." },
    }
  }

  const parsed = contactFormSchema.safeParse(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }
    return { success: false, errors: fieldErrors }
  }

  const { name, email, message } = parsed.data

  if (env.E2E_CONTACT_FORM_SUCCESS === "true") {
    return { success: true }
  }

  if (!env.RESEND_API_KEY) {
    return { success: false, errors: { _form: "Email service is not configured." } }
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const emailData = {
    from: "website@tomsegbers.de",
    reply_to: email,
    to: ["website@tomsegbers.de"],
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  }

  const [error] = await to(resend.emails.send(emailData))

  if (error) {
    console.error(error)
    return {
      success: false,
      errors: {
        _form: "Failed to send email. Please try again or contact me directly.",
      },
    }
  }

  return { success: true }
}
