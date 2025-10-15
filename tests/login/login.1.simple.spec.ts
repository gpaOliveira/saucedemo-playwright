import { expect } from '@playwright/test';
import test from '../base';

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

test('@Login Bad login flow with playwright', async ({ page }) => {
  // Navigate
  await page.goto('/v1');
  await expect(page.getByTestId('username')).toBeVisible();

  // Fill in bad user credentials
  await page.getByTestId('username').fill(process.env.SAUCEDEMO_STD_USER);
  await page.getByTestId('password').fill(process.env.SAUCEDEMO_STD_USER);
  await page.locator('#login-button').click();

  // Make sure we see the error message we want
  await expect(page.getByTestId('error').filter({hasText: 'Username and password do not match any user in this service'})).toBeVisible()
});
