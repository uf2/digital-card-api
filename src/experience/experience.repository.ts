import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns work history of the given profiles, most recent job first. */
  findByProfileIds(profileIds: readonly number[]) {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ startDate: 'desc' }, { id: 'asc' }],
    });
  }

  /** Returns achievements of the given jobs sorted by display position. */
  findAchievementsByExperienceIds(experienceIds: readonly number[]) {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
