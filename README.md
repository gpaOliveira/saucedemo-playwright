# Saucedemo Playwright

This is a demo project creating typescript tests towards https://www.saucedemo.com/v1/ with Playwright framework.

Despite just having tests written there are some extra features - see below for [details on them](#other-interesting-features).

For the sake of being used in future training materials, some tests use [Page Objects](https://playwright.dev/docs/pom) while some do not - see explanations below in [the test plan](#test-plan) to better understand the motivation behing each test.

## tl;dr

Use `npm intall; npm run test` to run all tests.

> [!WARNING]
> Remember to set your `.env` first !

## Commands

Here's a description of the commands available for `npm run`:

- **open:** starts Playwright Codegen pointing to `SAUCEDEMO_BASE_URL` (from your `.env`);
- **clean:** remove local files, including the playwright report;
- **type-check:** type check for Typescript. Run automatically as part of `test`;
- **check:** perform both a `eslist` check and a type check for Typescript. Run automatically as part of `test`;
- **compile:** manually compile our tests (see more [details below](#compile-with-particular-ts-config)). Run automatically as part of `test`;
- **format:** manually fix formatting with Prettier.
- **test:** run all tests, compiling them and linting them first. If you need to [run a particular test](https://playwright.dev/docs/running-tests#run-specific-tests), you can use `spec=my.spec.ts; npm run test`;
- **debug:** run all tests with the `--debug` flag, compiling first. You can use `spec=my.spec.ts; npm run debug` if needed;
- **screenshot:** run all tests with the `--update-snapshots` flag, compiling first. You can use `spec=my.spec.ts; npm run screenshot` if needed. See more about this [below](#screenshots);

## Other interesting features

Since adding tests alone would be simplistic, some other features were added.

### Compile with particular TS Config

Depending on the project needs, one may want to use a particular TS Config when you are using experimental or very recent features of TypeScript.

For such cases the recommendation is to [manually compile the tests TS files](https://playwright.dev/docs/test-typescript#manually-compile-tests-with-typescript). When doing that, is important to also copy over JSON files (see how we added a `include` on `./tsconfig.json`) and the `.env` file (which we `cp` manually).

For such cases, the `npm run test` and `npm run debug` and `npm run screenshot` are already all reading from where the compiled code goes (a folder named `tests-out`).

### Linting + Prettier

ESLinting can be used with playwright to help us not forget about removing pesky `console.log` or adding expectations in every test.

This is run automatically when tests are run, so no special pipeline stage is needed for it.

There's also prettier setup, so remember to run `npm run format` every now and then or else the linting will fail.

### Test Steps

Whenever a test starts to have multiple code lines it may be interesting to separate then in blocks that achieve a certain goal - for example, a block to perform a login, or to sort elements in the screen, or to see an item details.

For those cases, one can group such code lines into a step. By using the `step` fixture, one can create a test as follows:

```ts
test('My test', async ({ step }) => {

    await step.in('<step one>', async () => {
        ....
    });

    await step.in('<step two>', async () => {
        ....
    });
});
```

Moreover, having such `step.in` method allow us to execute some code before or after _every_ step. For now, we take screenshots (see below) and add them to the HTML report, but maybe you'd like to borrow the idea and cleanup our backend or grab some logs.

Alternatively, one could argue that instead of grouping many code lines in a test (and in a step), we could have a broader page object calling other page objects. While this is indeed a viable alternative, such code indirection may confuse some people (especially if one have to jump through many methods until finding a selector they're interested in). Besides, if you do that, you also lose the ability to execute some code before or after _every_ block of code.

### Snapshots

Screnshots (or snapshots) are helpful to detect color changes or missing images, so some of our tests have. They are saved locally in a [versioned controlled folder](tests/snapshots/) for ease of maintenance.

See [the docs](https://playwright.dev/docs/screenshots) for details.

As seen above, we use `step.in` on our tests. Therefore, at the end of every step, we put an automatic `await this.expectScreenshot()`, so one doesn't have to do it directly on the test file if they don't want. Remember this when writing your steps :)

### Github Actions

Tests are run on Github actions (see [workflow](.github/workflows/playwright.yml)).

Moreover, the playwright HTML report is uploaded to a Github Page so one can open it easily from a PR.

### .env file

We use [dotenv](https://www.npmjs.com/package/dotenv) to load a `.env` file on root folder with the following keys:

```bash
SAUCEDEMO_BASE_URL="https://www.saucedemo.com/v1"
```

These are also configured on Github project, so make sure to add there extra keys if you need them.

### Authentication

Despite the tests that validate bad login flows not needing it, all tests are autenticated by default. One can [always avoid it](https://playwright.dev/docs/auth#avoid-authentication-in-some-tests).

See more about this [in the docs](https://playwright.dev/docs/auth#basic-shared-account-in-all-tests)

## Test Plan

Here's a description on _why_ each spec file (or even test exist, so one can better navigate them), so you understand the rationale behind each of them and can navigate to the ones you'd like to know more about:

- [auth.ts](tests/auth.ts): set our authentication context for all tests
- [base.ts](tests/base.ts): override Playwright `test` with our page objects [fixtures](https://playwright.dev/docs/test-fixtures), which come from each page object file (a choice made for ease of navigation - IDEs such as VsCode navigate to the page object file directly when clicking on a fixture)
- [login.1.simple.spec.ts](tests/login/login.1.simple.spec.ts): Simple test to try to login with a bad user - no page object at all.
- [login.2.data.spec.ts](tests/login/login.2.data.spec.ts): Add a second pair of credentials to show how tests can be done based on a data file
- [login.3.pom.spec.ts](tests/login//login.3.pom.spec.ts): Use [Page Objects](https://playwright.dev/docs/pom) to shorten the test with data files further
- [products_listing/product.spec.ts](tests/products/products_listing.spec.ts): meant for tests listing products, validating the amount of products and the sorting dropdown behaviour changing such a list order in the UI
- [products/checkout.spec.ts](tests/checkout.spec.ts): meant for tests involving checking out, validating we can do it with one or multiple items (and the price math in the end holds true along with the items order in the overview), if the back navigation is OK, if empty client information are not accepted, and some other edge cases

## Helper Objects

Under [pages](./pages/) we can find some helper objects and page objects, as follows:

- [AuthenticateData](./pages/authentication/AuthenticateData.ts): interfaces with a JSON file to give us access to information about test users (username, password, error message when login fails, and the playwright session filename)
- [AuthenticatePage\*](./pages/authentication/AuthenticatePage.ts): a page object to login on the Saucedemo environment, isolating such methods and logic from all other page-objects. Use it in tests as a fixture with `authenticatePage`
- [StepController\*](./pages/common/StepController.ts): allow us to have a wrapper to run some code before/after each test step - a feature missing in Playwright (see [more above](#test-steps)). Use it in tests as a fixture with `step`
- [TestInfoPage](./pages/common/TestInfoPage.ts): allow our step wrapper mentioned before to add information on the Playwright HTML report
- [ProductsPage\*](./pages/ProductsPage.ts): a page object to interact with product listing. Use it in tests as a fixture with `productsPage`
- [ProductItemPage](./pages/ProductItemPage.ts): a page object to interact with the product items on the screen, checking if the list items (and their order) are correct. Exposed as a public object in multiple other fixtures (such as `productsPage.productItemPage` and `cartPage.productItemPage`)
- [CartPage\*](./pages/CartPage.ts): a page object to interact with the cart icon and the page accessible by it, where checkout will start. Use it in tests as a fixture with `cartPage`
- [CheckoutInfoPage\*](./pages/CheckoutInfoPage.ts): a page object to interact with the first step of the checkout process, where the user is asked to fill in their personal information. Use it in tests as a fixture with `infoPage`
- [CheckoutOverviewPage\*](./pages/CheckoutOverviewPage.ts): a page object to interact with the second step of the checkout process, containing the overview of the order (same as the CartPage) plus the total price (plus taxes). Use it in tests as a fixture with `overviewPage`
- [CheckoutCompletePage\*](./pages/CheckoutCompletePage.ts): a page object to interact with the confimartion of the order. Use it in tests as a fixture with `completePage`

All those helper marker with `*` objects are accessible as [fixtures](https://playwright.dev/docs/test-fixtures) for tests. We use [mergeTests](https://playwright.dev/docs/test-fixtures#combine-custom-fixtures-from-multiple-modules) in [base.ts](./tests/base.ts) so that the fixture declaration remains in the same file as the page object and IDEs can easily navigate you there when you hover+click on the fixture as part of a test.

## Future ToDos

- Smart v1 vs v0 switch: sometimes Saucedemo URL for v1 is not working so we have to be flexible here. Luckily the selectors are all the same :)
- [WebVitals](https://web.dev/articles/vitals) integration with Playwright
- [DevContainers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) to run tests
