import type { Vendor } from "./vendor.entity"

export interface CreateVendorData {
    slug: string
    name: string
    position?: number
}

export type UpdateVendorData = Partial<CreateVendorData>

export abstract class VendorsRepository {
    abstract findMany(): Promise<Vendor[]>
    abstract findById(id: string): Promise<Vendor | null>
    abstract create(data: CreateVendorData): Promise<Vendor>
    abstract update(id: string, data: UpdateVendorData): Promise<Vendor>
    abstract delete(id: string): Promise<void>
}
