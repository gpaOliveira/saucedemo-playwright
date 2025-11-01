// @ts-check
import { AuthenticateData, UserData } from './AuthenticateData';
import {
  Page,
  BrowserContext,
  expect,
  test as baseTest,
} from '@playwright/test';

export class AuthenticatePage {
  private readonly data;
  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    this.data = new AuthenticateData();
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByTestId('username')).toBeVisible();
  }

  async fillInStandardUser(): Promise<UserData> {
    const user: UserData = this.data.getDefault();
    await this.fillIn(user.username, user.password);
    return user;
  }

  async fillIn(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.locator('#login-button').click();
  }

  async expectError(hasText: string): Promise<void> {
    await expect(
      this.page.getByTestId('error').filter({ hasText }),
    ).toBeVisible();
  }
}

export const test = baseTest.extend<{
  authenticatePage: AuthenticatePage;
}>({
  authenticatePage: async ({ page, context }, use) => {
    await use(new AuthenticatePage(page, context));
  },
});
