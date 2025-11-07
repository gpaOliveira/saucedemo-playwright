import { Urls, PageIdentifier, Titles } from './BasePageData';
export { PageIdentifier };
import { Page, BrowserContext, expect } from '@playwright/test';

export class BasePage {
  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
    readonly pageIdentifier: PageIdentifier,
  ) {}

  async navigate(): Promise<void> {
    await this.page.goto(Urls[this.pageIdentifier]);
  }

  async expectVisible(): Promise<void> {
    await expect(
      this.page.getByText(Titles[this.pageIdentifier]),
    ).toBeVisible();
  }
}
