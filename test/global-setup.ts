import { execSync } from 'node:child_process';
import { requireEnv } from '../src/config/env.js';

/** Creates or migrates the test database before the e2e suite starts. */
export default function setup(): void {
  const databaseName = new URL(requireEnv('DATABASE_URL')).pathname.slice(1);
  if (!databaseName.endsWith('_test')) {
    throw new Error(
      `Refusing to use "${databaseName}": e2e tests need a database ending in _test`,
    );
  }
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
}
