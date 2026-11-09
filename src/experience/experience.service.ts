import { Injectable } from '@nestjs/common';
import { groupByKeys } from '../common/group-by-keys.js';
import { ExperienceRepository } from './experience.repository.js';
import type { Achievement } from './models/achievement.model.js';
import type { ExperiencePeriod } from './models/experience-period.model.js';
import type { Experience } from './models/experience.model.js';

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

@Injectable()
export class ExperienceService {
  constructor(private readonly experience: ExperienceRepository) {}

  /** Returns work history per profile id, in the order of the given ids. */
  async getByProfileIds(
    profileIds: readonly number[],
  ): Promise<Experience[][]> {
    const rows = await this.experience.findByProfileIds(profileIds);
    const now = new Date();
    const items = rows.map((row) => ({
      id: row.id,
      profileId: row.profileId,
      company: row.company,
      position: row.position,
      location: row.location,
      summary: row.summary,
      period: buildPeriod(row.startDate, row.endDate, now),
    }));
    return groupByKeys(profileIds, items, (item) => item.profileId);
  }

  /** Returns achievements per job id, in the order of the given ids. */
  async getAchievementsByExperienceIds(
    experienceIds: readonly number[],
  ): Promise<Achievement[][]> {
    const rows =
      await this.experience.findAchievementsByExperienceIds(experienceIds);
    return groupByKeys(experienceIds, rows, (row) => row.experienceId);
  }
}

/** Builds the period of a job; an empty end date means the job is current. */
export function buildPeriod(
  startDate: Date,
  endDate: Date | null,
  now: Date,
): ExperiencePeriod {
  const start = toYearMonth(startDate);
  const end = endDate ? toYearMonth(endDate) : null;
  const endLabel = endDate ? monthFormatter.format(endDate) : 'Present';
  return {
    start,
    end,
    isCurrent: endDate === null,
    label: `${monthFormatter.format(startDate)} - ${endLabel}`,
    durationMonths: monthsBetween(startDate, endDate ?? now),
  };
}

/** Formats a date as YYYY-MM in UTC. */
function toYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/** Counts calendar months between two dates, including the first month. */
function monthsBetween(from: Date, to: Date): number {
  const months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
  return months + 1;
}
