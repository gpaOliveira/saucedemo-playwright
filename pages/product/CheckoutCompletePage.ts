import { BasePage, PageIdentifier } from '@pages/base/BasePage';
import {
  Page,
  BrowserContext,
  Locator,
  test as baseTest,
} from '@playwright/test';

export class CheckoutCompletePage extends BasePage {
  readonly backHomeButton: Locator;

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    super(page, context, PageIdentifier.CheckoutComplete);
    this.backHomeButton = this.page.getByTestId('back-to-products');
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
