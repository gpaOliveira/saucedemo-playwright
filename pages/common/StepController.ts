// @ts-check
import { TestInfoPage } from './TestInfoPage';
import { BrowserContext, Page, test as baseTest, expect } from '@playwright/test';

/*
 * StepController supports the reporting of information before/after each test step - a feature missing
 * in Playwright at the moment.
 *
 * Before each step, we:
 * - attach the current page screenshot to the HTML report
 * - add a line to stdout (which is also part of Playwright HTML report)
 *
 * After each step, we:
 * - attach the current page screenshot to the HTML report
 * - automatically expect the page snapshot to match
 * - add a line to stdout (which is also part of Playwright HTML report)
 */
export class StepController {
  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
    readonly testInfoPage: TestInfoPage
  ) {}

  async attachScreenshot(title: string): Promise<void> {
    await this.testInfoPage.attachScreenshot(title, await this.page.screenshot());
  }

  async in(title: string, target: () => void): Promise<void> {
    return test.step(
      title,
      async () => {
        await this.testInfoPage.addStdout('Before step - ' + title);
        await this.attachScreenshot('Before step - ' + title);
        await target.call(this);
        await this.testInfoPage.addStdout('After step - ' + title);
        await this.attachScreenshot('After step - ' + title);
        this.testInfoPage.addStdoutDivisor();
        await this.expectScreenshot(this.page);
      },
      // boxedStep needs that so error messages are shown nicely
      { box: true }
    );
  }

  async expectScreenshot(page: Page): Promise<void> {
    await expect(page).toHaveScreenshot();
  }
}

export const test = baseTest.extend<{
  testInfoPage: TestInfoPage;
  step: StepController;
}>({
  step: async ({ page, context, testInfoPage }, use) => {
    await use(new StepController(page, context, testInfoPage));
  },
  testInfoPage: async ({}, use, testInfo) => {
    await use(new TestInfoPage(testInfo));
  }
});