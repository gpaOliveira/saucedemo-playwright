import test from './base';

test.describe.configure({ mode: 'parallel' });

test('Products listing', { tag: ['@Product', '@PageObject'] },async ({ productsPage, step }) => {
  await step.in('Product page should be already logged in with standard user', async () => {
    await productsPage.navigate();
    await productsPage.expectVisible();
  });
});