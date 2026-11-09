# CLAUDE.md

Digital business card API: NestJS 12 (ESM), GraphQL code-first (Apollo 5), Prisma 7 with `@prisma/adapter-pg`, PostgreSQL.

## Commands

- `docker compose up -d db` starts PostgreSQL on localhost:5433 (see `.env.example`).
- `npm run build` generates the Prisma client and compiles to `dist`.
- `npm run db:setup` applies migrations and runs the compiled seed from `dist`, so run `npm run build` first after editing seed data.
- `npm run lint`, `npm test`, `npm run test:e2e` (e2e needs the database).

## Conventions

- ESM: relative imports end in `.js`.
- Layers per module: resolver (GraphQL only), service (business logic, maps rows to models), repository (the only Prisma user in a domain module; health and seed use PrismaService directly). Services do not import GraphQL.
- Nested fields are resolved through per-request DataLoaders in `src/graphql/loaders.factory.ts`; never query the database from a field resolver directly.
- Schema changes: edit `prisma/schema.prisma`, then `npx prisma migrate dev --name <change>`; commit the migration.
- Adding a nested list (for example education): `schema.prisma` and a migration, model, repository, service, module, a loader in `Loaders` and `create()`, the module in `LoadersModule` and `AppModule`, a `@ResolveField` on the parent, seed type, data and a `deleteMany` step in `SeedService`. Then update `fullProfileQuery` and the expected SQL query count in `test/app.e2e-spec.ts`.
- After a change run `npm run lint`, `npm test` and `npm run test:e2e`.
- Seed data lives in `src/database/seed/profile.data.ts`; the seed replaces related rows and must stay idempotent.
- `src/generated` and `schema.gql` are generated; do not edit them by hand.
