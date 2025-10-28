// @ts-check
import { Page, BrowserContext, expect, test as baseTest } from '@playwright/test';

export class ProductsPage {
  constructor(readonly page: Page, readonly context: BrowserContext) {}

  async navigate(): Promise<void> {
    await this.page.goto('/v1/inventory');
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByText('Products')).toBeVisible();
  }
}

export const test = baseTest.extend<{
  productsPage: ProductsPage;
}>({
  productsPage: async ({ page, context }, use) => {
    await use(new ProductsPage(page, context));
  },
});
