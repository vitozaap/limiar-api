import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import type { CreateVendorDto } from "./dto/create-vendor.dto"
import type { UpdateVendorDto } from "./dto/update-vendor.dto"
import type { Vendor } from "./vendor.entity"
import { VendorHasCertificationsError, VendorNotFoundError, VendorSlugAlreadyExistsError } from "./vendor.errors"
import { VendorsRepository } from "./vendors.repository"

@Injectable()
export class VendorsService {
    constructor(private readonly vendors: VendorsRepository) {}

    findAll(): Promise<Vendor[]> {
        return this.vendors.findMany()
    }

    async findOne(id: string): Promise<Vendor> {
        const vendor = await this.vendors.findById(id)

        if (!vendor) {
            throw new NotFoundException(new VendorNotFoundError(id).message)
        }

        return vendor
    }

    async create(data: CreateVendorDto): Promise<Vendor> {
        try {
            return await this.vendors.create(data)
        } catch (error) {
            if (error instanceof VendorSlugAlreadyExistsError) {
                throw new ConflictException(error.message)
            }

            throw error
        }
    }

    async update(id: string, data: UpdateVendorDto): Promise<Vendor> {
        try {
            return await this.vendors.update(id, data)
        } catch (error) {
            if (error instanceof VendorNotFoundError) {
                throw new NotFoundException(error.message)
            }

            if (error instanceof VendorSlugAlreadyExistsError) {
                throw new ConflictException(error.message)
            }

            throw error
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.vendors.delete(id)
        } catch (error) {
            if (error instanceof VendorNotFoundError) {
                throw new NotFoundException(error.message)
            }

            if (error instanceof VendorHasCertificationsError) {
                throw new ConflictException(`${error.message} and cannot be deleted`)
            }

            throw error
        }
    }
}
