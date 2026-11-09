import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns projects of the given profiles sorted by display position. */
  findByProfileIds(profileIds: readonly number[]) {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
