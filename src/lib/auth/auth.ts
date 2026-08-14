import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { db } from "../../prisma/db";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { ac, roles } from "./permissions"
import { env } from "../env";
export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    plugins: [openAPI({
        disableDefaultReference: true
    }),
    adminPlugin({ ac, roles, defaultRole: "user", adminRoles: ["admin"] })
    ],
    trustedOrigins: [env.WEB_ORIGIN],
    database: prismaAdapter(db, {
        provider: "postgresql"
    }),

})