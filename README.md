# Digital Business Card API

A backend service that presents me, Vladimir Fedorovykh, as a backend engineer. It exposes a GraphQL API with my profile, links, skills, work history with achievements and projects. Apollo Sandbox is served on the same endpoint, so the API can be explored in a browser.

Stack: TypeScript, Node.js 24, NestJS 12, GraphQL (Apollo Server 5, code-first), Prisma 7, PostgreSQL 17, Docker, Vitest.

- Live Sandbox: not deployed yet
- Source code: https://github.com/uf2/digital-card-api

## Quick start

The only requirement is Docker.

```bash
docker compose up --build
```

Open http://localhost:3000/graphql. The container applies migrations, fills the database and starts the API. Nothing has to be run by hand. The example query is already in the editor, press Run.

Health check: http://localhost:3000/health

## Example query

```graphql
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
```

The query preloaded in Sandbox also asks for links, periods and achievements:

```graphql
query Profile {
  profile {
    name
    headline
    description
    links { kind url }
    skills { name category }
    experience {
      company
      position
      period { label }
      achievements { text }
    }
    projects { name url repositoryUrl isPrivate }
  }
}
```

The full schema is in [schema.gql](schema.gql). It is generated from the code on every start.

## Local development

Requirements: Node.js 24 (see `.nvmrc`), npm 11, Docker.

```bash
cp .env.example .env
docker compose up -d db        # PostgreSQL on localhost:5433
npm ci                         # also runs prisma generate
npm run build
npm run db:setup               # migrations + seed
npm run start:dev
```

Checks:

```bash
npm run lint
npm test                       # unit tests
npm run test:e2e               # e2e tests, need the database from docker compose
```

## Project structure

```
prisma/
  schema.prisma                database schema
  migrations/                  SQL migrations, applied with prisma migrate deploy
src/
  main.ts                      HTTP server
  app.module.ts
  config/                      requireEnv
  common/                      groupByKeys for DataLoader results
  prisma/                      PrismaService (PostgreSQL driver adapter)
  graphql/                     Apollo setup, per-request DataLoaders, request context
  profile/                     profile + links: resolver, service, repository, models
  skill/                       skills: service, repository, model
  experience/                  jobs + achievements + period logic
  project/                     projects
  database/seed/               seed data, seed service and its entry point
  health/                      GET /health
test/                          e2e tests against a real PostgreSQL
docker-entrypoint.sh           migrate, seed, start
render.yaml                    Render blueprint: web service + PostgreSQL
```

## Architecture decisions

### Layers: resolver, service, repository

Each domain module has three layers with one job each.

- **Resolver** knows only GraphQL: which fields exist and which loader returns them. It has no queries and no business logic.
- **Service** holds the business logic: which profile is the owner, grouping rows for loaders, building the employment period (`"Jun 2018 - Jul 2026"`, duration in months, current job). It returns rows as they are when they fit the model, and maps them only where the shape differs (`Experience.period`). Services do not import GraphQL; the "profile not found" GraphQL error is thrown in the resolver.
- **Repository** is the only place in a domain module that talks to Prisma. Sorting and filtering live here. The health check and the seed are infrastructure and use `PrismaService` directly.

This keeps changes local. A new rule touches the service. A new column touches `schema.prisma`, a migration, the seed data and the model. A new client (REST, CLI) can reuse services without GraphQL.

### Code-first GraphQL

The schema is built from TypeScript classes with decorators. Types in the code and in the schema cannot drift apart, and `schema.gql` is still written to disk for review. Field descriptions are visible in Sandbox.

### Nested data without N+1

Nested lists are resolved with field resolvers and [DataLoader](https://github.com/graphql/dataloader). Loaders are created per request in the GraphQL context, so the cache never leaks between users, and resolvers stay singletons (no request-scoped providers).

For the full query above the API sends exactly 6 SQL queries, and this number does not grow with the data:

| Query | SQL |
| --- | --- |
| profile | 1 |
| links, skills, experience, projects | 1 each |
| achievements of all jobs | 1, `WHERE experience_id IN (...)` |

Without the loader, achievements alone would be one query per job. The e2e test `loads every nested list with one SQL query per list, without N+1` counts the real queries through Prisma query events and fails if N+1 comes back.

Fields that are not requested are not loaded at all. For example, `profile { name }` sends one query.

I chose DataLoader over building one large Prisma `include` from the query AST (look-ahead) because it is simpler, it batches across any depth and any number of parents, and it does not tie resolvers to the shape of the incoming query.

The schema has no cycles (a job does not link back to the profile), so a client cannot build a deeply nested query. Because of that I did not add a depth or complexity limit.

### Database

- Every child table has a foreign key with `ON DELETE CASCADE` and a composite index that matches its loader query: `(profile_id, position)`, `(profile_id, start_date DESC)` or `(experience_id, position)`. The loader filters stay index-friendly as data grows. On tables this small PostgreSQL chooses a sequential scan, which is expected.
- `position` keeps the display order from the seed data. Work history is ordered by `start_date`, newest first, with `id` as a tiebreaker.
- `link.kind` and `skill.category` are PostgreSQL enums. The same Prisma enums are registered as GraphQL enums, so there is one source of truth.
- Dates are stored as `DATE`. The period text is built in the service, not stored.
- Every project has a link. Private company projects have `is_private = true`, link to the company site in `url`, and return `null` for `repositoryUrl` because the code is closed.
- Prisma 7 runs with the `@prisma/adapter-pg` driver adapter, so there is no Rust query engine in the image.

### Database setup and seed

The container entrypoint runs three steps on every start:

1. `prisma migrate deploy` applies committed SQL migrations. It never generates or resets anything, so it is safe in production.
2. The seed (`src/database/seed`) writes my data. It runs inside a Nest application context and uses the same `PrismaService` as the API.
3. The API starts.

The seed is idempotent. In one transaction it upserts the profile by its unique `slug` (`OWNER_SLUG`, the same key the `profile` query reads by) and replaces all related rows. The data in `profile.data.ts` is the source of truth: after a change, the next deploy brings the database in line with it, and running the seed many times never creates duplicates (covered by an e2e test). The trade-off is that ids of child rows change after each seed. For a read-only business card this is acceptable. For data edited by users I would match rows by natural keys instead.

The seed is compiled with the app and runs with plain `node`, so the production image needs no `ts-node` or `tsx`.

### Docker

A multi-stage `Dockerfile`: the build stage installs all dependencies, generates the Prisma client and compiles TypeScript. `npm prune --omit=dev` then keeps only production dependencies, including the Prisma schema engine needed by `migrate deploy`. The runtime stage copies `node_modules` and the compiled code from the build stage and runs as the `node` user. `docker compose` waits for the PostgreSQL health check before starting the API.

### Apollo Sandbox in production

The Apollo Sandbox landing page and introspection are on in every environment, because exploring the API is the purpose of this service. In a real product I would turn them off in production.

## Tests

- **Unit** (`src/**/*.spec.ts`): employment period and duration.
- **E2E** (`test/`): the app runs against a real PostgreSQL. The tests cover the example query from the task, the SQL query count, period and order of jobs, project links, repeated seeding, the Sandbox page and the health check.

## Deployment

`render.yaml` describes a free PostgreSQL database and a Docker web service with `/health` as the health check. Render passes `PORT` and `DATABASE_URL` to the container. To deploy: Render dashboard, New, Blueprint, select this repository.

Note: a free Render database expires after 30 days.
