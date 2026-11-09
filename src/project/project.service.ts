import { Injectable } from '@nestjs/common';
import { groupByKeys } from '../common/group-by-keys.js';
import type { Project } from './models/project.model.js';
import { ProjectRepository } from './project.repository.js';

@Injectable()
export class ProjectService {
  constructor(private readonly projects: ProjectRepository) {}

  /** Returns projects per profile id, in the order of the given ids. */
  async getByProfileIds(profileIds: readonly number[]): Promise<Project[][]> {
    const projects = await this.projects.findByProfileIds(profileIds);
    return groupByKeys(profileIds, projects, (project) => project.profileId);
  }
}
