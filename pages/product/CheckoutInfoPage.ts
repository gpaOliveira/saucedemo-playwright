import {
  Page,
  BrowserContext,
  Locator,
  expect,
  test as baseTest,
} from '@playwright/test';

export class CheckoutInformationPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly errorButton: Locator;

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
  ) {
    this.firstName = this.page.getByTestId('firstName');
    this.lastName = this.page.getByTestId('lastName');
    this.postalCode = this.page.getByTestId('postalCode');
    this.cancelButton = this.page.getByTestId('cancel');
    this.continueButton = this.page.getByTestId('continue');
    this.error = this.page.getByTestId('error');
    this.errorButton = this.page.getByTestId('error-button');
  }

  async navigate(): Promise<void> {
    // TODO: v1 smart switch
    //await this.page.goto('/v1/checkout-step-one');
    await this.page.goto('/checkout-step-one.html');
  }

  async expectVisible(): Promise<void> {
    await expect(
      this.page.getByText('Checkout: Your Information'),
    ).toBeVisible();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async fillIn(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async dismissError(): Promise<void> {
    await this.errorButton.click();
    await expect(this.error).toBeHidden();
  }

  async expectError(
    field: 'First Name' | 'Last Name' | 'Postal Code',
  ): Promise<void> {
    await expect(this.error).toBeVisible();
    await expect(this.error).toHaveText(`Error: ${field} is required`);
  }
}

export const test = baseTest.extend<{
  infoPage: CheckoutInformationPage;
}>({
  infoPage: async ({ page, context }, use) => {
    await use(new CheckoutInformationPage(page, context));
  },
});
