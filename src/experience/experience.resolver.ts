import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import type { Loaders } from '../graphql/loaders.factory.js';
import { Achievement } from './models/achievement.model.js';
import { Experience } from './models/experience.model.js';

@Resolver(() => Experience)
export class ExperienceResolver {
  @ResolveField(() => [Achievement])
  achievements(
    @Parent() experience: Experience,
    @Context('loaders') loaders: Loaders,
  ): Promise<Achievement[]> {
    return loaders.achievementsByExperienceId.load(experience.id);
  }
}
