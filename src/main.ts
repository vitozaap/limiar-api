import "./instrument"
import "reflect-metadata"
import "dotenv/config"

import { type INestApplication, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { apiReference } from "@scalar/nestjs-api-reference"
import { AppModule } from "./app.module"
import { env } from "./lib/env"

function parsePort() {
    const rawPort = (process.env.PORT ?? "").trim()
    const parsedPort = rawPort.length > 0 ? Number(rawPort) : Number.NaN
    return Number.isFinite(parsedPort) && parsedPort >= 0 && parsedPort <= 65535 ? parsedPort : 3333
}

function createDocumentation(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle("Limiar API")
        .setDescription("The limiar API description")
        .setVersion("1.0")
        .build()
    const document = SwaggerModule.createDocument(app, config)
    app.use(
        "/docs",
        apiReference({
            pageTitle: "API Documentation",
            theme: "mars",
            sources: [
                {
                    title: "API",
                    content: document,
                },
                {
                    title: "Auth",
                    url: "/api/auth/open-api/generate-schema",
                },
            ],
        }),
    )
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bodyParser: false,
    })
    const port = parsePort()
    // Replaces the CORS the auth module would install, whose method list omits PATCH.
    app.enableCors({
        origin: [env.WEB_ORIGIN],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )
    createDocumentation(app)
    await app.listen(port)
}

bootstrap().catch((error) => {
    console.error("Failed to start server", error)
    process.exit(1)
})
