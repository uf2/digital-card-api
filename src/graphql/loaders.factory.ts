import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ExperienceService } from '../experience/experience.service.js';
import { Achievement } from '../experience/models/achievement.model.js';
import { Experience } from '../experience/models/experience.model.js';
import { Link } from '../profile/models/link.model.js';
import { ProfileService } from '../profile/profile.service.js';
import { Project } from '../project/models/project.model.js';
import { ProjectService } from '../project/project.service.js';
import { Skill } from '../skill/models/skill.model.js';
import { SkillService } from '../skill/skill.service.js';

export interface Loaders {
  linksByProfileId: DataLoader<number, Link[]>;
  skillsByProfileId: DataLoader<number, Skill[]>;
  experienceByProfileId: DataLoader<number, Experience[]>;
  projectsByProfileId: DataLoader<number, Project[]>;
  achievementsByExperienceId: DataLoader<number, Achievement[]>;
}

export interface GraphQLContext {
  loaders: Loaders;
}

@Injectable()
export class LoadersFactory {
  constructor(
    private readonly profileService: ProfileService,
    private readonly skillService: SkillService,
    private readonly experienceService: ExperienceService,
    private readonly projectService: ProjectService,
  ) {}

  /** Creates a fresh set of batching loaders for one GraphQL request. */
  create(): Loaders {
    return {
      linksByProfileId: new DataLoader((ids) =>
        this.profileService.getLinksByProfileIds(ids),
      ),
      skillsByProfileId: new DataLoader((ids) =>
        this.skillService.getByProfileIds(ids),
      ),
      experienceByProfileId: new DataLoader((ids) =>
        this.experienceService.getByProfileIds(ids),
      ),
      projectsByProfileId: new DataLoader((ids) =>
        this.projectService.getByProfileIds(ids),
      ),
      achievementsByExperienceId: new DataLoader((ids) =>
        this.experienceService.getAchievementsByExperienceIds(ids),
      ),
    };
  }
}
