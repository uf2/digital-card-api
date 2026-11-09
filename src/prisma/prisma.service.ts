import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { requireEnv } from '../config/env.js';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';

type QueryEventOptions = Prisma.PrismaClientOptions & {
  log: [{ emit: 'event'; level: 'query' }];
};

@Injectable()
export class PrismaService
  extends PrismaClient<QueryEventOptions>
  implements OnModuleDestroy
{
  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: requireEnv('DATABASE_URL') }),
      log: [{ emit: 'event', level: 'query' }],
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
