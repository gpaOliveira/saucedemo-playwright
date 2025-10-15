import test from '../base';

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

test('@Login @PageObject @Screenshot Bad login', async ({ authenticatePage, step }) => {
  await step.in('Bad login with username and password as standard_user ', async () => {
    await authenticatePage.open();
    await step.expectScreenshot(authenticatePage.page);
    await authenticatePage.fillIn(
        process.env.SAUCEDEMO_STD_USER,
        process.env.SAUCEDEMO_STD_USER
    );
    await authenticatePage.expectError('Username and password do not match any user in this service')
    await step.expectScreenshot(authenticatePage.page);
  });
});