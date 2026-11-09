import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Experience } from '../experience/models/experience.model.js';
import type { Loaders } from '../graphql/loaders.factory.js';
import { Project } from '../project/models/project.model.js';
import { Skill } from '../skill/models/skill.model.js';
import { Link } from './models/link.model.js';
import { Profile } from './models/profile.model.js';
import { ProfileService } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { description: 'Business card owner' })
  async profile(): Promise<Profile> {
    const owner = await this.profileService.getOwner();
    if (!owner) {
      throw new GraphQLError('Profile not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return owner;
  }

  @ResolveField(() => [Link])
  links(
    @Parent() profile: Profile,
    @Context('loaders') loaders: Loaders,
  ): Promise<Link[]> {
    return loaders.linksByProfileId.load(profile.id);
  }

  @ResolveField(() => [Skill])
  skills(
    @Parent() profile: Profile,
    @Context('loaders') loaders: Loaders,
  ): Promise<Skill[]> {
    return loaders.skillsByProfileId.load(profile.id);
  }

  @ResolveField(() => [Experience], {
    description: 'Work history, most recent first',
  })
  experience(
    @Parent() profile: Profile,
    @Context('loaders') loaders: Loaders,
  ): Promise<Experience[]> {
    return loaders.experienceByProfileId.load(profile.id);
  }

  @ResolveField(() => [Project])
  projects(
    @Parent() profile: Profile,
    @Context('loaders') loaders: Loaders,
  ): Promise<Project[]> {
    return loaders.projectsByProfileId.load(profile.id);
  }
}
