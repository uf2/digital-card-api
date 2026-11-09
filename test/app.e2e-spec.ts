import 'dotenv/config';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { profileSeed } from '../src/database/seed/profile.data.js';
import { SeedService } from '../src/database/seed/seed.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const fullProfileQuery = `
  query {
    profile {
      name
      description
      links { kind url }
      skills { name }
      experience {
        company
        position
        period { start end isCurrent label }
        achievements { text }
      }
      projects { name url repositoryUrl isPrivate }
    }
  }
`;

describe('Digital card API (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [SeedService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await app.get(SeedService).run();
  });

  afterAll(async () => {
    await app.close();
  });

  function graphql(query: string) {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('content-type', 'application/json')
      .send({ query });
  }

  it('returns the profile with nested data for the query from the task', async () => {
    const response = await graphql(`
      query {
        profile {
          name
          description
          skills {
            name
          }
          experience {
            company
            position
          }
          projects {
            name
          }
        }
      }
    `).expect(200);

    expect(response.body.errors).toBeUndefined();
    const { profile } = response.body.data;
    expect(profile.name).toBe(profileSeed.name);
    expect(profile.description).toBe(profileSeed.description);
    expect(profile.skills).toHaveLength(profileSeed.skills.length);
    expect(
      profile.experience.map((job: { company: string }) => job.company),
    ).toEqual(
      profileSeed.experience
        .toSorted((a, b) => b.startDate.localeCompare(a.startDate))
        .map((job) => job.company),
    );
    expect(profile.projects).toHaveLength(profileSeed.projects.length);
  });

  it('loads every nested list with one SQL query per list, without N+1', async () => {
    const queries: string[] = [];
    prisma.$on('query', (event) => queries.push(event.query));

    const response = await graphql(fullProfileQuery).expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profile.experience.length).toBeGreaterThan(1);
    expect(queries).toHaveLength(6);
    expect(
      queries.filter((sql) => sql.includes('"achievements"')),
    ).toHaveLength(1);
  });

  it('builds employment periods with the current job first', async () => {
    const response = await graphql(fullProfileQuery).expect(200);
    const [current, previous] = response.body.data.profile.experience;

    expect(current.company).toBe('No Hesi');
    expect(current.period).toEqual({
      start: '2026-07',
      end: null,
      isCurrent: true,
      label: 'Jul 2026 - Present',
    });
    expect(previous.period.label).toBe('Jun 2018 - Jul 2026');
    expect(previous.achievements.length).toBeGreaterThan(0);
  });

  it('gives every project a link and no repository for private ones', async () => {
    const response = await graphql(fullProfileQuery).expect(200);
    const projects: {
      url: string | null;
      repositoryUrl: string | null;
      isPrivate: boolean;
    }[] = response.body.data.profile.projects;

    for (const project of projects) {
      expect(project.url ?? project.repositoryUrl).toBeTruthy();
    }
    const privateProjects = projects.filter((project) => project.isPrivate);
    expect(privateProjects.length).toBeGreaterThan(0);
    for (const project of privateProjects) {
      expect(project.repositoryUrl).toBeNull();
    }
  });

  it('keeps the same data when the seed runs again', async () => {
    await app.get(SeedService).run();
    await app.get(SeedService).run();

    expect(await prisma.profile.count()).toBe(1);
    expect(await prisma.link.count()).toBe(profileSeed.links.length);
    expect(await prisma.skill.count()).toBe(profileSeed.skills.length);
    expect(await prisma.experience.count()).toBe(profileSeed.experience.length);
    expect(await prisma.project.count()).toBe(profileSeed.projects.length);
    expect(await prisma.achievement.count()).toBe(
      profileSeed.experience.flatMap((job) => job.achievements).length,
    );
  });

  it('serves Apollo Sandbox to a browser', async () => {
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .set('accept', 'text/html')
      .expect(200);

    expect(response.text).toContain('embeddable-sandbox');
  });

  it('reports health when the database is reachable', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
