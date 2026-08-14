import z from "zod";
import "dotenv/config"

const schema = z.object({
    DATABASE_URL: z.url().nonempty(),
    BETTER_AUTH_SECRET: z.string().nonempty(),
    BETTER_AUTH_URL: z.url().optional()
})

export const env = schema.parse(process.env)