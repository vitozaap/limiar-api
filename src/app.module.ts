import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { AppController } from "./app.controller"
import { auth } from "./lib/auth/auth"

@Module({
    imports: [SentryModule.forRoot(), AuthModule.forRoot({ auth })],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
        },
    ],
})
export class AppModule {}
