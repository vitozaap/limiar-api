import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { db } from "../prisma/db";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    plugins: [openAPI({
        disableDefaultReference: true
    })],
    
    database: prismaAdapter(db, {
        provider: "postgresql"
    }),

})