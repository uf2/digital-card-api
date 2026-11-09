import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Returns the profile with the given slug, or null. */
  findBySlug(slug: string) {
    return this.prisma.profile.findUnique({ where: { slug } });
  }

  /** Returns links of the given profiles sorted by display position. */
  findLinksByProfileIds(profileIds: readonly number[]) {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
