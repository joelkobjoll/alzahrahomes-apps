import type { Page, Locator } from '@playwright/test';

export class TokenPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly userIdInput: Locator;
  readonly typeSelect: Locator;
  readonly generateButton: Locator;
  readonly tokenOutput: Locator;
  readonly copyButton: Locator;
  readonly tokenTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /tokens/i });
    this.userIdInput = page.locator('input#userId');
    this.typeSelect = page.locator('select#type');
    this.generateButton = page.getByRole('button', { name: /generate/i });
    this.tokenOutput = page.locator('input[readonly]');
    this.copyButton = page.getByRole('button', { name: /copy/i });
    this.tokenTable = page.locator('table');
  }

  async goto(): Promise<void> {
    await this.page.goto('/tokens');
  }

  async generateToken(userId: string, type: string = 'api'): Promise<string> {
    await this.userIdInput.fill(userId);
    await this.typeSelect.selectOption(type);
    await this.generateButton.click();
    await this.tokenOutput.waitFor({ state: 'visible' });
    return this.tokenOutput.inputValue();
  }

  async expectLoaded(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }
}
