import { TestInfo } from '@playwright/test';

export class TestInfoPage {
  title: string;
  constructor(public readonly testInfo: TestInfo) {
    this.title = this.testInfo.title;
  }

  addStdout(message: string) {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  addStdoutTitle(message: string) {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] [${this.title}] ${message}`);
    this.addStdoutDivisor();
  }

  addStdoutDivisor() {
    // eslint-disable-next-line no-console
    console.log('******************************************************\n');
  }

  async attachScreenshot(title: string, body: string | Buffer | undefined) {
    await this.testInfo.attach(title, { body, contentType: 'image/png' });
  }
}
