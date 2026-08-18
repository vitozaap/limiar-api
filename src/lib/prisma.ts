import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../db/generated/prisma/client"
import { env } from "./env"

const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
})

export const prismaClientOptions = { adapter }

export function createPrismaClient() {
    return new PrismaClient(prismaClientOptions)
}
