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
- **test:** run all tests, compiling them first. If you need to [run a particular test](https://playwright.dev/docs/running-tests#run-specific-tests), you can use `spec=my.spec.ts; npm run test`;
- **debug:** run all tests with the `--debug` flag. You can use `spec=my.spec.ts; npm run debug` if needed;
- **screenshot:** run all tests with the `--update-snapshots` flag. You can use `spec=my.spec.ts; npm run screenshot` if needed. See more about this [below](#screenshots);

## Other interesting features

Since adding tests alone would be simplistic, some other features were added.

### Compile with particular TS Config

Depending on the project needs, one may want to use a particular TS Config when you are using experimental or very recent features of TypeScript.

For such cases the recommendation is to [manually compile the tests](https://playwright.dev/docs/test-typescript#manually-compile-tests-with-typescript)

### Linting

ESLinting can be used with playwright to help us not forget about removing pesky `console.log` or adding expectations in every test.

This is run automatically when tests are run, so no special pipeline stage is needed for it.

### Snapshots

Screnshots (or snapshots) are helpful to detect color changes or missing images, so some of our tests have. They are saved locally in a [versioned controlled folder](tests/snapshots/) for ease of maintenance.

See [the docs](https://playwright.dev/docs/screenshots) for details.

### Github Actions

Tests are run on Github actions (see [workflow](.github/workflows/playwright.yml)).

Moreover, the playwright HTML report is uploaded to a Github Page so one can open it easily from a PR.

### .env file

We use [dotenv](https://www.npmjs.com/package/dotenv) to load a `.env` file on root folder with the following keys:

```bash
SAUCEDEMO_BASE_URL="https://www.saucedemo.com/v1"
SAUCEDEMO_STD_USER="standard_user"
SAUCEDEMO_STD_PASS="check their page"
```

These are also configured on Github project, so make sure to add there extra keys if you need them.

### Authentication

Despite the tests that validate bad login flows not needing it, all tests are autenticated by default. One can [always avoid it](https://playwright.dev/docs/auth#avoid-authentication-in-some-tests).

See more about this [in the docs](https://playwright.dev/docs/auth#basic-shared-account-in-all-tests)

## Test Plan

Here's a description on _why_ each spec file (or even test exist, so one can better navigate them), so you understand the rationale behind each of them and can navigate to the ones you'd like to know more about:


- [auth.ts](tests/auth.ts): set our authentication context for all tests
- [base.ts](tests/base.ts): override Playwright `test` with our page objects [fixtures](https://playwright.dev/docs/test-fixtures), which come from each page object file (a choice made for ease of navigation - IDEs such as VsCode navigate to the page object file directly when clicking on a fixture)
- [product.spec.ts](tests/products.spec.ts): meant for tests listing products, currently only there to make sure `auth.ts` works fine. Later will have actual tests validating the amount of products (and their images and prices) and the sorting dropdown. Maybe will be part of a folder as well to show the different with page-objects tests and without
- [login.1.simple.spec.ts](tests/login/login.1.simple.spec.ts): Simple test to try to login with a bad user - no page object at all.
- [login.2.data.spec.ts](tests/login/login.2.data.spec.ts): Add a second pair of credentials to show how tests can be done based on a data file
- [login.3.pom.spec.ts](tests/login//login.3.pom.spec.ts): Use [Page Objects](https://playwright.dev/docs/pom) to shorten the test with data files further

Future ones include (may all become folders, will decide when I get there):
- **checkout.spec.ts**: meant for tests performing the checkout of a single product and then checkout
- **checkout.multiple.spec.ts**: meant for tests performing the checkout of lots of products (in the products page) and then check the cart number and then checkout
- **checkout.many.spec.ts**: meant for tests performing the checkout of a single product, then back to the list of products, then checkout other, then check the cart, and finally proceed