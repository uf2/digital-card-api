import { Injectable } from '@nestjs/common';
import { groupByKeys } from '../common/group-by-keys.js';
import type { Link } from './models/link.model.js';
import type { Profile } from './models/profile.model.js';
import { OWNER_SLUG } from './profile.constants.js';
import { ProfileRepository } from './profile.repository.js';

@Injectable()
export class ProfileService {
  constructor(private readonly profiles: ProfileRepository) {}

  /** Returns the business card owner, or null when the seed has not run. */
  getOwner(): Promise<Profile | null> {
    return this.profiles.findBySlug(OWNER_SLUG);
  }

  /** Returns links per profile id, in the order of the given ids. */
  async getLinksByProfileIds(profileIds: readonly number[]): Promise<Link[][]> {
    const links = await this.profiles.findLinksByProfileIds(profileIds);
    return groupByKeys(profileIds, links, (link) => link.profileId);
  }
}
