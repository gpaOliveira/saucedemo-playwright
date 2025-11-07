import {
  Page,
  BrowserContext,
  Locator,
  expect,
  test as baseTest,
} from '@playwright/test';
import { ProductItemPage } from './ProductItemPage';
import { BasePage, PageIdentifier } from '@pages/base/BasePage';

export class CheckoutOverviewPage extends BasePage {
  readonly taxRate = 0.08;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  public productItemPage: ProductItemPage;

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    super(page, context, PageIdentifier.CheckoutOverview);
    this.subtotal = this.page.getByTestId('subtotal-label');
    this.tax = this.page.getByTestId('tax-label');
    this.total = this.page.getByTestId('total-label');
    this.cancelButton = this.page.getByTestId('cancel');
    this.finishButton = this.page.getByTestId('finish');
    this.productItemPage = new ProductItemPage(page, context);
  }

  async expectMathOK(): Promise<void> {
    const expectedSubtotal = await this.productItemPage.sumPrices(),
      expectedTax = (parseFloat(expectedSubtotal) * this.taxRate).toFixed(2),
      expectedTotal = (
        parseFloat(expectedSubtotal) + parseFloat(expectedTax)
      ).toFixed(2);
    await expect(this.subtotal).toHaveText(`Item total: $${expectedSubtotal}`);
    await expect(this.tax).toHaveText(`Tax: $${expectedTax}`);
    await expect(this.total).toHaveText(`Total: $${expectedTotal}`);
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}

export const test = baseTest.extend<{
  overviewPage: CheckoutOverviewPage;
}>({
  overviewPage: async ({ page, context }, use) => {
    await use(new CheckoutOverviewPage(page, context));
  },
});
