import { Injectable } from "@nestjs/common"
import { Prisma } from "../../db/generated/prisma/client"
import { PrismaService } from "../../db/prisma.service"
import type { Vendor } from "./vendor.entity"
import { VendorHasCertificationsError, VendorNotFoundError, VendorSlugAlreadyExistsError } from "./vendor.errors"
import type { CreateVendorData, UpdateVendorData, VendorsRepository } from "./vendors.repository"

const UNIQUE_CONSTRAINT_FAILED = "P2002"
const FOREIGN_KEY_CONSTRAINT_FAILED = "P2003"
const RECORD_NOT_FOUND = "P2025"

// `onDelete: Restrict` raises Postgres SQLSTATE 23001, which the pg driver adapter has no
// mapping for, so it arrives as the catch-all P2039 instead of P2003. Errors the adapter
// does map expose their SQLSTATE as `originalCode`; only the unmapped passthrough sets `code`.
const RESTRICT_VIOLATION = "23001"

function isPrismaError(error: unknown, code: string) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

function sqlStateOf(error: unknown) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        return undefined
    }

    const meta = error.meta as
        | { driverAdapterError?: { cause?: { code?: unknown; originalCode?: unknown } } }
        | undefined
    const cause = meta?.driverAdapterError?.cause
    const sqlState = cause?.originalCode ?? cause?.code

    return typeof sqlState === "string" ? sqlState : undefined
}

function isReferencedByOtherRows(error: unknown) {
    return isPrismaError(error, FOREIGN_KEY_CONSTRAINT_FAILED) || sqlStateOf(error) === RESTRICT_VIOLATION
}

@Injectable()
export class PrismaVendorsRepository implements VendorsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findMany(): Promise<Vendor[]> {
        return this.prisma.vendor.findMany({
            orderBy: [{ position: "asc" }, { name: "asc" }],
        })
    }

    findById(id: string): Promise<Vendor | null> {
        return this.prisma.vendor.findUnique({ where: { id } })
    }

    async create(data: CreateVendorData): Promise<Vendor> {
        try {
            return await this.prisma.vendor.create({ data })
        } catch (error) {
            if (isPrismaError(error, UNIQUE_CONSTRAINT_FAILED)) {
                throw new VendorSlugAlreadyExistsError(data.slug)
            }

            throw error
        }
    }

    async update(id: string, data: UpdateVendorData): Promise<Vendor> {
        try {
            return await this.prisma.vendor.update({ where: { id }, data })
        } catch (error) {
            if (isPrismaError(error, RECORD_NOT_FOUND)) {
                throw new VendorNotFoundError(id)
            }

            // `slug` is the only unique column on the table, so a conflict can only come
            // from a patch that actually carries one.
            if (isPrismaError(error, UNIQUE_CONSTRAINT_FAILED) && data.slug !== undefined) {
                throw new VendorSlugAlreadyExistsError(data.slug)
            }

            throw error
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.vendor.delete({ where: { id } })
        } catch (error) {
            if (isPrismaError(error, RECORD_NOT_FOUND)) {
                throw new VendorNotFoundError(id)
            }

            // `Certification.vendorId` is the only FK pointing at a vendor, and it is
            // `onDelete: Restrict`, so the database refuses to drop a vendor whose
            // certifications were not reassigned first.
            if (isReferencedByOtherRows(error)) {
                throw new VendorHasCertificationsError(id)
            }

            throw error
        }
    }
}
