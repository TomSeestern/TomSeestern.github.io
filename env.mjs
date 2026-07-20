import {createEnv} from "@t3-oss/env-nextjs"
import {z} from "zod"

export const env = createEnv({
    server: {
        // Required for the contact form in production; may be absent in CI/local dev
        RESEND_API_KEY: z.string().optional(),
        E2E_CONTACT_FORM_SUCCESS: z.enum(["true"]).optional(),
        ANALYZE: z
            .enum(["true", "false"])
            .optional()
            .transform((value) => value === "true"),
    },
    client: {},
    runtimeEnv: {
        ANALYZE: process.env.ANALYZE,
        E2E_CONTACT_FORM_SUCCESS: process.env.E2E_CONTACT_FORM_SUCCESS,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
    },
})
