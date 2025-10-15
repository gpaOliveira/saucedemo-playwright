import test from './base';

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

test.describe.configure({ mode: 'parallel' });

test('@Product @PageObject', async ({ productsPage, step }) => {
  await step.in('Product page should be already logged in with standard user', async () => {
    await productsPage.navigate();
    await productsPage.expectVisible();
    await step.expectScreenshot(productsPage.page);
  });
});