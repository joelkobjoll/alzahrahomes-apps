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

  async getStats(): Promise<{ properties: number; tokens: number; bookings: number; messages: number }> {
    const propsText = await this.propertiesCard.locator('..').locator('.text-2xl').textContent().catch(() => '0');
    const tokensText = await this.tokensCard.locator('..').locator('.text-2xl').textContent().catch(() => '0');
    const bookingsText = await this.bookingsCard.locator('..').locator('.text-2xl').textContent().catch(() => '0');
    const messagesText = await this.messagesCard.locator('..').locator('.text-2xl').textContent().catch(() => '0');
    return {
      properties: Number(propsText ?? '0'),
      tokens: Number(tokensText ?? '0'),
      bookings: Number(bookingsText ?? '0'),
      messages: Number(messagesText ?? '0'),
    };
  }
}
