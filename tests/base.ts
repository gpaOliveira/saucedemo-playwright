import { test as baseTest } from '@playwright/test';
import { TestInfoPage } from '../pages/common/TestInfoPage';
import { AuthenticatePage } from '../pages/common/AuthenticatePage';
import { StepController } from '../pages/common/StepController';

/*
We extend Playwright test to add our Pages as fixtures and reuse that logic, so the
tests can decide which ones to use in their declaration.

For more details about this approach, see https://playwright.dev/docs/test-fixtures
*/

const test = baseTest.extend<{
  testInfoPage: TestInfoPage;
  authenticatePage: AuthenticatePage;
  step: StepController;
}>({
  step: async ({ page, context, testInfoPage }, use) => {
    await use(new StepController(page, context, testInfoPage));
  },
  testInfoPage: async ({}, use, testInfo) => {
    await use(new TestInfoPage(testInfo));
  },
  authenticatePage: async ({ page, context }, use) => {
    await use(new AuthenticatePage(page, context));
  },
});

test.beforeEach(async ({ testInfoPage }) => {
  testInfoPage.addStdoutTitle('Before test');
});

test.afterEach(async ({ testInfoPage }) => {
  testInfoPage.addStdoutTitle('After test');
});

export default test;