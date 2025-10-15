import { mergeTests } from '@playwright/test';
import { test as authenticatePageFixture } from '../pages/common/AuthenticatePage';
import { test as stepControllerFixture } from '../pages/common/StepController';
import { test as productsPageFixture} from '../pages/common/ProductsPage';

/*
We extend Playwright test to add our Pages as fixtures and reuse that logic, so the
tests can decide which ones to use in their declaration.

For more details about this approach, see https://playwright.dev/docs/test-fixtures
*/

const test = mergeTests(
  authenticatePageFixture,
  productsPageFixture,
  stepControllerFixture
);

test.beforeEach(async ({ testInfoPage }) => {
  testInfoPage.addStdoutTitle('Before test');
});

test.afterEach(async ({ testInfoPage }) => {
  testInfoPage.addStdoutTitle('After test');
});

export default test;