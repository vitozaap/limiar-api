import { UserHasPermission } from "@thallesp/nestjs-better-auth"
import type { PermissionRequest } from "../../lib/auth/permissions"

/**
 * Protects a route with a fine-grained permission, checked by the global `AuthGuard`
 * against the access control defined in `lib/auth/permissions`.
 *
 * Thin wrapper over `@UserHasPermission`, whose `Record<string, string[]>` signature
 * accepts any resource/action pair. Going through `PermissionRequest` turns a typo
 * into a compile error instead of a route that quietly rejects every caller.
 */
export const RequirePermission = (permissions: PermissionRequest) =>
    UserHasPermission({ permissions: permissions as Record<string, string[]> })
