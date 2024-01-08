import {createEnv} from "@t3-oss/env-nextjs"
import {z} from "zod"

export const env = createEnv({
    server: {
        RESEND_API_KEY: z.string(),
        ANALYZE: z
            .enum(["true", "false"])
            .optional()
            .transform((value) => value === "true"),
    },
    client: {},
    runtimeEnv: {
        ANALYZE: process.env.ANALYZE,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
    },
})
