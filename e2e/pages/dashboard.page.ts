import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly propertiesCard: Locator;
  readonly tokensCard: Locator;
  readonly bookingsCard: Locator;
  readonly messagesCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /dashboard/i });
    this.sidebar = page.locator('aside');
    this.propertiesCard = page.locator('text=Properties').first();
    this.tokensCard = page.locator('text=Active Tokens').first();
    this.bookingsCard = page.locator('text=Bookings').first();
    this.messagesCard = page.locator('text=Messages').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async navigateToProperties(): Promise<void> {
    await this.page.getByRole('link', { name: /properties/i }).click();
  }

  async navigateToTokens(): Promise<void> {
    await this.page.getByRole('link', { name: /tokens/i }).click();
  }

  async expectLoaded(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
    await this.propertiesCard.waitFor({ state: 'visible' });
    await this.tokensCard.waitFor({ state: 'visible' });
  }
}
