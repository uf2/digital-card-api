import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

const { error } = config({ path: '.env.test', override: true, quiet: true });
if (error) {
  throw new Error('Copy .env.test.example to .env.test to run e2e tests');
}

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    fileParallelism: false,
  },
});
