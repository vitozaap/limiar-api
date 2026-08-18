import { Module } from "@nestjs/common"
import { PrismaService } from "../../db/prisma.service"
import { AuthConfigService } from "./auth.config.service"
import { AUTH_CONFIG } from "./symbols"

@Module({
    imports: [],
    providers: [PrismaService, AuthConfigService],
    exports: [AUTH_CONFIG],
})
export class AuthConfigModule {}
