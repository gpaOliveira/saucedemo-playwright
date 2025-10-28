import { expect } from '@playwright/test';
import test from '../base';
import { AuthenticateData, UserData } from '../../pages/authentication/AuthenticateData'

const testData = new AuthenticateData().getAllNonDefault()

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

testData.forEach( (data: UserData) => {
    test(`Bad login flow with user ${data.username}`, { tag: '@Login' }, async ({ page }) => {
        // Navigate
        await page.goto('/v1');
        await expect(page.getByTestId('username')).toBeVisible();

        // Fill in bad user credentials
        await page.getByTestId('username').fill(data.username);
        await page.getByTestId('password').fill(data.password);
        await page.locator('#login-button').click();

        // Make sure we see the error message we want
        await expect(page.getByTestId('error').filter({hasText: data.error})).toBeVisible()
      });
});


