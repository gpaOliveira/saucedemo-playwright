import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { ProductItem } from './ProductModels';

export class ProductItemPage {
  readonly inventoryItems: Locator;
  readonly inventoryItemQuantity: Locator;
  readonly inventoryItemName: Locator;
  readonly inventoryItemPrice: Locator;
  readonly inventoryItemRemove: Locator;

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    this.inventoryItems = this.page.getByTestId('inventory-item');
    this.inventoryItemQuantity =
      this.inventoryItems.getByTestId('item-quantity');
    this.inventoryItemName = this.inventoryItems.getByTestId(
      'inventory-item-name',
    );
    this.inventoryItemPrice = this.inventoryItems.getByTestId(
      'inventory-item-price',
    );
  }

  async clickButtonOnProduct(
    product: ProductItem,
    buttonName: 'Remove' | 'Add to cart',
  ): Promise<void> {
    await this.inventoryItems
      .filter({ hasText: product.title })
      .getByRole('button', { name: buttonName })
      .click();
  }

  /**
   * Check a product's name and price are seen in the nth position given by index
   * @param {number} index - The nth position to check
   * @param {ProductItem} item - The product (which carries the price and title)
   * @example
   * await page.expectProductAt(0, { title: "abc", price: "123" });
   */
  async expectProductAt(index: number, item: ProductItem): Promise<void> {
    await expect(this.inventoryItemName.nth(index)).toHaveText(item.title);
    await expect(this.inventoryItemPrice.nth(index)).toHaveText(
      `$${item.price}`,
    );
  }

  /**
   * Check a product's name and price are seen in the nth position given by index, with quantity set
   * @param {number} index - The nth position to check
   * @param {ProductItem} item - The product (which carries the price and title)
   * @example
   * await page.expectProductWithQuantityAt(0, { title: "abc", price: "123" });
   */
  async expectProductWithQuantityAt(
    index: number,
    item: ProductItem,
  ): Promise<void> {
    await expect(this.inventoryItemQuantity.nth(index)).toHaveText('1');
    await this.expectProductAt(index, item);
  }

  /**
   * Get a list of product names
   * @returns {Promise<string[]>} The list of product names
   * @example
   * let names = await this.listNames();
   */
  async listNames(): Promise<string[]> {
    return await this.inventoryItemName.allInnerTexts();
  }

  /**
   * Get a list of product prices
   * @returns {Promise<number[]>} The list of product prices
   * @example
   * let prices = await this.listPrices();
   */
  async listPrices(): Promise<number[]> {
    return (await this.inventoryItemPrice.allInnerTexts()).map((el) =>
      parseFloat(el.replace('$', '')),
    );
  }

  /**
   * Sum up all prices of the list of products in the screen
   * @returns {Promise<string>} The sum of prices (like 3.40 or 4.99)
   * @example
   * let sumPrice = await this.sumPrices();
   */
  async sumPrices(): Promise<string> {
    return (await this.listPrices())
      .reduce((acc, val) => acc + val, 0)
      .toFixed(2);
  }
}
