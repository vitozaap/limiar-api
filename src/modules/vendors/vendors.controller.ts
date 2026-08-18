import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { RequirePermission } from "../../common/auth/require-permission.decorator"
import { CreateVendorDto } from "./dto/create-vendor.dto"
import { UpdateVendorDto } from "./dto/update-vendor.dto"
import { VendorsService } from "./vendors.service"

@ApiTags("vendors")
@Controller("vendors")
export class VendorsController {
    constructor(private readonly vendors: VendorsService) {}

    @Get()
    @ApiOperation({ summary: "List vendors in catalog order" })
    findAll() {
        return this.vendors.findAll()
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a single vendor" })
    findOne(@Param("id", ParseUUIDPipe) id: string) {
        return this.vendors.findOne(id)
    }

    @Post()
    @RequirePermission({ vendor: ["create"] })
    @ApiOperation({ summary: "Create a vendor" })
    create(@Body() body: CreateVendorDto) {
        return this.vendors.create(body)
    }

    @Patch(":id")
    @RequirePermission({ vendor: ["update"] })
    @ApiOperation({ summary: "Update a vendor" })
    update(@Param("id", ParseUUIDPipe) id: string, @Body() body: UpdateVendorDto) {
        return this.vendors.update(id, body)
    }

    @Delete(":id")
    @RequirePermission({ vendor: ["delete"] })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Delete a vendor that owns no certifications" })
    remove(@Param("id", ParseUUIDPipe) id: string) {
        return this.vendors.remove(id)
    }
}
