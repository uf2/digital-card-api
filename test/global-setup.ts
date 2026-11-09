import 'dotenv/config';
import { execSync } from 'node:child_process';

/** Applies database migrations once before the e2e suite starts. */
export default function setup(): void {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
}
