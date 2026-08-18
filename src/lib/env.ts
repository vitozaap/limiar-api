import z from "zod"
import "dotenv/config"

const schema = z.object({
    DATABASE_URL: z.url().nonempty(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url().optional(),
    SENTRY_DSN: z.url().optional(),
    WEB_ORIGIN: z.url().nonempty(),
})

export const env = schema.parse(process.env)
