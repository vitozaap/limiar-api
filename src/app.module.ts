import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { AppController } from "./app.controller"
import { AuthConfigModule } from "./config/auth/auth.config.module"
import { AUTH_CONFIG } from "./config/auth/symbols"
import type { AuthConfigType } from "./config/auth/types"
import { PrismaModule } from "./db/prisma.module"
import { VendorsModule } from "./modules/vendors/vendors.module"

@Module({
    imports: [
        SentryModule.forRoot(),
        PrismaModule,
        AuthModule.forRootAsync({
            isGlobal: true,
            imports: [AuthConfigModule],
            inject: [AUTH_CONFIG],
            // The library owns CORS only when this is false; its method list has no PATCH.
            useFactory: (auth: AuthConfigType) => ({ auth, disableTrustedOriginsCors: true }),
        }),
        VendorsModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
        },
    ],
})
export class AppModule {}
