import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns skills of the given profiles sorted by display position. */
  findByProfileIds(profileIds: readonly number[]) {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
