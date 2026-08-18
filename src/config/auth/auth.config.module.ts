import { Module } from "@nestjs/common"
import { AuthConfigService } from "./auth.config.service"
import { AUTH_CONFIG } from "./symbols"

@Module({
    imports: [],
    providers: [AuthConfigService],
    exports: [AUTH_CONFIG],
})
export class AuthConfigModule {}
