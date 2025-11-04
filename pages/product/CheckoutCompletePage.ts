import {
  Page,
  BrowserContext,
  Locator,
  expect,
  test as baseTest,
} from '@playwright/test';

export class CheckoutCompletePage {
  readonly backHomeButton: Locator;

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    this.backHomeButton = this.page.getByTestId('back-to-products');
  }

  async navigate(): Promise<void> {
    // TODO: v1 smart switch
    //await this.page.goto('/v1/checkout-complete');
    await this.page.goto('/checkout-complete.html');
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByText('Checkout: Complete')).toBeVisible();
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}

export const test = baseTest.extend<{
  completePage: CheckoutCompletePage;
}>({
  completePage: async ({ page, context }, use) => {
    await use(new CheckoutCompletePage(page, context));
  },
});
