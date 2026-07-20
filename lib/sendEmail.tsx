"use server"
import { env } from "../env.mjs"
import { Resend } from "resend"
import to from "await-to-js"

export const sendEmail = async ({ email, subject, message }: { email: string; subject: string; message: string }) => {
  if (env.E2E_CONTACT_FORM_SUCCESS === "true") {
    return true
  }

  if (!env.RESEND_API_KEY) {
    return false
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const emailData = {
    from: "website@tomsegbers.de",
    reply_to: email,
    to: ["website@tomsegbers.de"],
    subject: subject,
    text: message,
  }

  const [error] = await to(resend.emails.send(emailData))

  if (error) {
    console.error(error)
    return false
  }

  return true
}
