import test from './base';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test('authenticate', async ({ page, authenticatePage, productsPage }) => {
  await authenticatePage.login();
  await productsPage.expectVisible();
  await page.context().storageState({ path: authFile });
});