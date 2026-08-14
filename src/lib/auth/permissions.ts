import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";


export const statements = {
    ...defaultStatements,
    certification: ["create", "update", "publish"],
    question: ["generate", "review", "publish", "archive"],
    generation: ["run", "cancel"]
} as const

export const ac = createAccessControl(statements)

export const user = ac.newRole({
    certification: [],
    generation: [],
    question: []
})

export const admin = ac.newRole({
    ...adminAc.statements,
    certification: ["create", "update", "publish"],
    question: ["generate", "review", "publish", "archive"],
    generation: ["run", "cancel"]
})

export const roles = { user, admin }