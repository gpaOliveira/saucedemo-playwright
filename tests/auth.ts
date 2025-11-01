import test from './base';
import path from 'path';

test('authenticate', async ({ page, authenticatePage, productsPage }) => {
  await authenticatePage.open();
  const user = await authenticatePage.fillInStandardUser();
  await productsPage.expectVisible();
  await page.context().storageState({
    path: path.join(__dirname, '../' + user.session_filename),
  });
});
