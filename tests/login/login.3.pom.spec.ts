import test from '../base';

// Reset storage state for this file to avoid being authenticated so we can test it all here
test.use({ storageState: { cookies: [], origins: [] } });

test(
  'Bad login',
  { tag: ['@Login', '@PageObject', '@Screenshot'] },
  async ({ authenticatePage, step }) => {
    await step.in('Open page and check all is empty', async () => {
      await authenticatePage.open();
    });

    await step.in(
      'Bad login with username and password as standard_user',
      async () => {
        await authenticatePage.fillIn('bad', 'bad');
        await authenticatePage.expectError(
          'Username and password do not match any user in this service',
        );
      },
    );
  },
);
