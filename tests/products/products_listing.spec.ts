import test from '../base';
import azJson from '../data/products_sorted_az.json';
import { SortingOptions } from '@product/ProductModels';

test.describe('Products tests', { tag: ['@Product', '@PageObject'] }, () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ productsPage }) => {
    await productsPage.navigate();
    await productsPage.expectVisible();
  });

  test('Default sorting according to file', async ({ productsPage, step }) => {
    await step.in('should be correct', async () => {
      await productsPage.expectSorting(SortingOptions.AZ);
      for (const [index, item] of azJson.entries()) {
        await productsPage.productItemPage.expectProductAt(index, {
          title: item.title,
          price: item.price,
        });
      }
    });
  });

  test('Default sorting according to what we see in screen', async ({
    productsPage,
    step,
  }) => {
    await step.in('should be correct', async () => {
      await productsPage.expectListProducts(SortingOptions.AZ);
    });
  });

  test('ZA sorting', async ({ productsPage, step }) => {
    await step.in('should be correct', async () => {
      await productsPage.selectSorting(SortingOptions.ZA);
      await productsPage.expectListProducts(SortingOptions.ZA);
    });
  });

  test('LOW to HI price sorting', async ({ productsPage, step }) => {
    await step.in('should be correct', async () => {
      await productsPage.selectSorting(SortingOptions.LOHI);
      await productsPage.expectListProducts(SortingOptions.LOHI);
    });
  });

  test('HI to LOW price sorting', async ({ productsPage, step }) => {
    await step.in('should be correct', async () => {
      await productsPage.selectSorting(SortingOptions.HILO);
      await productsPage.expectListProducts(SortingOptions.HILO);
    });
  });
});
