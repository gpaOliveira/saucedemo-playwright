import { expect } from '@playwright/test';
import test from '../base';

const testData = [
    {
        username: process.env.SAUCEDEMO_STD_USER,
        password: process.env.SAUCEDEMO_STD_USER,
        error: 'Username and password do not match any user in this service'
    },
    {
        username: 'locked_out_user',
        password: process.env.SAUCEDEMO_STD_PASS,
        error: 'Sorry, this user has been locked out.'
    }
]

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

testData.forEach(data => {
    test(`@Login Bad login flow with user ${data.username}`, async ({ page }) => {
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


