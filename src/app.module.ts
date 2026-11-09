import { Module } from '@nestjs/common';
import { ExperienceModule } from './experience/experience.module.js';
import { ApiGraphQLModule } from './graphql/graphql.module.js';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { ProjectModule } from './project/project.module.js';
import { SkillModule } from './skill/skill.module.js';

@Module({
  imports: [
    PrismaModule,
    ApiGraphQLModule,
    ProfileModule,
    SkillModule,
    ExperienceModule,
    ProjectModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
