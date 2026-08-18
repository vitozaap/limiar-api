import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator"

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export class CreateVendorDto {
    @ApiProperty({
        description: "URL-safe identifier, unique across vendors.",
        example: "aws",
    })
    @IsString()
    @MaxLength(64)
    @Matches(SLUG_PATTERN, {
        message: "slug must be lowercase alphanumeric segments separated by single hyphens",
    })
    slug!: string

    @ApiProperty({
        description: "Display name shown in the catalog.",
        example: "Amazon Web Services",
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name!: string

    @ApiPropertyOptional({
        description: "Sort weight in catalog listings; lower comes first.",
        example: 0,
        default: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    position?: number
}
