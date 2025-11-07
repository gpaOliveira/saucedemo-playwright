import { expect } from '@playwright/test';
import test from '../base';
import azJson from '../data/products_sorted_az.json';
import { ProductItem } from '@product/ProductModels';

test.describe('Products tests', { tag: ['@Checkout', '@PageObject'] }, () => {
  test.describe.configure({ mode: 'parallel' });

  let firstProduct: ProductItem, secondProduct: ProductItem;
  test.beforeEach(async ({ productsPage, cartPage, step }) => {
    firstProduct = azJson[0];
    secondProduct = azJson[1];
    await productsPage.navigate();
    await productsPage.expectVisible();
    await step.in('add first item to the cart', async () => {
      await productsPage.addToCart(firstProduct);
      await cartPage.expectAmountInCart(1);
    });
  });

  test('Complete checkout with one product', async ({
    step,
    infoPage,
    overviewPage,
    completePage,
    cartPage,
    productsPage,
  }) => {
    await step.in('navigate to cart page', async () => {
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      await cartPage.expectAmountInCart(1);
      await cartPage.productItemPage.expectProductWithQuantityAt(
        0,
        firstProduct,
      );
    });

    await step.in('navigate to checkout overview', async () => {
      await cartPage.checkout();
      await infoPage.fillIn('abc', 'abc', 'abc');
      await infoPage.continue();
      await overviewPage.expectVisible();
    });

    await step.in('verify overview and complete', async () => {
      await overviewPage.productItemPage.expectProductWithQuantityAt(
        0,
        firstProduct,
      );
      await overviewPage.expectMathOK();
      await overviewPage.finish();
      await completePage.expectVisible();
      await completePage.backHome();
      await productsPage.expectVisible();
    });
  });

  test('Checkout requires non empty information', async ({
    step,
    infoPage,
    overviewPage,
    cartPage,
  }) => {
    await step.in('navigate to cart page', async () => {
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      await cartPage.expectAmountInCart(1);
      await cartPage.checkout();
      await infoPage.expectVisible();
    });

    await step.in(
      'navigate past information page without a first name is not possible',
      async () => {
        await infoPage.continue();
        await infoPage.expectError('First Name');
      },
    );

    await step.in(
      'navigate past information page without a last name is not possible',
      async () => {
        await infoPage.fillIn('abc', '', '');
        await infoPage.continue();
        await infoPage.expectError('Last Name');
      },
    );

    await step.in('dismissing the error does not help', async () => {
      await infoPage.dismissError();
      await infoPage.continue();
      await infoPage.expectError('Last Name');
    });

    await step.in(
      'also cant proceed without post code the error does not help',
      async () => {
        await infoPage.fillIn('abc', 'abc', '');
        await infoPage.continue();
        await infoPage.expectError('Postal Code');
      },
    );

    await step.in('with the proper information we can proceed', async () => {
      await infoPage.fillIn('abc', 'abc', 'abc');
      await infoPage.continue();
      await overviewPage.expectVisible();
    });
  });

  test('Go back all the way from checkout', async ({
    step,
    productsPage,
    cartPage,
    infoPage,
    overviewPage,
  }) => {
    await step.in('navigate to cart page', async () => {
      await productsPage.expectVisible();
      await cartPage.clickIcon();
      await cartPage.expectVisible();
    });

    await step.in('navigate to checkout page and beyond', async () => {
      await cartPage.checkout();
      await infoPage.expectVisible();
    });

    await step.in('come back all the way', async () => {
      await infoPage.cancel();
      await cartPage.expectVisible();
      await cartPage.continueShopping();
      await productsPage.expectVisible();
    });

    await step.in('checkout again back all the way', async () => {
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      await cartPage.checkout();
      await infoPage.fillIn('abc', 'abc', 'abc');
      await infoPage.continue();
      await overviewPage.expectVisible();
      await overviewPage.cancel();
      await productsPage.expectVisible();
    });
  });

  test('Can go to cart even if no item is selected', async ({
    step,
    productsPage,
    cartPage,
  }) => {
    await step.in('navigate to cart page with no items', async () => {
      await productsPage.removeFromCart(firstProduct);
      await cartPage.expectAmountInCart(0);
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      expect(await cartPage.productItemPage.listNames()).toEqual([]);
    });

    await step.in('navigate back', async () => {
      await cartPage.continueShopping();
      await productsPage.expectVisible();
    });
  });

  test('Add more products then checkout', async ({
    step,
    productsPage,
    cartPage,
    infoPage,
    overviewPage,
    completePage,
  }) => {
    await step.in('add second item to the cart', async () => {
      await productsPage.addToCart(secondProduct);
      await cartPage.expectAmountInCart(2);
    });

    await step.in('navigate to cart page', async () => {
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      await cartPage.expectAmountInCart(2);
    });

    await step.in('navigate to checkout overview', async () => {
      await cartPage.checkout();
      await infoPage.fillIn('abc', 'abc', 'abc');
      await infoPage.continue();
      await overviewPage.expectVisible();
    });

    await step.in('verify overview and complete', async () => {
      await overviewPage.productItemPage.expectProductWithQuantityAt(
        0,
        firstProduct,
      );
      await overviewPage.productItemPage.expectProductWithQuantityAt(
        1,
        secondProduct,
      );
      await overviewPage.expectMathOK();
      await overviewPage.finish();
      await completePage.expectVisible();
      await completePage.backHome();
      await productsPage.expectVisible();
    });
  });

  test('Products in cart are shown in the order they were added', async ({
    step,
    productsPage,
    cartPage,
  }) => {
    await step.in('add second item to the cart', async () => {
      await productsPage.addToCart(secondProduct);
      await cartPage.expectAmountInCart(2);
    });

    await step.in('navigate to cart page', async () => {
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      await cartPage.expectAmountInCart(2);
      await cartPage.productItemPage.expectProductWithQuantityAt(
        0,
        firstProduct,
      );
      await cartPage.productItemPage.expectProductWithQuantityAt(
        1,
        secondProduct,
      );
    });

    await step.in('navigate back and remove all items', async () => {
      await cartPage.continueShopping();
      await productsPage.expectVisible();
      await productsPage.removeFromCart(secondProduct);
      await productsPage.removeFromCart(firstProduct);
      await cartPage.expectAmountInCart(0);
    });

    await step.in('add second then first', async () => {
      await productsPage.addToCart(secondProduct);
      await productsPage.addToCart(firstProduct);
      await cartPage.expectAmountInCart(2);
    });

    await step.in('navigate to cart page again', async () => {
      await cartPage.clickIcon();
      await cartPage.expectVisible();
      await cartPage.expectAmountInCart(2);
      await cartPage.productItemPage.expectProductWithQuantityAt(
        0,
        secondProduct,
      );
      await cartPage.productItemPage.expectProductWithQuantityAt(
        1,
        firstProduct,
      );
    });
  });
});
