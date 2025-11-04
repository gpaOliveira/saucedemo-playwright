import {
  Page,
  BrowserContext,
  Locator,
  expect,
  test as baseTest,
} from '@playwright/test';
import { ProductItemPage } from './ProductItemPage';

export class CartPage {
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly shoppingCart: Locator;
  public productItemPage: ProductItemPage;
  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    this.continueShoppingButton = this.page.getByTestId('continue-shopping');
    this.checkoutButton = this.page.getByTestId('checkout');
    this.shoppingCart = this.page.getByTestId('shopping-cart-link');
    this.productItemPage = new ProductItemPage(page, context);
  }

  async navigate(): Promise<void> {
    // TODO: v1 smart switch
    //await this.page.goto('/v1/cart');
    await this.page.goto('/cart.html');
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByText('Your Cart')).toBeVisible();
  }

  async expectAmountInCart(amount: number): Promise<void> {
    await expect(this.shoppingCart).toHaveText(amount > 0 ? `${amount}` : '');
  }

  async clickIcon(): Promise<void> {
    await this.shoppingCart.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}

export const test = baseTest.extend<{
  cartPage: CartPage;
}>({
  cartPage: async ({ page, context }, use) => {
    await use(new CartPage(page, context));
  },
});
