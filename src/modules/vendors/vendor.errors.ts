/**
 * Failures a `VendorsRepository` implementation raises, so callers can react to them
 * without knowing which database sits behind the contract — and so the HTTP status
 * stays a decision of the service, which knows what the caller was trying to do.
 */

export class VendorNotFoundError extends Error {
    constructor(readonly id: string) {
        super(`Vendor "${id}" not found`)
        this.name = "VendorNotFoundError"
    }
}

export class VendorSlugAlreadyExistsError extends Error {
    constructor(readonly slug: string) {
        super(`Vendor slug "${slug}" is already taken`)
        this.name = "VendorSlugAlreadyExistsError"
    }
}

export class VendorHasCertificationsError extends Error {
    constructor(readonly id: string) {
        super(`Vendor "${id}" still has certifications`)
        this.name = "VendorHasCertificationsError"
    }
}
