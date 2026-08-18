import { ConflictException, NotFoundException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Vendor } from "./vendor.entity"
import { VendorHasCertificationsError, VendorNotFoundError, VendorSlugAlreadyExistsError } from "./vendor.errors"
import type { CreateVendorData, UpdateVendorData } from "./vendors.repository"
import { VendorsRepository } from "./vendors.repository"
import { VendorsService } from "./vendors.service"

class InMemoryVendorsRepository implements VendorsRepository {
    items: Vendor[] = []
    /** Ids the fake reports as still owning certifications, mirroring the FK restriction. */
    restricted = new Set<string>()

    async findMany() {
        return [...this.items].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
    }

    async findById(id: string) {
        return this.items.find((vendor) => vendor.id === id) ?? null
    }

    async create(data: CreateVendorData) {
        if (this.items.some((vendor) => vendor.slug === data.slug)) {
            throw new VendorSlugAlreadyExistsError(data.slug)
        }

        const vendor: Vendor = {
            id: `vendor-${this.items.length + 1}`,
            slug: data.slug,
            name: data.name,
            position: data.position ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        this.items.push(vendor)
        return vendor
    }

    async update(id: string, data: UpdateVendorData) {
        const index = this.items.findIndex((vendor) => vendor.id === id)

        if (index < 0) {
            throw new VendorNotFoundError(id)
        }

        if (data.slug !== undefined && this.items.some((v) => v.slug === data.slug && v.id !== id)) {
            throw new VendorSlugAlreadyExistsError(data.slug)
        }

        const current = this.items[index]
        const updated: Vendor = {
            ...current,
            slug: data.slug ?? current.slug,
            name: data.name ?? current.name,
            position: data.position ?? current.position,
            updatedAt: new Date(),
        }

        this.items[index] = updated
        return updated
    }

    async delete(id: string) {
        const index = this.items.findIndex((vendor) => vendor.id === id)

        if (index < 0) {
            throw new VendorNotFoundError(id)
        }

        if (this.restricted.has(id)) {
            throw new VendorHasCertificationsError(id)
        }

        this.items.splice(index, 1)
    }
}

describe("VendorsService", () => {
    let service: VendorsService
    let repository: InMemoryVendorsRepository

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [VendorsService, { provide: VendorsRepository, useClass: InMemoryVendorsRepository }],
        }).compile()

        service = moduleRef.get(VendorsService)
        repository = moduleRef.get<InMemoryVendorsRepository>(VendorsRepository)
    })

    describe("findAll", () => {
        it("lists vendors by position, then by name", async () => {
            await service.create({ slug: "gcp", name: "Google Cloud", position: 1 })
            await service.create({ slug: "azure", name: "Azure", position: 0 })
            await service.create({ slug: "aws", name: "Amazon Web Services", position: 0 })

            const vendors = await service.findAll()

            expect(vendors.map((vendor) => vendor.slug)).toEqual(["aws", "azure", "gcp"])
        })
    })

    describe("findOne", () => {
        it("returns the vendor", async () => {
            const created = await service.create({ slug: "aws", name: "Amazon Web Services" })

            await expect(service.findOne(created.id)).resolves.toEqual(created)
        })

        it("throws NotFound when the vendor does not exist", async () => {
            await expect(service.findOne("missing")).rejects.toBeInstanceOf(NotFoundException)
        })
    })

    describe("create", () => {
        it("defaults position to 0", async () => {
            const created = await service.create({ slug: "aws", name: "Amazon Web Services" })

            expect(created.position).toBe(0)
        })

        it("throws Conflict when the slug is taken", async () => {
            await service.create({ slug: "aws", name: "Amazon Web Services" })

            await expect(service.create({ slug: "aws", name: "AWS Again" })).rejects.toBeInstanceOf(ConflictException)
        })
    })

    describe("update", () => {
        it("applies only the fields present in the patch", async () => {
            const created = await service.create({ slug: "aws", name: "Amazon Web Services", position: 2 })

            const updated = await service.update(created.id, { name: "AWS" })

            expect(updated).toMatchObject({ slug: "aws", name: "AWS", position: 2 })
        })

        it("throws NotFound when the vendor does not exist", async () => {
            await expect(service.update("missing", { name: "AWS" })).rejects.toBeInstanceOf(NotFoundException)
        })

        it("throws Conflict when the new slug belongs to another vendor", async () => {
            await service.create({ slug: "aws", name: "Amazon Web Services" })
            const azure = await service.create({ slug: "azure", name: "Azure" })

            await expect(service.update(azure.id, { slug: "aws" })).rejects.toBeInstanceOf(ConflictException)
        })
    })

    describe("remove", () => {
        it("deletes the vendor", async () => {
            const created = await service.create({ slug: "aws", name: "Amazon Web Services" })

            await service.remove(created.id)

            await expect(service.findAll()).resolves.toEqual([])
        })

        it("throws NotFound when the vendor does not exist", async () => {
            await expect(service.remove("missing")).rejects.toBeInstanceOf(NotFoundException)
        })

        it("throws Conflict when the vendor still owns certifications", async () => {
            const created = await service.create({ slug: "aws", name: "Amazon Web Services" })
            repository.restricted.add(created.id)

            await expect(service.remove(created.id)).rejects.toBeInstanceOf(ConflictException)
        })
    })

    it("propagates failures it has no mapping for, so they reach Sentry as real errors", async () => {
        const failure = new Error("connection terminated unexpectedly")
        vi.spyOn(repository, "create").mockRejectedValue(failure)

        await expect(service.create({ slug: "aws", name: "Amazon Web Services" })).rejects.toBe(failure)
    })
})
