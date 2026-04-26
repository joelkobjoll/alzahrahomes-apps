import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const __dirname = path.resolve();

const baseURLAdmin = process.env.ADMIN_WEB_URL ?? 'http://localhost:3000';
const baseURLGuest = process.env.GUEST_WEB_URL ?? 'http://localhost:4321';
const apiURL = process.env.API_URL ?? 'http://localhost:4000';
const authURL = process.env.AUTH_URL ?? 'http://localhost:4001';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalTimeout: 10 * 60 * 1000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseURLAdmin,
      },
      testIgnore: /guest\//,
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        baseURL: baseURLAdmin,
      },
      testIgnore: /guest\//,
    },
    {
      name: 'guest-desktop',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseURLGuest,
      },
      testMatch: /guest\//,
    },
    {
      name: 'guest-mobile',
      use: {
        ...devices['iPhone 12'],
        baseURL: baseURLGuest,
      },
      testMatch: /guest\//,
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @alzahra/api dev',
      url: `${apiURL}/health`,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      env: { PORT: '4000', NODE_ENV: 'development' },
    },
    {
      command: 'pnpm --filter @alzahra/auth dev',
      url: `${authURL}/health`,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      env: { PORT: '4001', NODE_ENV: 'development' },
    },
    {
      command: 'pnpm --filter @alzahra/guest-web dev',
      url: baseURLGuest,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      env: { PUBLIC_API_URL: apiURL, NODE_ENV: 'development' },
    },
    {
      command: 'pnpm --filter @alzahra/admin-web dev',
      url: baseURLAdmin,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      env: { NEXT_PUBLIC_API_URL: 'http://localhost:3001', NODE_ENV: 'development' },
    },
  ],
});
