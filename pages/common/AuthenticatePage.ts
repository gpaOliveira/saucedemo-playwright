// @ts-check
import { Page, BrowserContext, expect, test as baseTest } from '@playwright/test';

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
    await this.fillIn(process.env.SAUCEDEMO_STD_USER, process.env.SAUCEDEMO_STD_PASS);
  }

  async fillIn(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.locator('#login-button').click();
  }

  async expectError(hasText: string): Promise<void> {
    await expect(this.page.getByTestId('error').filter({hasText})).toBeVisible()
  }
}

export const test = baseTest.extend<{
  authenticatePage: AuthenticatePage;
}>({
  authenticatePage: async ({ page, context }, use) => {
    await use(new AuthenticatePage(page, context));
  },
});
