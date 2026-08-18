import "dotenv/config"
import { auth } from "../src/lib/auth/auth"
import { createPrismaClient } from "../src/lib/prisma"

async function main() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME?.trim() || "Admin"

    if (!email || !password) {
        throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding the first administrator.")
    }

    const prisma = createPrismaClient()

    try {
        const existing = await prisma.user.findUnique({ where: { email } })

        if (existing) {
            // Better Auth stores multiple roles as one comma-separated string, so promoting
            // has to append — overwriting would silently drop every other role the user has.
            const roles = (existing.role ?? "")
                .split(",")
                .map((role) => role.trim())
                .filter(Boolean)

            if (roles.includes("admin")) {
                console.log(`Administrator ${email} already exists.`)
                return
            }

            await prisma.user.update({
                where: { id: existing.id },
                data: { role: [...roles, "admin"].join(",") },
            })
            console.log(`Promoted ${email} to administrator.`)
            return
        }

        // Called without request or headers, which is the admin plugin's server-only path —
        // the only way to mint the first administrator while no administrator exists to
        // authorize the call.
        await auth.api.createUser({ body: { email, password, name, role: "admin" } })

        console.log(`Created administrator ${email}.`)
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
