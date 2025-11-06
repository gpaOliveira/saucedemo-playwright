import {
  Page,
  BrowserContext,
  Locator,
  expect,
  test as baseTest,
} from '@playwright/test';
import {
  ProductItem,
  SortingOptionsType,
  SortingFunctions,
} from './ProductModels';
import { ProductItemPage } from './ProductItemPage';
import { BasePage, PageIdentifier } from '@pages/base/BasePage';

export class ProductsPage extends BasePage {
  readonly sortContainer: Locator;
  public productItemPage: ProductItemPage;
  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    super(page, context, PageIdentifier.Products);
    this.sortContainer = this.page.locator('.product_sort_container');
    this.productItemPage = new ProductItemPage(page, context);
  }

  async selectSorting(option: SortingOptionsType) {
    await this.sortContainer.selectOption(option);
  }

  async expectSorting(option: SortingOptionsType) {
    await expect(this.sortContainer).toHaveValue(option);
  }

  async addToCart(product: ProductItem): Promise<void> {
    await this.productItemPage.clickButtonOnProduct(product, 'Add to cart');
  }

  async removeFromCart(product: ProductItem): Promise<void> {
    await this.productItemPage.clickButtonOnProduct(product, 'Remove');
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
    // get the products we see in the screen
    const names = await this.productItemPage.listNames(),
      prices = await this.productItemPage.listPrices();
    let products: ProductItem[] = [];
    for (var i = 0; i < names.length; i++) {
      products.push({
        title: await names[i],
        price: await prices[i],
      });
    }
    // sort by the criteria we expect
    products.sort(SortingFunctions[option]);
    const productsNames = products.map((el) => el.title),
      productsPrices = products.map((el) => el.price);

    // check each item in the list (after sorting) matches the position it was retrieved from
    expect(names).toEqual(productsNames);
    expect(prices).toEqual(productsPrices);
  }
}

export const test = baseTest.extend<{
  productsPage: ProductsPage;
}>({
  productsPage: async ({ page, context }, use) => {
    await use(new ProductsPage(page, context));
  },
});
