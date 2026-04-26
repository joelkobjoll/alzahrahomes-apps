import type { Page, Locator } from '@playwright/test';

export class TokenPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly generateButton: Locator;
  readonly tokenInput: Locator;
  readonly copyButton: Locator;
  readonly tokenTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /tokens/i });
    this.generateButton = page.getByRole('button', { name: /generate/i });
    this.tokenInput = page.locator('input[readonly]');
    this.copyButton = page.locator('button[variant="outline"]');
    this.tokenTable = page.locator('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/tokens');
  }

  async generateToken(): Promise<string> {
    await this.generateButton.click();
    await this.tokenInput.waitFor({ state: 'visible' });
    return this.tokenInput.inputValue();
  }

  async expectLoaded(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }
}
