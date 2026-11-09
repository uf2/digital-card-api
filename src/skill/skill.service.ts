import { Injectable } from '@nestjs/common';
import { groupByKeys } from '../common/group-by-keys.js';
import type { Skill } from './models/skill.model.js';
import { SkillRepository } from './skill.repository.js';

@Injectable()
export class SkillService {
  constructor(private readonly skills: SkillRepository) {}

  /** Returns skills per profile id, in the order of the given ids. */
  async getByProfileIds(profileIds: readonly number[]): Promise<Skill[][]> {
    const skills = await this.skills.findByProfileIds(profileIds);
    return groupByKeys(profileIds, skills, (skill) => skill.profileId);
  }
}
