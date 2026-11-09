import { Module } from '@nestjs/common';
import { ExperienceModule } from '../experience/experience.module.js';
import { ProfileModule } from '../profile/profile.module.js';
import { ProjectModule } from '../project/project.module.js';
import { SkillModule } from '../skill/skill.module.js';
import { LoadersFactory } from './loaders.factory.js';

@Module({
  imports: [ProfileModule, SkillModule, ExperienceModule, ProjectModule],
  providers: [LoadersFactory],
  exports: [LoadersFactory],
})
export class LoadersModule {}
