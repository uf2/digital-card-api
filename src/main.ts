import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { requireEnv } from './config/env.js';

/** Starts the HTTP server with the GraphQL endpoint and Apollo Sandbox. */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const port = requireEnv('PORT');
  await app.listen(port);
  Logger.log(
    `Listening on port ${port}, Apollo Sandbox at /graphql`,
    'Bootstrap',
  );
}

await bootstrap();
