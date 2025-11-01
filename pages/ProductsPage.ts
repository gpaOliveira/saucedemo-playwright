// @ts-check
import {
  Page,
  BrowserContext,
  Locator,
  expect,
  test as baseTest,
} from '@playwright/test';

export enum SortingOptions {
  AZ = 'az',
  ZA = 'za',
  LOHI = 'lohi',
  HILO = 'hilo',
}

type SortingOptionsType =
  | SortingOptions.AZ
  | SortingOptions.ZA
  | SortingOptions.LOHI
  | SortingOptions.HILO;

export type ProductItem = {
  title: string;
  price: number;
};

const SortingFunctions: Record<
  SortingOptions,
  (a: ProductItem, b: ProductItem) => number
> = {
  [SortingOptions.AZ]: (a, b) => a.title.localeCompare(b.title),
  [SortingOptions.ZA]: (a, b) => b.title.localeCompare(a.title),
  [SortingOptions.LOHI]: function (a: ProductItem, b: ProductItem): number {
    if (a.price == b.price)
      // ascending by title
      return a.title.localeCompare(b.title);
    else
      // ascending by price
      return a.price - b.price;
  },
  [SortingOptions.HILO]: function (a: ProductItem, b: ProductItem): number {
    if (a.price == b.price)
      // ascending by title
      return a.title.localeCompare(b.title);
    else
      // descending by price
      return b.price - a.price;
  },
};

export class ProductsPage {
  readonly sortContainer: Locator;
  readonly inventoryItems: Locator;
  sortSelector: string = '.product_sort_container';
  itemSelector: string = '.inventory_item';
  itemNameSelector: string = '.inventory_item_name';
  itemPriceSelector: string = '.inventory_item_price';
  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    this.sortContainer = this.page.locator(this.sortSelector);
    this.inventoryItems = this.page.locator(this.itemSelector);
  }

  async navigate(): Promise<void> {
    // TODO: v1 smart switch
    //await this.page.goto('/v1/inventory');
    await this.page.goto('/inventory.html');
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async selectSorting(option: SortingOptionsType) {
    await this.sortContainer.selectOption(option);
  }

  async expectSorting(option: SortingOptionsType) {
    await expect(this.sortContainer).toHaveValue(option);
  }

  /**
   * Check a product's name and price are seen in the nth position given by index
   * @param {SortingOptionsType} option - The sorting criteria to use.
   * @param {ProductItem} item - The product (which carries the price and title)
   * @example
   * await page.expectProductAt(0, { title: "abc", price: "123" });
   */
  async expectProductAt(index: number, item: ProductItem): Promise<void> {
    const inventoryItem = this.inventoryItems.nth(index);
    await expect(inventoryItem.locator(this.itemNameSelector)).toHaveText(
      item.title,
    );
    await expect(inventoryItem.locator(this.itemPriceSelector)).toHaveText(
      `$${item.price}`,
    );
  }

  /**
   * Get a list of products seen in the listing page sorted by some criteria.
   * @param {SortingOptionsType} option - The sorting criteria to use.
   * @returns {Promise<ProductItem[]>} The list of products
   * @example
   * const result = await page.listProducts(SortingOptions.AZ);
   */
  async listProducts(option: SortingOptionsType): Promise<ProductItem[]> {
    var products = [];
    for (const el of await this.inventoryItems.all()) {
      products.push({
        title: await el.locator(this.itemNameSelector).innerText(),
        price: parseFloat(
          (await el.locator(this.itemPriceSelector).innerText()).replace(
            '$',
            '',
          ),
        ),
      });
    }
    products.sort(SortingFunctions[option]);
    return products;
  }

  /**
   * Check if items we see in the screen are sorted correctly.
   *
   * To know that, we:
   * 1. inform the sorting criteria we expect
   * 2. get the products we see in the screen
   * 3. sort by the criteria we expect
   * 4. check each item in the list (after sorting) matches the position it was retrieved from
   *
   * If our expectation of the sorting criteria is correct, the items we got on step 1. will
   * be the same after step 3.
   *
   * @param {SortingOptionsType} option - The sorting criteria to use.
   * @example
   * await page.expectListProducts(SortingOption.AZ);
   */
  async expectListProducts(option: SortingOptionsType): Promise<void> {
    const screenProducts = await this.listProducts(option);
    for (const [index, item] of screenProducts.entries()) {
      await this.expectProductAt(index, {
        title: item.title,
        price: item.price,
      });
    }
  }
}

export const test = baseTest.extend<{
  productsPage: ProductsPage;
}>({
  productsPage: async ({ page, context }, use) => {
    await use(new ProductsPage(page, context));
  },
});
