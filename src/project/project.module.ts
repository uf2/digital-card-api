import { Module } from '@nestjs/common';
import { ProjectRepository } from './project.repository.js';
import { ProjectService } from './project.service.js';

@Module({
  providers: [ProjectRepository, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
