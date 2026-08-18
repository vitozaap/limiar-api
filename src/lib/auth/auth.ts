import { prismaAdapter } from "@better-auth/prisma-adapter"
import { betterAuth } from "better-auth/minimal"
import { admin as adminPlugin, openAPI } from "better-auth/plugins"
import { env } from "../env"
import { createPrismaClient } from "../prisma"
import { ac, roles } from "./permissions"

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        openAPI({ disableDefaultReference: true }),
        adminPlugin({ ac, roles, defaultRole: "user", adminRoles: ["admin"] }),
    ],
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.WEB_ORIGIN],
    database: prismaAdapter(createPrismaClient(), {
        provider: "postgresql",
    }),
})
