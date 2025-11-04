import { expect } from '@playwright/test';
import test from '../base';

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

test('Bad login flow with playwright', { tag: '@Login' }, async ({ page }) => {
  // Navigate
  // TODO: v1 smart switch
  //await page.goto('/v1');
  await page.goto('/');
  await expect(page.getByTestId('username')).toBeVisible();

  // Fill in bad user credentials
  await page.getByTestId('username').fill('bad');
  await page.getByTestId('password').fill('bad');
  await page.locator('#login-button').click();

  // Make sure we see the error message we want
  await expect(
    page.getByTestId('error').filter({
      hasText: 'Username and password do not match any user in this service',
    }),
  ).toBeVisible();
});
