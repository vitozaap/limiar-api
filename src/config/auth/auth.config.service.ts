import { prismaAdapter } from "@better-auth/prisma-adapter"
import { betterAuth } from "better-auth/minimal"
import { admin as adminPlugin, openAPI } from "better-auth/plugins"
import { PrismaService } from "../../db/prisma.service"
import { ac, roles } from "../../lib/auth/permissions"
import { env } from "../../lib/env"
import { AUTH_CONFIG } from "./symbols"

export const AuthConfigService = {
    provide: AUTH_CONFIG,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return betterAuth({
            emailAndPassword: {
                enabled: true,
            },
            plugins: [
                openAPI({ disableDefaultReference: true }),
                adminPlugin({ ac, roles, defaultRole: "user", adminRoles: ["admin"] }),
            ],
            secret: env.BETTER_AUTH_SECRET,
            trustedOrigins: [env.WEB_ORIGIN],
            database: prismaAdapter(prisma, {
                provider: "postgresql",
            }),
        })
    },
}
