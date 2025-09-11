// @ts-check
import { TestInfoPage } from './TestInfoPage';
import { BrowserContext, Page, test, expect } from '@playwright/test';

/*
 * StepController supports the reporting of information before/after each test step - a feature missing
 * in Playwright at the moment.
 *
 * After each step, we:
 * - attach the current page screenshot
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
        this.testInfoPage.addStdoutDivisor();
      },
      { box: true }
    );
  }

  async expectScreenshot(page: Page): Promise<void> {
    await expect(page).toHaveScreenshot();
  }
}