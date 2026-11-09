import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module.js';
import { SeedService } from './seed.service.js';

/** Fills the database with the business card data and exits. */
async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeedModule);
  try {
    await app.get(SeedService).run();
  } finally {
    await app.close();
  }
}

await seed();
