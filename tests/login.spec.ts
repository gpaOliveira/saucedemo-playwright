import { expect } from '@playwright/test';
import test from './base';

test.describe.configure({ mode: 'parallel' });

test('@Login standard login', async ({ page, authenticatePage, step }) => {
  await step.in('Login with standard user', async () => {
    await authenticatePage.open();
    await step.expectScreenshot(authenticatePage.page);
    await authenticatePage.fillInStandardUser();
    await expect(
      page.getByText('Products')
    ).toBeVisible()
    await step.expectScreenshot(authenticatePage.page);
  });
});