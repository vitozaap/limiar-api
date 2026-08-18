import { Module } from "@nestjs/common"
import { PrismaVendorsRepository } from "./prisma-vendors.repository"
import { VendorsController } from "./vendors.controller"
import { VendorsRepository } from "./vendors.repository"
import { VendorsService } from "./vendors.service"

@Module({
    controllers: [VendorsController],
    providers: [VendorsService, { provide: VendorsRepository, useClass: PrismaVendorsRepository }],
    exports: [VendorsService],
})
export class VendorsModule {}
