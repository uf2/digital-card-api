import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { profileSeed } from './profile.data.js';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Writes the profile and replaces its related rows in one transaction. */
  async run(): Promise<void> {
    const { slug, links, skills, experience, projects, ...fields } =
      profileSeed;

    await this.prisma.$transaction(async (tx) => {
      const { id: profileId } = await tx.profile.upsert({
        where: { slug },
        create: { slug, ...fields },
        update: fields,
      });

      await tx.link.deleteMany({ where: { profileId } });
      await tx.skill.deleteMany({ where: { profileId } });
      await tx.experience.deleteMany({ where: { profileId } });
      await tx.project.deleteMany({ where: { profileId } });

      await tx.link.createMany({
        data: links.map((link, position) => ({ ...link, profileId, position })),
      });
      await tx.skill.createMany({
        data: skills.map((skill, position) => ({
          ...skill,
          profileId,
          position,
        })),
      });
      await tx.project.createMany({
        data: projects.map((project, position) => ({
          ...project,
          profileId,
          position,
        })),
      });
      for (const { achievements, startDate, endDate, ...job } of experience) {
        await tx.experience.create({
          data: {
            ...job,
            profileId,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            achievements: {
              create: achievements.map((text, position) => ({
                text,
                position,
              })),
            },
          },
        });
      }
    });

    this.logger.log(
      `Seeded profile "${slug}": ${links.length} links, ${skills.length} skills, ${experience.length} jobs, ${projects.length} projects`,
    );
  }
}
