import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import type { BetterAuthOptions } from "better-auth"
import { AppController } from "./app.controller"
import { AuthConfigModule } from "./config/auth/auth.config.module"
import { AUTH_CONFIG } from "./config/auth/symbols"
import { PrismaModule } from "./db/prisma.module"

@Module({
    imports: [
        SentryModule.forRoot(),
        PrismaModule,
        AuthModule.forRootAsync({
            isGlobal: true,
            imports: [AuthConfigModule],
            inject: [AUTH_CONFIG],
            useFactory: (config: BetterAuthOptions) => ({ auth: config }),
        }),
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
