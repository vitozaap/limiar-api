import { createAccessControl } from "better-auth/plugins"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"

export const statements = {
    ...defaultStatements,
    vendor: ["create", "update", "delete"],
    certification: ["create", "update", "publish"],
    question: ["generate", "review", "publish", "archive"],
    generation: ["run", "cancel"],
} as const

export const ac = createAccessControl(statements)

export const user = ac.newRole({
    vendor: [],
    certification: [],
    generation: [],
    question: [],
})

export const admin = ac.newRole({
    ...adminAc.statements,
    vendor: ["create", "update", "delete"],
    certification: ["create", "update", "publish"],
    question: ["generate", "review", "publish", "archive"],
    generation: ["run", "cancel"],
})

export const roles = { user, admin }

export type Statements = typeof statements

/**
 * A permission request narrowed to `statements`: only resources declared above, and
 * for each one only the actions that resource actually exposes.
 *
 * Better Auth types permissions as `Record<string, string[]>`, so a typo in either
 * half silently denies every request at runtime instead of failing to compile.
 */
export type PermissionRequest = {
    [Resource in keyof Statements]?: Statements[Resource][number][]
}
