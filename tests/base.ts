import { mergeTests } from '@playwright/test';
import { test as authenticatePageFixture } from '@authentication/AuthenticatePage';
import { test as stepControllerFixture } from '@common/StepController';
import { test as productsPageFixture } from '@product/ProductsPage';
import { test as cartPageFixture } from '@product/CartPage';
import { test as infoPageFixture } from '@product/CheckoutInfoPage';
import { test as overviewPageFixture } from '@product/CheckoutOverviewPage';
import { test as completePageFixture } from '@product/CheckoutCompletePage';

/*
We extend Playwright test to add our Pages as fixtures and reuse that logic, so the
tests can decide which ones to use in their declaration.

For more details about this approach, see https://playwright.dev/docs/test-fixtures
*/

const test = mergeTests(
  authenticatePageFixture,
  productsPageFixture,
  cartPageFixture,
  stepControllerFixture,
  infoPageFixture,
  overviewPageFixture,
  completePageFixture,
);

test.beforeEach(async ({ testInfoPage }) => {
  testInfoPage.addStdoutTitle('Before test');
});

test.afterEach(async ({ testInfoPage }) => {
  testInfoPage.addStdoutTitle('After test');
});

export default test;
