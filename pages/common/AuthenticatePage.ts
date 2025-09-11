// @ts-check
import { Page, BrowserContext, expect } from '@playwright/test';

export class AuthenticatePage {
  constructor(readonly page: Page, readonly context: BrowserContext) {}

  async login(): Promise<void> {
    await this.open();
    await this.fillInStandardUser();
  }

  async open(): Promise<void> {
    await this.page.goto('/v1');
    await expect(this.page.getByTestId('username')).toBeVisible();
  }

  async fillInStandardUser(): Promise<void> {
    await this.page.getByTestId('username').fill(process.env.SAUCEDEMO_STD_USER);
    await this.page.getByTestId('password').fill(process.env.SAUCEDEMO_STD_PASS);
    await this.page.locator('#login-button').click();
  }
}