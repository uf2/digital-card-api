import { Module } from '@nestjs/common';
import { SkillRepository } from './skill.repository.js';
import { SkillService } from './skill.service.js';

@Module({
  providers: [SkillRepository, SkillService],
  exports: [SkillService],
})
export class SkillModule {}
