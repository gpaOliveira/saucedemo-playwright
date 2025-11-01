// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
const dotenvResult = dotenv.config({ path: path.resolve(__dirname, '.env') });
if (dotenvResult.error) {
  // eslint-disable-next-line no-console
  console.log(dotenvResult.error);
  process.exit(1);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
import { defaultUserSessionFilename } from './pages/authentication/AuthenticateData';
const authFile = path.join(__dirname, defaultUserSessionFilename());

export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 8000,
    /* Snapshot comparison forgiveness */
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
    },
  },
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /*
  Limit the number of workers on CI, use default locally
  More on https://playwright.dev/docs/test-parallel
   */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['line'],
    //['json', { outputFile: 'test-results.json' }],
    //['junit', { outputFile: 'playwright-unit.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 3000,

    /*
    Base URL to use in actions like `await page.goto('/')`.
    Coming from an environment variable so we can change it per environment if needed
    */
    baseURL: process.env.SAUCEDEMO_BASE_URL,

    headless: true,

    //viewport: { width: 1280, height: 1024 },

    ignoreHTTPSErrors: true,

    bypassCSP: true,

    acceptDownloads: true,

    trace: process.env.CI ? 'off' : 'on',

    screenshot: 'on',

    video: 'on',

    timezoneId: 'Europe/Amsterdam',

    testIdAttribute: 'data-test',
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    { name: 'setup', testMatch: /auth\.*/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
        launchOptions: {
          args: ['--allow-insecure-localhost', '--disable-ssl-false-start'],
        },
        //viewport: { width: 1280, height: 1024 },
      },
      dependencies: ['setup'], // Ensure setup runs before authenticated tests
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Path for snapshots */
  snapshotPathTemplate: '../tests/snapshots/{testFilePath}/{arg}{ext}',
});
