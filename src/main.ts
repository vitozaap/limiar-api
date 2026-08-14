import "reflect-metadata";
import "dotenv/config";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";

function parsePort() {
  const rawPort = (process.env.PORT ?? "").trim();
  const parsedPort = rawPort.length > 0 ? Number(rawPort) : Number.NaN;
  return Number.isFinite(parsedPort) && parsedPort >= 0 && parsedPort <= 65535 ? parsedPort : 3333;
}

function createDocumentation(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Limiar API')
    .setDescription('The limiar API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  app.use('/docs', apiReference({
    pageTitle: "API Documentation",
    theme: "mars",
    sources: [
      {
        title: "API",
        content: document
      },
      {
        title: "Auth",
        url: "/api/auth/open-api/generate-schema"
      }
    ]
  }))
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });
  const port = parsePort()
  createDocumentation(app)
  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
